
import React, { useEffect, useState } from 'react';
import { fetchAlbums, fetchImages } from '../api/albumService.js'; // Adjust the import path as necessary
import { Form } from 'antd';
import AlbumCreationModal from '../components/Modals/Albums/AlbumCreationModal.jsx';
import Footer from '../Footer.js';
import PhotosList from '../components/Photos/PhotosList.jsx';
import './Homepage.css';

const Homepage = () => {
    const [albums, setAlbums] = useState([]);
    const [images, setImages] = useState([]);
    const [loadingAlbums, setLoadingAlbums] = useState(true);
    const [error, setError] = useState(null);
    const [uploadedImage, setUploadedImage] = useState('');
    const [skeletonActive, setSkeletonActive] = useState(true);
    const [selectedImgID, setSelectedImgID] = useState(null);

    const [tags, setTags] = useState([]);
    const [promptVisible, setPromptVisible] = useState(false);
    const [uploadedImageInfo, setUploadedImageInfo] = useState(null);
    const [selectedImgs, setSelectedImgs] = useState(new Set());

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
                setLoadingAlbums(false);
                setSkeletonActive(false);
            }
        };

        loadAlbums();
    }, []);

    // const handleCreateAlbum = async (values) => {
    //     try {
    //         const newAlbum = { title: 'New Album', creator: values.author, tags: tags,  };
    //         const data = await createAlbum(newAlbum);
    //         setAlbums([...albums, data]);
    //     } catch (error) {
    //         setError(error);
    //     }
    // };

    // const showModal = () => {
    //     setIsModalOpen(true);
    // };

    // const handleCreate = () => {
    //     form.validateFields().then((values) => {
    //         handleCreateAlbum(values);
    //         setIsModalOpen(false);
    //         form.resetFields();
    //     }).catch((info) => {
    //         console.log('Validate Failed:', info);
    //     });
    // };

    // const handleCancel = () => {
    //     setIsModalOpen(false);
    //     form.resetFields();
    //     setTags([]);
    // };

    const handleImageSelection = (imageID) => {
        console.log("selectedImgs: ", selectedImgs);
        console.log("imageID: ", imageID);
        if (selectedImgs[imageID] === undefined) {
            setSelectedImgs(prevSelectedImgs => new Set(prevSelectedImgs).add(imageID));
        } else {
            setSelectedImgs(prevSelectedImgs => {
                const newSet = new Set(prevSelectedImgs);
                newSet.delete(imageID);
                return newSet;
            });
        }
    };

    const handleImgUpload = async (info) => {
        setUploadedImageInfo(info);
    };

    // const handlePromptSubmit = () => {
    //     form.validateFields()
    //         .then(async (values) => {

    //             async function sendData() {
    //                 let response = await uploadImage(uploadedImageInfo.file.originFileObj, values.author, tags);
    //                 return response;
    //             };

    //             let responseData = await sendData();

    //             if (responseData.status === 201) {
    //                 // show a popup toaster
    //                 message.success('Image uploaded successfully!');

    //                 setImages((prevImages) => [...prevImages, responseData.data]);
    //                 setUploadedImage(responseData.data.image_url);
    //                 setPromptVisible(false);
    //                 form.resetFields();
    //                 setTags([]);
    //             }
    //         })
    //         .catch((info) => {
    //             console.log('Validate Failed:', info);
    //         });
    // };

    // const handleDeleteImage = async (imageID) => {
    //     const response = await deleteImage(imageID);

    //     if (response.status === 200) {
    //         const updatedImages = images.filter((image) => image.id !== imageID);
    //         setImages(updatedImages);
    //         setSelectedImgID(null);
    //     }
    // };

    // const handleModalCancel = () => {
    //     setPromptVisible(false)
    //     form.resetFields();
    //     setTags([]);
    // };

    // const handleDownload = async (imageID) => {
    //     const image = images.find((image) => image.id === imageID);

    //     const downloadLinkElem = document.createElement("a");
    //     let downloadUrl = image.download_url;

    //     // Dynamically generate the downloadPart based on the image name
    //     const encodedFileName = encodeURIComponent(image.name);
    //     const downloadPart = `&response-content-disposition=attachment%3B%20filename%3D${encodedFileName}`;
    //     downloadUrl += downloadPart;

    //     downloadLinkElem.href = downloadUrl;
    //     downloadLinkElem.download = image.name;

    //     document.body.appendChild(downloadLinkElem); // Required for Firefox
    //     downloadLinkElem.click();
    //     document.body.removeChild(downloadLinkElem);
    // };

    const handleSelectedImage = (imageID) => {
        console.log('handleSelectedImage:', imageID);
        setSelectedImgID(imageID);
    };

    return (
        <div className='w-full items-center justify-center'>

            {/* Rest of your existing code */}
            {loadingAlbums && <p>Loading albums...</p>}

            {/* <AlbumCreationModal setLoading={setLoadingAlbums} /> */}

            <div className='w-5/6 h-full mx-auto space-y-3'>
                <AlbumCreationModal />
                <PhotosList />
            </div>

            {/* {selectedImgID && (
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
            )} */}











            {/* <Modal
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
            </Modal> */}

            {/* <div id="album-creation-popup">
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
                        <div
                            label="Tags"
                            name="tags"
                        >
                            <TagInput tags={tags} setTags={setTags} />
                        </div>
                    </Form>
                </Modal>
            </div> */}
            <Footer/>
        </div>

    );

};

export default Homepage;
