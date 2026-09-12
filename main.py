# back/main.py
from database import crear_tablas

if __name__ == "__main__":
    crear_tablas()
    print("Tablas creadas. Ahora corre: python seed.py")