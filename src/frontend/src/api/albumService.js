export const fetchAlbums = async () => {
    try {
        const response = await fetch('/api/albums/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `<user-token>` // Add the user token for more security and privacy
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching albums:', error);
        throw error;  // Rethrow the error to be handled by the caller
    }
};

export const fetchImages = async () => {
    try {
        const response = await fetch('/api/images/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching images:', error);
        throw error;  // Rethrow the error to be handled by the caller
    }
};

export const createAlbum = async (albumData) => {
    try {
        const response = await fetch('/api/albums/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `<user-token>` // Add the user token for more security and privacy
            },
            body: JSON.stringify(albumData),
        });

        if (!response.ok) {
            // Log the response text for debugging
            const errorText = await response.text();
            console.error('Error creating album:', errorText);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating album:', error);
        throw error;  // Rethrow the error to be handled by the caller
    }
};

export const uploadImage = async (imageFile, author, tags) => {
    try {
        let formData = new FormData();
        formData.append('author', author);
        formData.append('tags', JSON.stringify(tags));
        formData.append('image', imageFile);

        // print all values inside formData
        console.log("formData: ")
        for (let pair of formData.entries()) {
            console.log(pair[0] + ':'+ pair[1]); 
        }
        console.log("--------------------------");

        const response = await fetch(`/api/aws-files/upload/`, {
            method: 'POST',
            headers: {
                'Authorization': `<user-token>` // Add the user token for more security and privacy
            },
            body: formData
        });

        if (!response.ok) {
            // Log the response text for debugging
            const errorText = await response.text();
            console.error('Error uploading image:', errorText);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        return {
            status: response.status,
            data: responseData
        };
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;  // Rethrow the error to be handled by the caller
    }
};

export const deleteImage = async (imageId) => {
    console.log("Deleting image with id: ", imageId);

    try {
        const response = await fetch(`/api/aws-files/delete/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `<user-token>` // Add the user token for more security and privacy
            },
            body: JSON.stringify({
                'image_id': imageId
            })
        });

        // if (!response.ok) {
        //     // Log the response text for debugging
        //     const errorText = await response.text();
        //     console.error('Error deleting image:', errorText);
        //     throw new Error(`HTTP error! Status: ${response.status}`);
        // }

        const responseData = await response.json();
        return {
            status: response.status,
            data: responseData
        };
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;  // Rethrow the error to be handled by the caller
    }
};

export const searchMusicQuery = async (query) => {
    console.log("Searching music with query: ", query);

    try {
        const response = await fetch(`/api/spotify-api/search/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `<user-token>` // Add the user token for more security and privacy
            },
            body: JSON.stringify({
                'search-query': query
            })
        });

        if (!response.ok) {
            // Log the response text for debugging
            const errorText = await response.text();
            console.error('Error searching music:', errorText);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        return {
            status: response.status,
            data: responseData
        };
    } catch (error) {
        console.error('Error searching music:', error);
        throw error;  // Rethrow the error to be
    }
};