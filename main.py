# back/main.py
from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter
from schema import schema
from database import crear_tablas

crear_tablas()

app = FastAPI()
graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")