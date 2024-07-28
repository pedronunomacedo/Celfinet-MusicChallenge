import { useState, useEffect } from 'react';
import { fetchAlbums } from '../api/albumService';

const useAlbums = () => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAlbums = async () => {
            const data = await fetchAlbums();
            setAlbums(data);
            setLoading(false);
        };

        loadAlbums();
    }, []);

    return { albums, loading };
};

export default useAlbums;