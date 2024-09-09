import { createContext, useContext, useEffect, useState } from "react";
import { useImages } from "./ImagesContext";

// Create the albums context
const AlbumsContext = createContext();

export const useAlbums = () => {
    return useContext(AlbumsContext);
};

// Provider component
export const AlbumsProvider = ({ children }) => {
    const [albums, setAlbums] = useState([]);
    const [loadingAlbums, setLoadingAlbums] = useState(true);
    const { selectedImages, setSelectedImages } = useImages();

    useEffect(() => {
        // Fetch albums from an API
        const loadAlbums = async () => {
            // Fetch albums from an API
            await fetchAlbums();
        };

        loadAlbums();
    }, []);

    const fetchAlbums = async () => {
        try {
            const response = await fetch('/api/albums/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `<user-token>` // Add the user token for more security and privacy
                },
            });

            if (!response.ok) {
                console.log(response);
                return;
            }

            const data = await response.json();
            setAlbums(data);
        } catch (error) {
            // Log the response text for debugging
            const errorText = await error.text();
            console.error('Error fecthing albums:', errorText);
            return;
        } finally {
            setLoadingAlbums(false);
        }
    };

    const createAlbum = async (albumData) => {
        // Add the selectedImages to the request body data
        albumData.images = [...selectedImages];

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
                return;
            }

            const newAlbum = await response.json();
            setAlbums((prevAlbums) => [...prevAlbums, newAlbum]);
        } catch (error) {
            // Log the response text for debugging
            const errorText = await error.text();
            console.error('Error creating album:', errorText);
            return;
        } finally {
            setSelectedImages(new Set()); // Reset selected images
        }
    };

    return (
        <AlbumsContext.Provider value={{ albums, fetchAlbums, createAlbum, loadingAlbums }}>
            {children}
        </AlbumsContext.Provider>
    );
};
