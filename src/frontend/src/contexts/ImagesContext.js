import { createContext, useContext, useEffect, useState } from "react";

// Create the albums context
const ImagesContext = createContext();

export const useImages = () => {
    return useContext(ImagesContext);
};

// Provider component
export const ImagesProvider = ({ children }) => {
    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState(new Set());
    const [loadingImages, setLoadingImages] = useState(true);
    const [selectedImgID, setSelectedImgID] = useState(null);

    useEffect(() => {
        const loadImages = async () => {
            // Fetch albums from an API
            await fetchImages();
        };

        loadImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await fetch('/api/images/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                console.error('Error fetching images!');
                return;  // Rethrow the error to be handled by the caller
            }

            const data = await response.json();
            setImages(data);
        } catch (error) {
            console.error('Error fetching images:', error);
            return;  // Rethrow the error to be handled by the caller
        } finally {
            setLoadingImages(false);
        }
    };

    const deleteImage = async (imageID) => {
        console.log("Deleting image with id: ", imageID);
        try {
            const response = await fetch(`/api/aws-files/delete/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `<user-token>` // Add the user token for more security and privacy
                },
                body: JSON.stringify({
                    'image_id': imageID
                })
            });

            if (!response.ok) {
                console.error('Error deleting image!');
                return;  // Rethrow the error to be handled by the caller
            }

            const data = await response.json();
        } catch (error) {
            console.error('Error fetching images:', error);
            return;  // Rethrow the error to be handled by the caller
        } finally {
            const updatedImages = images.filter((image) => image.id !== imageID);
            setImages(updatedImages);
            setSelectedImgID(null);
        }

        //     console.log("Deleting image with id: ", imageId);

        // try {
        //     const response = await fetch(`/api/aws-files/delete/`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `<user-token>` // Add the user token for more security and privacy
        //         },
        //         body: JSON.stringify({
        //             'image_id': imageId
        //         })
        //     });

        //     // if (!response.ok) {
        //     //     // Log the response text for debugging
        //     //     const errorText = await response.text();
        //     //     console.error('Error deleting image:', errorText);
        //     //     throw new Error(`HTTP error! Status: ${response.status}`);
        //     // }

        //     const responseData = await response.json();
        //     return {
        //         status: response.status,
        //         data: responseData
        //     };
        // } catch (error) {
        //     console.error('Error deleting image:', error);
        //     throw error;  // Rethrow the error to be handled by the caller
        // }
    };

    return (
        <ImagesContext.Provider value={{ images, fetchImages, deleteImage, loadingImages, selectedImages, setSelectedImages, setSelectedImgID, selectedImgID }}>
            {children}
        </ImagesContext.Provider>
    );
};
