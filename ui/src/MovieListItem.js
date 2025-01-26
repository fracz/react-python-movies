export default function MovieListItem(props) {
    return (
        <div>
            <div>
                <strong>{props.movie.title}</strong>
                {' '}
                <span>({props.movie.year})</span>
                {' '}
                <span>directed by {props.movie.director},</span>
                {' '}
                <a onClick={props.onDelete}>Delete</a>
            </div>
            {props.movie.description}
        </div>
    );
}
