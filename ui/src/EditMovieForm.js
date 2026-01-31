import {useState} from "react";

export default function EditMovieForm(props) {
    const [title, setTitle] = useState(props.movie.title);
    const [year, setYear] = useState(props.movie.year);
    const [director, setDirector] = useState(props.movie.director);
    const [description, setDescription] = useState(props.movie.description);

    function handleSubmit(event) {
        event.preventDefault();
        console.log('EditMovieForm handleSubmit', {title, year, director, description});
        if (title.length < 5) {
            return alert('Tytuł jest za krótki');
        }
        props.onMovieSubmit({title, year, director, description});
    }

    return <form onSubmit={handleSubmit}>
        <h2>Edit movie</h2>
        <div>
            <label>Movie ID</label>
            <input type="text" value={props.movie.id} readOnly disabled />
        </div>
        <div>
            <label>Tytuł</label>
            <input type="text" value={title} onChange={(event) => setTitle(event.target.value)}/>
        </div>
        <div>
            <label>Year</label>
            <input type="text" value={year} onChange={(event) => setYear(event.target.value)}/>
        </div>
        <div>
            <label>Director</label>
            <input type="text" value={director} onChange={(event) => setDirector(event.target.value)}/>
        </div>
        <div>
            <label>Description</label>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)}/>
        </div>
        <button type="submit">Update movie</button>
    </form>;
}
