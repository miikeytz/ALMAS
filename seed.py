# back/seed.py
from sqlmodel import Session
from database import engine, crear_tablas
from models import Categoria, Producto, Variante

def seed():
    crear_tablas()
    with Session(engine) as session:
        anillos = Categoria(nombre="Anillos")
        collares = Categoria(nombre="Collares")
        aretes = Categoria(nombre="Aretes")
        session.add_all([anillos, collares, aretes])
        session.commit()
        session.refresh(anillos)
        session.refresh(collares)
        session.refresh(aretes)

        p1 = Producto(
            nombre="Anillo de Oro",
            descripcion="Anillo artesanal bañado en oro",
            precio=899.0,
            imagen_url="https://placehold.co/300x300?text=Anillo+Oro",
            stock=10,
            categoria_id=anillos.id,
        )
        p2 = Producto(
            nombre="Collar de Plata",
            descripcion="Collar artesanal de plata .925",
            precio=650.0,
            imagen_url="https://placehold.co/300x300?text=Collar+Plata",
            stock=8,
            categoria_id=collares.id,
        )
        p3 = Producto(
            nombre="Aretes de Perla",
            descripcion="Aretes con perla cultivada",
            precio=420.0,
            imagen_url="https://placehold.co/300x300?text=Aretes+Perla",
            stock=15,
            categoria_id=aretes.id,
        )
        session.add_all([p1, p2, p3])
        session.commit()
        session.refresh(p1)

        v1 = Variante(tipo="talla", valor="7", producto_id=p1.id)
        v2 = Variante(tipo="talla", valor="8", producto_id=p1.id)
        session.add_all([v1, v2])
        session.commit()

        print("Datos de prueba insertados correctamente.")

if __name__ == "__main__":
    seed()