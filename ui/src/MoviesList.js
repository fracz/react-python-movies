import {useState, useEffect} from "react";
import MovieListItem from "./MovieListItem";
import MovieSearch from "./MovieSearch";

export default function MoviesList(props) {
    const [filteredMovies, setFilteredMovies] = useState(props.movies);

    useEffect(() => {
        setFilteredMovies(props.movies);
    }, [props.movies]);

    const moviesToDisplay = filteredMovies;

    return <div>
        <h2>Movies</h2>
        <MovieSearch
            movies={props.movies}
            onFilteredMoviesChange={setFilteredMovies}
        />
        <ul className="movies-list">
            {moviesToDisplay.map(movie => <li key={movie.id}>
                <MovieListItem movie={movie}
                               onEdit={() => props.onEditMovie(movie)}
                               onDelete={() => props.onDeleteMovie(movie)}/>
            </li>)}
        </ul>
    </div>;
}
