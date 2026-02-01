import {useEffect, useState} from "react";
import ActorsList from "./ActorsList";
import { toast } from 'react-toastify';

function ActorsPage() {
    const [actors, setActors] = useState([]);

    useEffect(() => {
        const fetchActors = async () => {
            try {
                const response = await fetch(`/actors`);
                if (response.ok) {
                    const actors = await response.json();
                    setActors(actors);
                } else {
                    toast.error('Failed to fetch actors');
                }
            } catch (error) {
                toast.error('Error fetching actors: ' + error.message);
            }
        };
        fetchActors();
    }, []);

    return (
        <div className="container">
            <h1>Actors</h1>
            {actors.length === 0
                ? <p>No actors yet.</p>
                : <ActorsList actors={actors} />}
        </div>
    );
}

export default ActorsPage;
