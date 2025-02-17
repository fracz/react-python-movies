from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

import schemas
import models

app = FastAPI()
app.mount("/static", StaticFiles(directory="../ui/build/static", check_dir=False), name="static")


@app.get("/")
def serve_react_app():
    return FileResponse("../ui/build/index.html")


@app.get("/movies", response_model=List[schemas.Movie])
def get_movies():
    return list(models.Movie.select())


@app.post("/movies", response_model=schemas.Movie)
def add_movie(movie: schemas.MovieCreate):
    movie_instance = models.Movie.create(**movie.dict(exclude={"actors"}))
    for actor in movie.actors:
        if (actor.name is not None) or (actor.surname is not None):
            actor_instance = models.Actor.create(**actor.dict())
            models.ActorMovie.create(actor=(actor_instance), movie=(movie_instance))
    return movie

@app.get("/movies/{movie_id}", response_model=schemas.Movie)
def get_movie(movie_id: int):
    db_movie = models.Movie.filter(models.Movie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return db_movie

@app.get("/actors", response_model=List[schemas.Actor])
def get_actors():
    return list(models.Actor.select())  

@app.post("/actors", response_model=schemas.Actor)
def add_actor(movie: schemas.ActorBase):
    if (movie.name is None) or (movie.surname is None):
        raise HTTPException(status_code=400, detail="Actor name and surname is required")
    else:
        movie = models.Actor.create(**movie.dict())
    return movie

@app.delete("/movies/{movie_id}", response_model=schemas.Movie)
def get_movie(movie_id: int):
    db_movie = models.Movie.filter(models.Movie.id == movie_id).first()
    db_movie_actors = models.ActorMovie.filter(models.ActorMovie.movie_id == movie_id)
    
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    else:
        for actor in db_movie_actors:
            db_actor = models.Actor.filter(models.Actor.id == actor.actor_id).first()
            db_actor.delete_instance()
            actor.delete_instance()
        db_movie.delete_instance()

    return db_movie
