import strawberry
from typing import List, Optional
from datetime import datetime
from sqlmodel import Session, select
from database import engine
from strawberry.types import Info
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
    get_token_from_header
)
from models import (
    Producto as ProductoDB,
    Categoria as CategoriaDB,
    Variante as VarianteDB,
    Pedido as PedidoDB,
    DetallePedido as DetallePedidoDB,
    Usuario as UsuarioDB,
)


@strawberry.type
class VarianteType:
    id: int
    tipo: str
    valor: str


@strawberry.type
class ProductoType:
    id: int
    nombre: str
    descripcion: str
    precio: float
    imagen_url: str
    stock: int
    categoria_id: int
    variantes: List[VarianteType]


def producto_a_type(p: ProductoDB, session: Session) -> ProductoType:
    variantes = session.exec(
        select(VarianteDB).where(VarianteDB.producto_id == p.id)
    ).all()
    return ProductoType(
        id=p.id,
        nombre=p.nombre,
        descripcion=p.descripcion,
        precio=p.precio,
        imagen_url=p.imagen_url,
        stock=p.stock,
        categoria_id=p.categoria_id,
        variantes=[VarianteType(id=v.id, tipo=v.tipo, valor=v.valor) for v in variantes],
    )


@strawberry.type
class CategoriaType:
    id: int
    nombre: str
    imagenUrl: Optional[str] = None

    @strawberry.field
    def productos(self) -> List["ProductoType"]:
        with Session(engine) as session:
            prods = session.exec(
                select(ProductoDB).where(ProductoDB.categoria_id == self.id)
            ).all()
            return [producto_a_type(p, session) for p in prods]


@strawberry.type
class PedidoHistorialType:
    id: int
    nombre_comprador: str
    estatus: str
    total: float
    fecha: datetime


@strawberry.type
class Query:
    @strawberry.field
    def products(self, categoria_id: Optional[int] = None, limit: int = 20, offset: int = 0) -> List[ProductoType]:
        with Session(engine) as session:
            query = select(ProductoDB)
            if categoria_id is not None:
                query = query.where(ProductoDB.categoria_id == categoria_id)
            query = query.offset(offset).limit(limit)
            productos = session.exec(query).all()
            return [producto_a_type(p, session) for p in productos]

    @strawberry.field
    def product(self, id: int) -> Optional[ProductoType]:
        with Session(engine) as session:
            p = session.get(ProductoDB, id)
            if p is None:
                return None
            return producto_a_type(p, session)

    @strawberry.field
    def categorias(self) -> List[CategoriaType]:
        with Session(engine) as session:
            cats = session.exec(select(CategoriaDB)).all()
            return [CategoriaType(id=c.id, nombre=c.nombre, imagenUrl=c.imagen_url) for c in cats]

    @strawberry.field
    def categoria(self, id: int) -> Optional[CategoriaType]:
        with Session(engine) as session:
            c = session.get(CategoriaDB, id)
            if c is None:
                return None
            return CategoriaType(id=c.id, nombre=c.nombre, imagenUrl=c.imagen_url)

    @strawberry.field
    def pedidos(self) -> List[PedidoHistorialType]:
        with Session(engine) as session:
            peds = session.exec(select(PedidoDB)).all()
            return [
                PedidoHistorialType(id=p.id, nombre_comprador=p.nombre_comprador, estatus=p.estatus, total=p.total, fecha=p.fecha)
                for p in peds
            ]

    @strawberry.field
    def me(
        self,
        info: Info
    ) -> "UsuarioType":

        usuario = obtener_usuario_actual(info)

        return UsuarioType(
        id=usuario.id,
        nombre=usuario.nombre,
        email=usuario.email,
        rol=usuario.rol,
        )

@strawberry.input
class ProductoInput:
    nombre: str
    descripcion: str
    precio: float
    imagen_url: str
    stock: int
    categoria_id: int


@strawberry.input
class DetallePedidoInput:
    producto_id: int
    variante_id: Optional[int] = None
    cantidad: int
    precio_unitario: float


@strawberry.input
class PedidoInput:
    nombre_comprador: str
    email_comprador: str
    direccion_envio: str
    detalles: List[DetallePedidoInput]


@strawberry.type
class PedidoType:
    id: int
    nombre_comprador: str
    email_comprador: str
    direccion_envio: str
    estatus: str
    total: float
    metodo_pago: Optional[str] = None
    id_pago_mp: Optional[str] = None
    fecha: datetime

@strawberry.input
class RegistroInput:
    nombre: str
    email: str
    password: str

@strawberry.input
class LoginInput:
    email: str
    password: str

@strawberry.type
class UsuarioType:
    id: int
    nombre: str
    email: str
    rol: str

@strawberry.type
class AuthPayload:
    token: str
    usuario: UsuarioType

def obtener_usuario_actual(
    info: Info
) -> UsuarioDB:

    request = info.context["request"]

    authorization = request.headers.get(
        "Authorization"
    )

    token = get_token_from_header(
        authorization
    )

    if not token:
        raise ValueError(
            "No autenticado."
        )

    payload = decode_access_token(token)

    if not payload:
        raise ValueError(
            "Token inválido o expirado."
        )

    user_id = payload.get("sub")

    if not user_id:
        raise ValueError(
            "Token inválido."
        )

    with Session(engine) as session:

        usuario = session.get(
            UsuarioDB,
            int(user_id)
        )

        if not usuario:
            raise ValueError(
                "Usuario no encontrado."
            )

        if not usuario.activo:
            raise ValueError(
                "Usuario inactivo."
            )

        return usuario


@strawberry.type
class Mutation:
    @strawberry.mutation
    def crear_producto(self, info: Info, data: ProductoInput) -> ProductoType:
        usuario = obtener_usuario_actual(info)
        if usuario.rol != "admin":
            raise ValueError("No tienes permiso para crear productos.")

        with Session(engine) as session:
            nuevo = ProductoDB(**data.__dict__)
            session.add(nuevo)
            session.commit()
            session.refresh(nuevo)
            return producto_a_type(nuevo, session)

    @strawberry.mutation
    def actualizar_stock(self, info: Info, id: int, nuevo_stock: int) -> Optional[ProductoType]:
        usuario = obtener_usuario_actual(info)
        if usuario.rol != "admin":
            raise ValueError("No tienes permiso para actualizar stock.")

        with Session(engine) as session:
            p = session.get(ProductoDB, id)
            if p is None:
                return None
            p.stock = nuevo_stock
            session.add(p)
            session.commit()
            session.refresh(p)
            return producto_a_type(p, session)

    @strawberry.mutation
    def eliminar_producto(self, info: Info, id: int) -> bool:
        usuario = obtener_usuario_actual(info)
        if usuario.rol != "admin":
            raise ValueError("No tienes permiso para eliminar productos.")

        with Session(engine) as session:
            p = session.get(ProductoDB, id)
            if p is None:
                return False
            session.delete(p)
            session.commit()
            return True

    @strawberry.mutation
    def crear_pedido(self, info: Info, data: PedidoInput) -> PedidoType:
        usuario = obtener_usuario_actual(info)
        with Session(engine) as session:
            if not data.detalles:
                raise ValueError("El pedido no tiene productos.")

            detalles_con_precio = []
            total = 0.0

            for detalle in data.detalles:
                producto = session.get(ProductoDB, detalle.producto_id)
                if producto is None:
                    raise ValueError(f"Producto {detalle.producto_id} no encontrado.")
                if detalle.cantidad <= 0:
                    raise ValueError(f"La cantidad del producto {producto.nombre} debe ser mayor a cero.")
                if producto.stock < detalle.cantidad:
                    raise ValueError(f"Stock insuficiente para {producto.nombre}.")

                precio_real = float(producto.precio)
                total += detalle.cantidad * precio_real
                detalles_con_precio.append({
                    "producto": producto,
                    "detalle": detalle,
                    "precio_real": precio_real,
                })

            pedido = PedidoDB(
                nombre_comprador=data.nombre_comprador,
                email_comprador=data.email_comprador,
                direccion_envio=data.direccion_envio,
                estatus="pendiente",
                total=float(total),
                metodo_pago="mercadopago",
                usuario_id=usuario.id,
            )
            session.add(pedido)
            session.commit()
            session.refresh(pedido)

            for item in detalles_con_precio:
                detalle = DetallePedidoDB(
                    pedido_id=pedido.id,
                    producto_id=item["detalle"].producto_id,
                    variante_id=item["detalle"].variante_id,
                    cantidad=item["detalle"].cantidad,
                    precio_unitario=item["precio_real"],
                )
                session.add(detalle)

            session.commit()

            return PedidoType(
                id=pedido.id,
                nombre_comprador=pedido.nombre_comprador,
                email_comprador=pedido.email_comprador,
                direccion_envio=pedido.direccion_envio,
                estatus=pedido.estatus,
                total=pedido.total,
                metodo_pago=pedido.metodo_pago,
                id_pago_mp=pedido.id_pago_mp,
                fecha=pedido.fecha,
            )

    @strawberry.mutation
    def actualizar_estado_pago_por_mp(
        self,
        id_pago_mp: str,
        estatus: str,
        external_reference: Optional[str] = None,
    ) -> bool:
        with Session(engine) as session:
            pedido = session.exec(
                select(PedidoDB).where(PedidoDB.id_pago_mp == id_pago_mp)
            ).first()

            if pedido is None and external_reference:
                pedido = session.exec(
                    select(PedidoDB).where(PedidoDB.id == int(external_reference))
                ).first()

            if pedido is None:
                return False

            estatus_normalizado = estatus.lower()
            if estatus_normalizado not in {"pendiente", "pagado", "rechazado", "enviado"}:
                estatus_normalizado = "pendiente"

            pedido.estatus = estatus_normalizado
            pedido.metodo_pago = "mercadopago"
            pedido.id_pago_mp = id_pago_mp
            if estatus_normalizado == "pagado":
                pedido.fecha_pago = datetime.utcnow()

            session.add(pedido)
            session.commit()
            return True

    @strawberry.mutation
    def registrar_usuario(
        self,
        data: RegistroInput
        ) -> UsuarioType:

        with Session(engine) as session:
            usuario_existente = session.exec(
                select(UsuarioDB).where(
                    UsuarioDB.email == data.email
                )
            ).first()

            if usuario_existente:
                raise ValueError(
                    "Ya existe un usuario con ese correo."
                )

            usuario = UsuarioDB(
                nombre=data.nombre,
                email=data.email,
                password_hash=hash_password(
                    data.password
                ),
                rol="cliente",
            )

            session.add(usuario)
            session.commit()
            session.refresh(usuario)

            return UsuarioType(
                id=usuario.id,
                nombre=usuario.nombre,
                email=usuario.email,
                rol=usuario.rol,
            )

    @strawberry.mutation
    def login(
        self,
        data: LoginInput
    ) -> AuthPayload:

        with Session(engine) as session:
            usuario = session.exec(
            select(UsuarioDB).where(
                UsuarioDB.email == data.email
            )
        ).first()

        if not usuario:
            raise ValueError(
                "Correo o contraseña incorrectos."
            )

        if not usuario.password_hash:
            raise ValueError(
                "Correo o contraseña incorrectos."
            )

        if not verify_password(
            data.password,
            usuario.password_hash
        ):
            raise ValueError(
                "Correo o contraseña incorrectos."
            )

        if not usuario.activo:
            raise ValueError(
                "Usuario inactivo."
            )

        token = create_access_token(
            user_id=usuario.id,
            email=usuario.email
        )

        return AuthPayload(
            token=token,
            usuario=UsuarioType(
                id=usuario.id,
                nombre=usuario.nombre,
                email=usuario.email,
                rol=usuario.rol,
            )
        )


schema = strawberry.Schema(query=Query, mutation=Mutation)