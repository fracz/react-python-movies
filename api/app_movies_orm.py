# ORM version
from typing import Any

from fastapi import FastAPI, HTTPException
from playhouse.shortcuts import model_to_dict

from orm_models import Actor, Movie

app_movies_orm = FastAPI()

@app_movies_orm.get("/movies")
async def get_orm_movies():
    movies = Movie.select()
    movies_list = []
    for movie in movies:
        movie_dict = model_to_dict(movie)
        movie_dict["actors"] = [model_to_dict(actor) for actor in movie.actors]
        movies_list.append(movie_dict)
    return movies_list

@app_movies_orm.get("/movies/{movie_id}")
async def get_orm_single_movie(movie_id:int):
    movie = Movie.get_or_none(Movie.id == movie_id)
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    movie_dict = model_to_dict(movie)
    movie_dict["actors"] = [model_to_dict(actor) for actor in movie.actors]
    return movie_dict

@app_movies_orm.get("/movies/{movie_id}/actors")
async def get_actors_for_movie(movie_id:int):
    movie = Movie.get_or_none(Movie.id == movie_id)
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return [model_to_dict(actor) for actor in movie.actors]

@app_movies_orm.post("/movies")
def add_orm_movie(params: dict[str, Any]):
    params_without_actors = {k: v for k, v in params.items() if k != 'actors'}
    movie = Movie.create(**params_without_actors)
    return {"message": f"Movie added successfully. ID: {movie.id}", "movie_id": movie.id}

@app_movies_orm.delete("/movies/{movie_id}")
def delete_orm_movie(movie_id: int):
    query = Movie.delete().where(Movie.id == movie_id)
    count = query.execute()
    if count == 0:
        raise HTTPException(status_code=404, detail=f"no movie found by id: {movie_id}")
    return {"message": f"Movie with ID {movie_id} deleted successfully."}

@app_movies_orm.delete("/movies")
def delete_orm_movies(ids: list[int]):
    query = Movie.delete().where(Movie.id << ids)
    count = query.execute()
    return {"message": f"Deleted {count} movies."}

@app_movies_orm.put("/movies/{movie_id}")
def update_orm_movie(movie_id: int, params: dict[str, Any]):
    movie = Movie.get_or_none(Movie.id == movie_id)
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")

    # Extract actor IDs if present
    actor_ids = params.pop('actorIds', None)

    # Update movie fields
    params_without_actors = {k: v for k, v in params.items() if k not in ['actors', 'actorIds']}
    if params_without_actors:
        query = Movie.update(**params_without_actors).where(Movie.id == movie_id)
        query.execute()

    # Update actor associations if provided
    if actor_ids is not None:
        # Clear existing actor associations
        movie.actors.clear()
        # Add new actor associations
        if actor_ids:
            actors = Actor.select().where(Actor.id << actor_ids)
            for actor in actors:
                movie.actors.add(actor)

    return {"message": f"Movie with ID {movie_id} updated successfully."}

@app_movies_orm.get("/actors")
async def get_orm_actors():
    actors_list = list(Actor.select().dicts())
    return actors_list

@app_movies_orm.get("/actors/{actor_id}")
async def get_orm_single_actor(actor_id:int):
    actor = Actor.get_or_none(Actor.id == actor_id)
    if actor is None:
        raise HTTPException(status_code=404, detail="Actor not found")
    return model_to_dict(actor)

@app_movies_orm.post("/actors")
async def add_orm_actor(params: dict[str, Any]):
    actor = Actor.create(**params)
    return {"message": f"Actor added successfully. ID: {actor.id}", "actor_id": actor.id}

@app_movies_orm.put("/actors/{actor_id}")
async def update_orm_actor(actor_id: int, params: dict[str, Any]):
    actor = Actor.get_or_none(Actor.id == actor_id)
    if actor is None:
        raise HTTPException(status_code=404, detail="Actor not found")
    for key, value in params.items():
        setattr(actor, key, value)
    actor.save()
    return model_to_dict(actor)

@app_movies_orm.delete("/actors/{actor_id}")
async def delete_orm_actor(actor_id: int):
    actor = Actor.get_or_none(Actor.id == actor_id)
    if actor is None:
        raise HTTPException(status_code=404, detail="Actor not found")

    if actor.movies.count() > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Actor {actor.name} {actor.surname} can not be removed, as it is connected to movies."
        )

    actor.delete_instance()
    return {"message": f"Actor with ID {actor_id} deleted successfully."}
