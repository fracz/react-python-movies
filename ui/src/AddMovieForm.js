import {useState} from "react";
import { toast } from 'react-toastify';

export default function AddMovieForm(props) {
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [director, setDirector] = useState('');
    const [description, setDescription] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        console.log('AddMovieForm handleSubmit', {title, year, director, description});
        if (title.length < 5) {
            toast.warning('Tytuł jest za krótki');
            return;
        }
        props.onMovieSubmit({title, year, director, description});
        setTitle('');
        setYear('');
        setDirector('');
        setDescription('');
    }

    return <form onSubmit={handleSubmit}>
        <h2>Add movie</h2>
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
        <button type="submit">Add a movie</button>
        &nbsp;
        <button type="button" className="button-outline" onClick={props.onCancel}>Cancel</button>
    </form>;
}
