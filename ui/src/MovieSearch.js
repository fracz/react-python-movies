import {useState} from "react";

export default function MovieSearch(props) {
    const [query, setQuery] = useState("");

    const handleSearchChange = (e) => {
        const searchQuery = e.target.value;
        setQuery(searchQuery);

        // Filter movies by title
        const filtered = props.movies.filter(movie =>
            movie.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        props.onFilteredMoviesChange(filtered);
    };

    return (
        <div className="movie-search">
            <input
                type="text"
                placeholder="Search movies by title..."
                value={query}
                onChange={handleSearchChange}
            />
        </div>
    );
}
