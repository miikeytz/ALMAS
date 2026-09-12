# back/schema.py
import strawberry
from typing import List, Optional
from sqlmodel import Session, select
from database import engine
from models import Producto as ProductoDB, Categoria as CategoriaDB, Variante as VarianteDB


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
class Query:
    @strawberry.field
    def products(self, categoria_id: Optional[int] = None) -> List[ProductoType]:
        with Session(engine) as session:
            query = select(ProductoDB)
            if categoria_id is not None:
                query = query.where(ProductoDB.categoria_id == categoria_id)
            productos = session.exec(query).all()
            return [producto_a_type(p, session) for p in productos]

    @strawberry.field
    def product(self, id: int) -> Optional[ProductoType]:
        with Session(engine) as session:
            p = session.get(ProductoDB, id)
            if p is None:
                return None
            return producto_a_type(p, session)


schema = strawberry.Schema(query=Query)