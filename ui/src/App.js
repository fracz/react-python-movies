import './App.css';
import {useEffect, useState} from "react";
import "milligram";
import MovieForm from "./MovieForm";
import MoviesList from "./MoviesList";
// import ActorForm from "./ActorForm";


function App() {
    const [movies, setMovies] = useState([]);
    const [addingMovie, setAddingMovie] = useState(false);
    const [addActor, setAddActor] = useState([]);
    // const [removeMovie, setRemoveMovie] = useState(false);

    //current issue to fix read ID from backend that we can remove directly after adding
    async function handleAddMovie(movie) {
        const response = await fetch(`/movies`, {
          method: 'POST',
          body: JSON.stringify(movie),   
          headers: { 'Content-Type': 'application/json' }    
        });
      
        if (response.ok) {
            // fixed issue by adding reading (async) response deserialized from recived json
          const movieFromServer = await response.json();  
          setMovies([...movies, movieFromServer]);
          console.log(movies);
          setAddingMovie(false);
        }
    
    }

    async function handleRemoveMovie(movie) {
        const response = await fetch(`/movies/${movie.id}`, {
          method: 'DELETE'   
        });
      
        if (response.ok) {
          setMovies([...movies, movie]);
          const removeMovie = movies.filter(m => m !== movie);

          setMovies(removeMovie);
        }
      
    }

    async function handleAddActor(actor) {
        const response = await fetch(`/actors`, {
          method: 'POST',
          body: JSON.stringify(actor),   
          headers: { 'Content-Type': 'application/json' }    
        });
      
        if (response.ok) {
            // fixed issue by adding reading (async) response deserialized from recived json
            const actorFromServer = await response.json();  
            setAddActor([...addActor, actorFromServer]);;
        }
    
    }

    //use effect = it will fetch data from backend only on start 
    // 
    useEffect(() => {
        const fetchMovies = async () => {
            const response = await fetch(`/movies`);

            if (response.ok) {
                const movies = await response.json();
                setMovies(movies);
            }
        };
    
        fetchMovies();
// empty array [] gives option that it is executed only onece because array is empty and it guarantte thei1 execution
// in other word effect worka on changes of array so if it is empty never change
    }, []);

    return (
        <div className="container">
            <h1>My favourite movies to watch</h1>
            {movies.length === 0
                ? <p>No movies yet. Maybe add something?</p>
                : <MoviesList movies={movies}
                              onDeleteMovie={handleRemoveMovie}
                />}
            {addingMovie
                ?<div>
                    <MovieForm onMovieSubmit={handleAddMovie}
                              onAddActor={handleAddActor}
                              buttonLabel="Add a movie"/>
                    {/* <ActorForm onAddActor={handleAddActor}
                                 buttonLabel="Add an actor"/> */}
                    </div>
                : <button onClick={() => setAddingMovie(true)}>Add a movie</button>}
            
        </div>
    );
}

export default App;
