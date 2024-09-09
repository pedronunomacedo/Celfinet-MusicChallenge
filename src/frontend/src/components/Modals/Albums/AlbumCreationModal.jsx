import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Modal } from 'antd';
import { DefaultBtn } from '../../Buttons/DefaultBtn';
import { fetchAlbums } from '../../../api/albumService';
import { useAlbums } from '../../../contexts/AlbumsContext';
import { TagInput } from '../../Tag/TagInput';

const AlbumCreationModal = () => {
    const [tags, setTags] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { createAlbum } = useAlbums();
    const [form] = Form.useForm();

    const handleCreate = async () => {
        form.validateFields().then(async (values) => {
            try {
                const newAlbum = { title: values.title, creator: values.author, tags: tags };
                await createAlbum(newAlbum);
            } catch (error) {
                console.error('Error creating album:', error);
            }

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

    return (
        <div id="album-creation-modal">
            <DefaultBtn onClick={() => setIsModalOpen(true)} title="Create album" />
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
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: 'Please input the album title!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <div
                        label="Tags"
                        name="tags"
                    >
                        <span>Tags</span>
                        <TagInput tags={tags} setTags={setTags} />
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default AlbumCreationModal
