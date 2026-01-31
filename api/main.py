from fastapi import FastAPI, Body
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Any
import sqlite3
from app_movies_orm import app_movies_orm

class Movie(BaseModel):
    title: str
    year: str
    actors: str

app = FastAPI()

app.mount("/static", StaticFiles(directory="ui/public", check_dir=False), name="static")

@app.get("/")
def serve_react_app():
   return FileResponse("ui/public/index.html")

app.mount("/", app_movies_orm)

# if __name__ == '__main__':
#     app.run()
