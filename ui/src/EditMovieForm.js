import {useState, useEffect} from "react";
import CreatableSelect from "react-select/creatable";
import { toast } from 'react-toastify';

export default function EditMovieForm(props) {
    const [title, setTitle] = useState(props.movie.title);
    const [year, setYear] = useState(props.movie.year);
    const [director, setDirector] = useState(props.movie.director);
    const [description, setDescription] = useState(props.movie.description);
    const [actors, setActors] = useState([]);
    const [selectedActors, setSelectedActors] = useState([]);

    useEffect(() => {
        // Fetch all actors from the API only once
        const fetchActors = async () => {
            try {
                const response = await fetch('/actors');
                if (response.ok) {
                    const actorsData = await response.json();
                    setActors(actorsData);
                } else {
                    toast.error('Failed to fetch actors');
                }
            } catch (error) {
                toast.error('Error fetching actors: ' + error.message);
            }
        };
        fetchActors();
    }, []); // Empty dependency array - fetch only once on mount

    useEffect(() => {
        // Set the initially selected actors from the movie
        if (props.movie.actors && props.movie.actors.length > 0) {
            const initialSelected = props.movie.actors.map(actor => ({
                value: actor.id,
                label: `${actor.name} ${actor.surname}`
            }));
            setSelectedActors(initialSelected);
        }
    }, [props.movie.actors]);

    async function handleCreateActor(inputValue) {
        // Parse the input - expect format "FirstName LastName"
        const parts = inputValue.trim().split(/\s+/);
        if (parts.length < 2) {
            toast.warning('Please enter both first name and last name (e.g., "John Doe")');
            return;
        }

        const name = parts[0];
        const surname = parts.slice(1).join(' '); // np. Jennifer Love Hewitt

        try {
            const response = await fetch('/actors', {
                method: 'POST',
                body: JSON.stringify({ name, surname }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const result = await response.json();
                const newActor = {
                    id: result.actor_id,
                    name,
                    surname
                };

                // Add the new actor to the actors list
                setActors([...actors, newActor]);

                // Add the new actor to selected actors
                const newOption = {
                    value: newActor.id,
                    label: `${newActor.name} ${newActor.surname}`
                };
                setSelectedActors([...selectedActors, newOption]);

                toast.success(`Actor "${newActor.name} ${newActor.surname}" created successfully!`);
                return newOption;
            } else {
                toast.error('Failed to create actor');
            }
        } catch (error) {
            console.error('Error creating actor:', error);
            toast.error('Error creating actor: ' + error.message);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        const actorIds = selectedActors.map(actor => actor.value);
        console.log('EditMovieForm handleSubmit', {title, year, director, description, actorIds});
        if (title.length < 5) {
            toast.warning('Tytuł jest za krótki');
            return;
        }
        props.onMovieSubmit({title, year, director, description, actorIds});
    }

    return <form onSubmit={handleSubmit}>
        <h2>Edit movie</h2>
        <input type="hidden" value={props.movie.id} />
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

        <div style={{ marginBottom: '2rem' }}>
            <label>Actors</label>
            <CreatableSelect
                isMulti
                value={selectedActors}
                onChange={setSelectedActors}
                onCreateOption={handleCreateActor}
                options={actors.map(actor => ({
                    value: actor.id,
                    label: `${actor.name} ${actor.surname}`
                }))}
                placeholder="Select or create actors (e.g., 'John Doe')..."
                formatCreateLabel={(inputValue) => `Create actor: "${inputValue}"`}
            />
        </div>

        <button type="submit">Update movie</button>
        &nbsp;
        <button type="button" className="button-outline" onClick={props.onCancel}>Cancel</button>
    </form>;
}
