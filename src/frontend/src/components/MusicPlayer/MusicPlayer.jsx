import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PauseCircleIcon, PlayCircleIcon } from '@heroicons/react/24/outline';
import { searchMusicQuery } from '../../api/albumService';
import './MusicPlayer.css';

const MusicPlayer = ({ image, tags }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [musicInfo, setMusicInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const audioRef = useRef(null);

    useEffect(() => {
        const fetchMusic = async () => {
            try {
                setLoading(true);
                const joinedTags = image.tags.map(tag => tag.name).join(' and ');
                const response = await searchMusicQuery(joinedTags);
                setMusicInfo(response.data);
            } catch (error) {
                console.error('Error fetching music:', error);
            } finally {
                setLoading(false);
                setIsPlaying(true);
            }
        };

        fetchMusic();
    }, [image.tags]); // Add dependencies to re-run the effect if image.tags change

    useEffect(() => {
        const handleAutoplay = async () => {
            if (audioRef.current && isPlaying) {
                try {
                    await audioRef.current.play();
                } catch (error) {
                    console.error('Error playing audio:', error);
                }
            } else if (!isPlaying) {
                try {
                    await audioRef.current.pause();
                } catch (error) {
                    console.error('Error pausing audio:', error);
                }
            }
        };

        handleAutoplay();
    }, [isPlaying]); // Add isPlaying as a dependency to manage playback

    const handlePlayPause = () => {
        setIsPlaying(prev => !prev);
    };

    const handleCanPlayThrough = () => {
        // Automatically start playback when the audio is ready
        if (isPlaying && audioRef.current) {
            audioRef.current.play().catch(error => {
                console.error('Error starting playback:', error);
            });
        }
    };

    if (loading) {
        return (
            <span className='text-lg'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="#FF156D" stroke="#FF156D" stroke-width="7" r="15" cx="40" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#FF156D" stroke="#FF156D" stroke-width="7" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#FF156D" stroke="#FF156D" stroke-width="7" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg>
            </span>
        );
    }

    return (
        <div className='flex flex-row space-y-3'>    
            <audio
                ref={audioRef}
                src={musicInfo.preview_url || ''}
                id='myaudio'
                onCanPlayThrough={handleCanPlayThrough}
                // onCanPlayThrough={() => {
                //     // Automatically start playback when the audio is ready
                //     if (!isPlaying) {
                //         audioRef.current.play().catch(error => {
                //             console.error('Error starting playback:', error);
                //         });
                //     }
                // }}
            />
            <button onClick={handlePlayPause} className='mr-4'>
                <AnimatePresence mode='wait'>
                    {isPlaying ? (
                        <motion.div
                            key="pause"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <PauseCircleIcon width={30} height={30} color='white' />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="play"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <PlayCircleIcon width={30} height={30} color='white' />
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>
            <div className="relative text-nowrap overflow-hidden w-20">
                <div className="marquee-text border-r-2 border-l-2 border-opacity-5 border-transparent">
                    <span className='font-semibold text-gray-200'>{musicInfo.music_info.music_name}</span><br />
                    <span className='font-medium text-gray-400'>{musicInfo.music_artists.map(artist => artist.artist_name).join(', ')}</span>
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer;