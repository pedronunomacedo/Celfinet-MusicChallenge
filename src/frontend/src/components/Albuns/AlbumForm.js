import React, { useState } from 'react';
import { createAlbum } from '../../api/albumService';

export const AlbumForm = () => {
    // State to handle form inputs and submission status
    const [title, setTitle] = useState('');
    const [creator, setCreator] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Reset messages
        setError(null);
        setSuccess(null);

        // Prepare album data
        const albumData = { title, creator };

        try {
            // Call the API to create a new album
            const response = await createAlbum(albumData);

            if (response) {
                // Handle successful response
                setSuccess('Album created successfully!');
                setTitle(''); // Clear the input fields
                setCreator('');
            }
        } catch (error) {
            // Handle errors
            setError('Failed to create album. Please try again.');
        }
    };

    return (
        <div>
            <h2>Create Album</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="creator">Creator:</label>
                    <input
                        id="creator"
                        type="text"
                        value={creator}
                        onChange={(e) => setCreator(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Album</button>
            </form>

            {success && <p style={{ color: 'green' }}>{success}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default AlbumForm;