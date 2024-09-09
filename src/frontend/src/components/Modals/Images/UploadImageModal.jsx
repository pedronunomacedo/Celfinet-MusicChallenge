import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Form, Input, Modal, Upload, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { uploadImage } from '../../../api/albumService';
import { TagInput } from '../../Tag/TagInput';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

const UploadImageModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadedImageInfo, setUploadedImageInfo] = useState(null);
    const [tags, setTags] = useState([]);
    const [form] = Form.useForm();

    const handlePromptSubmit = () => {
        form.validateFields()
            .then(async (values) => {

                async function sendData() {
                    let response = await uploadImage(uploadedImageInfo.file.originFileObj, values.author, tags);
                    return response;
                };

                let responseData = await sendData();

                console.log("responseData: " + JSON.stringify(responseData));
                if (responseData.status === 201) {
                    // show a popup toaster
                    message.success('Image uploaded successfully!');

                    // setImages((prevImages) => [...prevImages, responseData.data]);
                    // setUploadedImage(responseData.data.image_url);
                    setIsModalOpen(false);
                    form.resetFields();
                    setTags([]);
                }
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setTags([]);
    };

    const handleImgUpload = async (info) => {
        setUploadedImageInfo(info);
    };

    return (
        <>
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
                onClick={() => setIsModalOpen(true)}
            >
                <div
                    name="avatar"
                    className="avatar-uploader flex flex-col items-center justify-center"
                >
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                </div>
            </motion.li>
            <Modal
                title="Upload image"
                open={isModalOpen}
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
        </>
    )
}

export default UploadImageModal
