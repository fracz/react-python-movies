import ActorListItem from "./ActorListItem";

export default function ActorsList(props) {
    return (
        <div>
            <h2>Actors in our database</h2>
            <ul className="actors-list">
                {props.actors.map(actor => (
                    <li key={actor.id}>
                        <ActorListItem actor={actor} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
