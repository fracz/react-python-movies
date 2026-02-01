export default function ActorListItem(props) {
    return (
        <div>
            <strong>{props.actor.name} {props.actor.surname}</strong>
        </div>
    );
}
