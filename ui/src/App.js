import './App.css';
import {useEffect, useState} from "react";
import "milligram";
import AddMovieForm from "./AddMovieForm";
import EditMovieForm from "./EditMovieForm";
import MoviesList from "./MoviesList";

function App() {
    const [movies, setMovies] = useState([]);
    const [addingMovie, setAddingMovie] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            const response = await fetch(`/movies`);
            if (response.ok) {
                const movies = await response.json();
                setMovies(movies);
            }
        };
        fetchMovies();
    }, []);

    async function handleAddMovie(movie) {
        console.log('handleAddMovie', movie);
        movie.actors = '';
        const response = await fetch('/movies', {
            method: 'POST',
            body: JSON.stringify(movie),
            headers: {'Content-Type': 'application/json'}
        });
        if (response.ok) {
            let movieResponse = await response.json();
            movie.id = movieResponse.movie_id;
            setMovies([...movies, movie]);
            setAddingMovie(false);
        }
    }

    async function handleUpdateMovie(movieData) {
        const movieToUpdate = {...editingMovie, ...movieData};

        // Remove the actors array but keep actorIds if present
        const { actors, ...params } = movieToUpdate;

        const response = await fetch(`/movies/${movieToUpdate.id}`, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers: {'Content-Type': 'application/json'}
        });
        if (response.ok) {
            // Refetch the movie to get the updated actors
            const movieResponse = await fetch(`/movies/${movieToUpdate.id}`);
            if (movieResponse.ok) {
                const updatedMovie = await movieResponse.json();
                setMovies(movies.map(m => m.id === movieToUpdate.id ? updatedMovie : m));
            }
            setEditingMovie(null);
        }
    }

    async function handleDeleteMovie(movie) {
        console.log(movie);
        const url = `/movies/${movie.id}`
        const response = await fetch(url, {method: 'DELETE'});
        if (response.ok) {
            setMovies(movies.filter(m => m !== movie))
        }
    }

    return (
        <div className="container">
            <h1>My favourite movies to watch</h1>
            {movies.length === 0
                ? <p>No movies yet. Maybe add something?</p>
                : <MoviesList movies={movies}
                              onEditMovie={(movie) => setEditingMovie(movie)}
                              onDeleteMovie={handleDeleteMovie}
                />}
            {editingMovie && (
                <EditMovieForm
                    movie={editingMovie}
                    onMovieSubmit={handleUpdateMovie}
                    onCancel={() => setEditingMovie(null)}
                />
            )}
            {addingMovie
                ? <AddMovieForm onMovieSubmit={handleAddMovie} onCancel={() => setAddingMovie(false)} />
                : (!editingMovie && <button onClick={() => setAddingMovie(true)}>Add a movie</button>)}
        </div>
    );
}

export default App;
