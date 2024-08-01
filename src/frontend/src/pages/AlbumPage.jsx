
import React, { useEffect, useState } from 'react';
import { fetchAlbums, createAlbum, fetchImages, deleteImage, uploadImage, searchMusicQuery } from '../api/albumService.js'; // Adjust the import path as necessary
import { DefaultBtn } from '../components/Buttons/DefaultBtn.js';
import { Form, Input, Modal, Upload, Skeleton, message, Select, Button, Tag } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { AnimatePresence, motion } from "framer-motion";
import { TrashIcon as TrashIconOutlined, EyeIcon, CheckCircleIcon, XMarkIcon, ArrowDownTrayIcon, ChevronLeftIcon, ChevronRightIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

import './AlbumPage.css';
import Header from '../Header.js';
import { TagInput } from '../components/Tag/TagInput.jsx';
import MusicPlayer from '../components/MusicPlayer/MusicPlayer.jsx';

const { Option } = Select;

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
        message.error('Image must be smaller than 10MB!');
    }
    return isJpgOrPng && isLt2M;
};

const AlbumComponent = () => {
    const [albums, setAlbums] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadedImage, setUploadedImage] = useState('');
    const [skeletonActive, setSkeletonActive] = useState(true);
    const [selectedImgID, setSelectedImgID] = useState(null);

    const [author, setAuthor] = useState('');
    const [tags, setTags] = useState([]);
    const [promptVisible, setPromptVisible] = useState(false);
    const [pendingFile, setPendingFile] = useState(null);
    const [uploadedImageInfo, setUploadedImageInfo] = useState(null);

    const [imageMusicInfo, setImageMusicInfo] = useState(null);

    const [form] = Form.useForm();

    useEffect(() => {
        const loadAlbums = async () => {
            try {
                const albums = await fetchAlbums();
                setAlbums(albums);
                const images = await fetchImages();
                setImages(images);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
                setSkeletonActive(false);
            }
        };

        loadAlbums();
    }, []);

    const handleCreateAlbum = async (values) => {
        try {
            const newAlbum = { title: 'New Album', creator: values.author, tags: values.tags };
            const data = await createAlbum(newAlbum);
            setAlbums([...albums, data]);
        } catch (error) {
            setError(error);
        }
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        form.validateFields().then((values) => {
            handleCreateAlbum(values);
            setIsModalOpen(false);
            form.resetFields();
        }).catch((info) => {
            console.log('Validate Failed:', info);
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setTags([]);
    };

    const handleImgUpload = async (info) => {
        setUploadedImageInfo(info);
    };

    const handlePromptSubmit = () => {
        form.validateFields()
            .then(async (values) => {
                setAuthor(values.author);

                async function sendData() {
                    let response = await uploadImage(uploadedImageInfo.file.originFileObj, values.author, tags);
                    return response;
                };

                let responseData = await sendData();

                if (responseData.status === 201) {
                    // show a popup toaster
                    message.success('Image uploaded successfully!');

                    setImages((prevImages) => [...prevImages, responseData.data]);
                    setUploadingImage(false);
                    setUploadedImage(responseData.data.image_url);
                    setPromptVisible(false);
                    form.resetFields();
                    setTags([]);
                }
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleDeleteImage = async (imageID) => {
        const response = await deleteImage(imageID);

        if (response.status === 200) {
            const updatedImages = images.filter((image) => image.id !== imageID);
            setImages(updatedImages);
            setSelectedImgID(null);
        }
    };

    const handleModalCancel = () => {
        setPromptVisible(false)
        form.resetFields();
        setTags([]);
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

    const handleSelectedImage = async (imageID, tags) => {
        setSelectedImgID(imageID);
    };

    return (
        <div className='w-full items-center justify-center'>
            {/* Include the header component */}
            <Header />

            {/* Rest of your existing code */}
            {loading && <p>Loading...</p>}

            <div id="album-creation-popup">
                <DefaultBtn onClick={showModal} title="Create album" />

                <Modal
                    title="Create album"
                    open={isModalOpen}
                    onOk={handleCreate} okText="Create"
                    onCancel={handleCancel}
                >
                    <Form layout="vertical" form={form}>
                        <Form.Item
                            label="Author"
                            name="author"
                            rules={[{ required: true, message: 'Please input the author name!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Tags"
                            name="tags"
                            rules={[{ required: true, message: 'Please select tags!' }]}
                        >
                            <TagInput tags={tags} setTags={setTags} />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>

            <ul>
                {albums.map(album => (
                    <li key={album.id}>{album.title} by {album.creator}</li>
                ))}
            </ul>

            <div className='w-5/6 h-full mx-auto space-y-3'>
                <h2 className='font-semibold text-2xl text-gray-800'>All photos</h2>
                <ul id='images-list' className='grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-2'>
                    <AnimatePresence mode='popLayout'>
                        <motion.li
                            id="upload photo"
                            className='w-full aspect-square cursor-pointer bg-gray-100 rounded-md'
                            initial={{
                                border: '2px dashed #9ca3af',
                            }}
                            whileHover={{
                                border: '2px dashed #6879de',
                                transition: {
                                    duration: 0.5,
                                    ease: [0.4, 0, 0.2, 1]
                                }
                            }}
                            onClick={setPromptVisible}
                        >
                            <div
                                name="avatar"
                                className="avatar-uploader flex flex-col items-center justify-center"
                            // listType="picture-card"
                            // onClick={handleUploadButtonClick}
                            // showUploadList={false}
                            // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                            // beforeUpload={(file) => {
                            //     setPendingFile(file);
                            //     if (!author || tags.length === 0) {
                            //         setPromptVisible(true);
                            //         return Upload.LIST_IGNORE;
                            //     }
                            //     return beforeUpload(file);
                            // }}
                            // onChange={handleImgUpload}
                            >
                                {/* {uploadButton} */}
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </motion.li>
                        {loading ? (
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
                                    <Skeleton.Image active={skeletonActive} className='w-full h-full' />
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
                                            delay: (uploadedImage === image.image_url) ? 0 : Math.max(0.15 * index, 1)
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
                                            <motion.li
                                                className='w-[35px] h-[35px] rounded-full flex items-center justify-center cursor-pointer'
                                                whileHover={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                                                }}
                                                onClick={() => handleSelectedImage(image.id)}
                                            >
                                                <EyeIcon width={25} height={25} />
                                            </motion.li>
                                            <motion.li
                                                className='w-[35px] h-[35px] rounded-full flex items-center justify-center cursor-pointer'
                                                whileHover={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                                                }}
                                                onClick={() => handleDeleteImage(image.id)}
                                            >
                                                <TrashIconOutlined width={25} height={25} />
                                            </motion.li>
                                            <motion.li
                                                className='w-[35px] h-[35px] rounded-full flex items-center justify-center cursor-pointer'
                                                whileHover={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                                                }}

                                            >
                                                <CheckCircleIcon width={25} height={25} />
                                            </motion.li>
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
                                        setImageMusicInfo(null);
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
                                    onClick={() => handleDeleteImage(selectedImgID)}
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

            <Modal
                title="Upload image"
                open={promptVisible}
                onOk={handlePromptSubmit}
                onCancel={handleModalCancel}
                okText="Submit"
            >
                <Form
                    layout="vertical"
                    form={form}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Author"
                        name="author"
                        rules={[{ required: true, message: 'Please input the author name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Tags"
                        name="tags"
                        rules={[{ required: false }]}
                    >
                        <TagInput tags={tags} setTags={setTags} />
                    </Form.Item>
                    <Form.Item
                        label="Image"
                        name="image"
                        rules={[{ required: true, message: 'Please upload an image' }]}
                    >
                        <Upload
                            name='file'
                            onChange={handleImgUpload}
                            accept="image/png, image/jpeg, image/jpg"
                            maxCount={1}
                        >
                            <Button icon={<ArrowUpTrayIcon />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>



        </div>
    );

};

export default AlbumComponent;
