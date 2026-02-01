import DeleteButton from './DeleteButton';

export default function MovieListItem(props) {
    return (
        <div>
            <div>
                <strong>{props.movie.title}</strong>
                {' '}
                <span>({props.movie.year})</span>
                {' '}
                directed by {props.movie.director}
                {' '}
                <a  href="#" onClick={props.onEdit}>Edit</a>
                {' '}
                <DeleteButton onDelete={props.onDelete} />
            </div>
            {props.movie.actors && props.movie.actors.length > 0 && (
                <div>
                    Actors: {props.movie.actors.map(actor => `${actor.name} ${actor.surname}`).join(', ')}
                </div>
            )}
            {props.movie.description}
        </div>
    );
}
