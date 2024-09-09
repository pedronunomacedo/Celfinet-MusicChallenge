import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Skeleton, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { useAlbums } from '../../contexts/AlbumsContext';
import UploadImageModal from '../Modals/Images/UploadImageModal';
import { TrashIcon as TrashIconOutlined, EyeIcon, CheckCircleIcon, XMarkIcon, ArrowDownTrayIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useImages } from '../../contexts/ImagesContext';
import MusicPlayer from '../MusicPlayer/MusicPlayer.jsx';


const PhotosList = () => {
    const [selectedImages, setSelectedImages] = (new Set());
    const { selectedImgID, setSelectedImgID, deleteImage, images, loadingImages } = useImages(null);

    const handleImageSelection = (imageID) => {
        console.log("selectedImgs: ", selectedImages);
        console.log("imageID: ", imageID);

        if (selectedImages && selectedImages[imageID] === undefined) {
            setSelectedImages(prevSelectedImgs => new Set(prevSelectedImgs).add(imageID));
        } else {
            setSelectedImages(prevSelectedImgs => {
                const newSet = new Set(prevSelectedImgs);
                newSet.delete(imageID);
                return newSet;
            });
        }
    };

    const handleSelectedImage = (imageID) => {
        console.log('handleSelectedImage:', imageID);
        setSelectedImgID(imageID);
    };

    const handleDownload = async (imageID) => {
        const image = images.find((image) => image.id === imageID);

        const downloadLinkElem = document.createElement("a");
        let downloadUrl = image.download_url;

        // Dynamically generate the downloadPart based on the image name
        const encodedFileName = encodeURIComponent(image.name);
        const downloadPart = `&response-content-disposition=attachment%3B%20filename%3D${encodedFileName}`;
        downloadUrl += downloadPart;

        downloadLinkElem.href = downloadUrl;
        downloadLinkElem.download = image.name;

        document.body.appendChild(downloadLinkElem); // Required for Firefox
        downloadLinkElem.click();
        document.body.removeChild(downloadLinkElem);
    };

    return (
        <>
            <div id="all-photos-section">
                <h2 className='font-semibold text-2xl text-gray-800'>All photos</h2>
                <ul id='images-list' className='grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-2'>
                    <AnimatePresence mode='popLayout'>
                        <UploadImageModal />
                        {loadingImages ? (
                            Array.from({ length: 7 }).map((_, index) => (
                                <motion.li
                                    key={index}
                                    className='items-stretch aspect-square rounded-md'
                                    initial={{
                                        opacity: 0
                                    }}
                                    animate={{
                                        opacity: 1
                                    }}
                                    exit={{
                                        opacity: 0,
                                        transition: {
                                            duration: 0.6
                                        }
                                    }}
                                >
                                    <Skeleton.Image active={loadingImages} className='w-full h-full' />
                                </motion.li>
                            ))
                        ) : (
                            images.map((image, index) => (
                                <motion.li
                                    layout
                                    key={"image-" + image.id}
                                    id={"image-" + image.id}
                                    className='relative items-stretch aspect-square rounded-md'
                                    initial={{
                                        opacity: 0
                                    }}
                                    animate={{
                                        opacity: 1,
                                        transition: {
                                            duration: 0.5,
                                            delay: (index === images.length - 1) ? 0 : Math.max(0.15 * index, 1)
                                        }
                                    }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 100,
                                        damping: 20,
                                        duration: 0.6
                                    }}
                                    exit={{
                                        opacity: 0
                                    }}
                                >
                                    <div className='w-full h-full object-cover rounded-md'>
                                        <img
                                            src={`${image.image_url}`}
                                            alt="Uploaded"
                                            className='w-full h-full object-cover rounded-md'
                                        />
                                    </div>
                                    <motion.div
                                        key={`hoverImgMenu-${index}`}
                                        className='absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center text-white rounded-md'
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                    >
                                        <ul className='flex flex-row space'>
                                            <AnimatePresence mode='sync'>
                                                <motion.li
                                                    className={`w-[35px] h-[35px] rounded-full flex items-center justify-center cursor-pointer ${selectedImages && selectedImages[image.id] ? 'hidden' : 'block'}`}
                                                    whileHover={{
                                                        backgroundColor: 'rgba(255, 255, 255, 0.2)'
                                                    }}
                                                    onClick={() => handleSelectedImage(image.id)}
                                                >
                                                    <EyeIcon width={25} height={25} />
                                                </motion.li>
                                                <motion.li
                                                    className={`w-[35px] h-[35px] rounded-full flex items-center justify-center cursor-pointer ${selectedImages && selectedImages[image.id] ? 'hidden' : 'block'}`}
                                                    whileHover={{
                                                        backgroundColor: 'rgba(255, 255, 255, 0.2)'
                                                    }}
                                                    onClick={() => deleteImage(image.id)}
                                                >
                                                    <TrashIconOutlined width={25} height={25} />
                                                </motion.li>
                                                <motion.li
                                                    className='w-[35px] h-[35px] rounded-full flex items-center justify-center cursor-pointer'
                                                    whileHover={{
                                                        backgroundColor: 'rgba(255, 255, 255, 0.2)'
                                                    }}
                                                    onClick={() => handleImageSelection(image.id)}
                                                >
                                                    <AnimatePresence mode="popLayout">
                                                        {(selectedImages && selectedImages[image.id]) ?
                                                            <CheckCircleSolidIcon width={25} height={25} />
                                                            :
                                                            <CheckCircleIcon width={25} height={25} />
                                                        }
                                                    </AnimatePresence>
                                                </motion.li>
                                            </AnimatePresence>
                                        </ul>
                                    </motion.div>
                                </motion.li>
                            ))
                        )}
                    </AnimatePresence>
                </ul>
            </div>




            {selectedImgID && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75"
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1,
                        transition: {
                            duration: 0.2
                        }
                    }}
                    exit={{
                        opacity: 0,
                        transition: {
                            duration: 0.2
                        }
                    }}
                >
                    <motion.div
                        className="w-full h-full bg-transparent p-4 rounded-md flex flex-col items-center justify-center space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            transition: {
                                duration: 0.4,
                                delay: 0.2
                            }
                        }}
                        exit={{
                            opacity: 0,
                            transition: {
                                duration: 0.2
                            }
                        }}
                    >
                        <div className="flex flex-col justify-center p-4 h-full w-full items-center">
                            <div className='w-full'>
                                <motion.button
                                    className="absolute top-[15px] right-[15px] bg-opacity-40 bg-gray-700 text-white px-4 py-4 rounded-full"
                                    onClick={() => {
                                        setSelectedImgID(null);
                                    }}
                                >
                                    <XMarkIcon width={25} height={25} />
                                </motion.button>
                                <div id="image-tags" className='space-x-2 flex items-center justify-center'>
                                    {images.find(image => image.id === selectedImgID).tags.map((tag, index) => {
                                        return (
                                            <motion.span
                                                key={tag.id}
                                                initial={{
                                                    opacity: 0
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    transition: {
                                                        duration: 0.3,
                                                        delay: 0.3 * index
                                                    }
                                                }}
                                            >
                                                <Tag color={tag.color}>{tag.name}</Tag>
                                            </motion.span>
                                        );
                                    })}
                                </div>
                            </div>
                            <div id="music-player">
                                <MusicPlayer image={images.find(image => image.id === selectedImgID)} tags={images.find(image => image.id === selectedImgID).tags.map(tag => tag.name)} />
                            </div>
                        </div>
                        <motion.img
                            src={images.find(image => image.id === selectedImgID)?.image_url}
                            alt="Selected"
                            className='max-h-[70%] object-contain aspect-square rounded-md'
                        />
                        <div className="flex justify-center p-4 h-full w-full items-center">
                            <div className='rounded-full bg-opacity-50 bg-gray-600 p-4 justify-center items-center flex'>
                                <motion.button
                                    className={`${images.findIndex(image => image.id === selectedImgID) === 0 ? 'text-gray-400' : 'text-white'} px-4 py-2 rounded`}
                                    onClick={() =>
                                        setSelectedImgID(
                                            images.findIndex(image => image.id === selectedImgID) - 1 >= 0 ?
                                                images[images.findIndex(image => image.id === selectedImgID) - 1].id
                                                :
                                                selectedImgID
                                        )
                                    }
                                >
                                    <ChevronLeftIcon width={25} height={25} />
                                </motion.button>
                                <motion.button
                                    className="text-gray-400 px-4 py-2 rounded"
                                    whileHover={{
                                        color: 'white',
                                        transition: {
                                            duration: 0.2
                                        }
                                    }}
                                    onClick={() => deleteImage(selectedImgID)}
                                >
                                    <TrashIconOutlined width={25} height={25} />
                                </motion.button>
                                <motion.button
                                    className="text-gray-400 px-4 py-2 rounded"
                                    whileHover={{
                                        color: 'white',
                                        transition: {
                                            duration: 0.2
                                        }
                                    }}
                                    onClick={() => handleDownload(selectedImgID)}
                                >
                                    <ArrowDownTrayIcon width={25} height={25} />
                                </motion.button>
                                <motion.button
                                    className={`${images.findIndex(image => image.id === selectedImgID) + 1 === images.length ? 'text-gray-400' : 'text-white'} px-4 py-2 rounded`}
                                    onClick={() =>
                                        setSelectedImgID(
                                            images.findIndex(image => image.id === selectedImgID) + 1 < images.length ?
                                                images[images.findIndex(image => image.id === selectedImgID) + 1].id
                                                :
                                                selectedImgID
                                        )
                                    }
                                >
                                    <ChevronRightIcon width={25} height={25} />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </>
    )
}

export default PhotosList
