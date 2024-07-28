import React from 'react';

const AlbumList = ({ albums }) => (
    <ul>
        {albums.map(album => (
            <li key={album.id}>{album.title}</li>
        ))}
    </ul>
);

export default AlbumList;