"""These are only the base endpoints covered."""
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

def test_read_movies():
    response = client.get("/movies")
    assert response.status_code == 200
    movies = response.json()
    assert isinstance(movies, list)
    if len(movies) > 0:
        for movie in movies:
            assert "actors" in movie

def test_read_movie_actors():
    response = client.get("/movies/1/actors")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_actor_lifecycle():
    actor_id = 20

    # UWAGA: idealnie powinniśmy mieć osobną bazę danych dla środowiska testowego.
    # ale na potrzeby tego zadania, lepszy taki test niż żaden.

    # 1. Add a new actor with id 20
    actor_data = {
        "id": actor_id,
        "name": "Test",
        "surname": "Actor"
    }
    response = client.post("/actors", json=actor_data)
    assert response.status_code == 200
    assert response.json()["actor_id"] == actor_id

    # 2. Update its surname
    update_data = {"surname": "UpdatedSurname"}
    response = client.put(f"/actors/{actor_id}", json=update_data)
    assert response.status_code == 200
    assert response.json()["surname"] == "UpdatedSurname"

    # 3. Delete it
    response = client.delete(f"/actors/{actor_id}")
    assert response.status_code == 200
    assert response.json() == {"message": f"Actor with ID {actor_id} deleted successfully."}

    # 4. Try to delete an already deleted actor
    response = client.get(f"/actors/{actor_id}")
    assert response.status_code == 404
    assert response.json()["detail"] == "Actor not found"
