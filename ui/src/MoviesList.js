import MovieListItem from "./MovieListItem";

export default function MoviesList(props) {
    return <div>
        <h2>Movies</h2>
        <ul className="movies-list">
            {/* map by id it avoid issue when title is the same */}
            {props.movies.map(movie => <li key={movie.id}>
                <MovieListItem movie={movie} onDelete={() => props.onDeleteMovie(movie)}/>
            </li>)}
        </ul>
    </div>;
}
