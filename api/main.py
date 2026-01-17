from fastapi import FastAPI, Body
import requests
from pydantic import BaseModel
from typing import Any
import sqlite3


class Movie(BaseModel):
    title: str
    year: str
    actors: str

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.get("/sum")
def sum(x: int = 0, y: int = 10):
    return x+y

@app.get("/subtract")
def sum(x: int, y: int):
    return x-y

@app.get("/multiply")
def sum(x: int, y: int):
    return x*y

@app.get("/geocode")
async def sum(lat: float, lon: float):
    # response = requests.get(f"https://geocode.xyz/{lat},{lon}?geoit=json")
    # response = requests.get(f"https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat={lat}&lon={lon}",  headers={"User-Agent": "Mozilla/5.0"})
    response = requests.get(f"https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat={lat}&lon={lon}", headers={"User-Agent": "Mozilla/5.0"})
    # https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=-34.44076&lon=-58.70521
    return response.json()


@app.get('/movies')
def get_movies():  # put application's code here
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    movies = cursor.execute('SELECT * FROM movies')

    output = []
    for movie in movies:
         movie = {'id': movie[0], 'title': movie[1], 'year': movie[2], 'actors': movie[3]}
         output.append(movie)
    return output
    # return cursor.fetchall()

# @app.get('/movies/{movie_id}')
# def get_single_movie(movie_id:int):  # put application's code here
#     db = sqlite3.connect('movies.db')
#     print(movie_id)
#     cursor = db.cursor()
#     movies = cursor.execute(f"SELECT * FROM movies WHERE id={movie_id}")
#     output = []
#     for movie in movies:
#          movie = {'title': movie[1], 'year': movie[2], 'actors': movie[3]}
#          output.append(movie)
#     return output

@app.get('/movies/{movie_id}')
def get_single_movie(movie_id:int):  # put application's code here
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    movie = cursor.execute(f"SELECT * FROM movies WHERE id={movie_id}").fetchone()
    if movie is None:
        return {'message': "Movie not found"}
    return {'title': movie[1], 'year': movie[2], 'actors': movie[3]}

@app.post("/movies")
def add_movie(movie: Movie):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    cursor.execute(f"INSERT INTO movies (title, year, actors) VALUES ('{movie.title}', '{movie.year}', '{movie.actors}')")
    db.commit()
    return {"message": f"Movie with id = {cursor.lastrowid} added successfully"}
    # movie = models.Movie.create(**movie.dict())
    # return movie

@app.post("/movies-new")
def add_movie(params: dict[str, Any]):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    # cursor.execute(f"INSERT INTO movies (title, year, actors) VALUES ('{params['title']}', '{params['year']}', '{params['actors']}')")
    cursor.execute(f"INSERT INTO movies (title, year, actors) VALUES (?, ?, ?)", (params['title'], params['year'], params['actors']))
    db.commit()

    return {"message": f"Movie with id = {cursor.lastrowid} added successfully"}

@app.put("/movies/{movie_id}")
def update_movie(movie_id:int, params: dict[str, Any]):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    cursor.execute(
    "UPDATE movies SET title = ?, year = ?, actors = ? WHERE id = ?",
    (params['title'], params['year'], params['actors'], movie_id)
    )
    db.commit()
    if cursor.rowcount == 0:
        return {"message": f"Movie with id = {movie_id} not found"}
    return {"message": f"Movie with id = {cursor.lastrowid} updated successfully"}

@app.delete("/movies/{movie_id}")
def delete_movie(movie_id:int):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    cursor.execute("DELETE FROM movies WHERE id = ?", (movie_id,))
    db.commit()
    if cursor.rowcount == 0:
        return {"message": f"Movie with id = {movie_id} not found"}
    return {"message": f"Movie with id = {movie_id} deleted successfully"}

@app.delete("/movies")
def delete_movies(movie_id:int):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    cursor.execute("DELETE FROM movies")
    db.commit()
    return {"message": f"Deleted {cursor.rowcount} movies"}


# if __name__ == '__main__':
#     app.run()
