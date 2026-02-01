import {useEffect, useState} from "react";
import AddMovieForm from "./AddMovieForm";
import EditMovieForm from "./EditMovieForm";
import MoviesList from "./MoviesList";
import { toast } from 'react-toastify';

function MoviesPage() {
    const [movies, setMovies] = useState([]);
    const [addingMovie, setAddingMovie] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(`/movies`);
                if (response.ok) {
                    const movies = await response.json();
                    setMovies(movies);
                } else {
                    toast.error('Failed to fetch movies');
                }
            } catch (error) {
                toast.error('Error fetching movies: ' + error.message);
            }
        };
        fetchMovies();
    }, []);

    async function handleAddMovie(movie) {
        console.log('handleAddMovie', movie);
        movie.actors = '';
        try {
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
                toast.success('Movie created successfully!');
            } else {
                toast.error('Failed to create movie');
            }
        } catch (error) {
            toast.error('Error creating movie: ' + error.message);
        }
    }

    async function handleUpdateMovie(movieData) {
        const movieToUpdate = {...editingMovie, ...movieData};

        // Remove the actors array but keep actorIds if present
        const { actors, ...params } = movieToUpdate;

        try {
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
                    toast.success('Movie updated successfully!');
                } else {
                    toast.error('Failed to refetch updated movie');
                }
                setEditingMovie(null);
            } else {
                toast.error('Failed to update movie');
            }
        } catch (error) {
            toast.error('Error updating movie: ' + error.message);
        }
    }

    async function handleDeleteMovie(movie) {
        console.log(movie);
        const url = `/movies/${movie.id}`
        try {
            const response = await fetch(url, {method: 'DELETE'});
            if (response.ok) {
                setMovies(movies.filter(m => m !== movie));
                toast.success('Movie deleted successfully!');
            } else {
                toast.error('Failed to delete movie');
            }
        } catch (error) {
            toast.error('Error deleting movie: ' + error.message);
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

export default MoviesPage;
