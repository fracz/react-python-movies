import { useState } from 'react';
import './DeleteButton.css';

export default function DeleteButton({ onDelete }) {
    const [isConfirming, setIsConfirming] = useState(false);

    const handleDelete = (e) => {
        e.preventDefault();
        onDelete();
        setIsConfirming(false);
    };

    const handleCancel = (e) => {
        e.preventDefault();
        setIsConfirming(false);
    };

    return (
        <>
            <a href="#" onClick={(e) => { e.preventDefault(); setIsConfirming(true); }}>Delete</a>

            {isConfirming && (
                <div className="modal-overlay" onClick={handleCancel}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h5>Confirm Delete</h5>
                        <p>Are you sure you want to delete this movie?</p>
                        <div>
                            <button onClick={handleDelete}>Yes, Delete</button>
                            <button className="button-outline" onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
