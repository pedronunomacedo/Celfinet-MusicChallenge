import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Input, Tag, theme } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';

export const TagInput = ({ tags, setTags }) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  return (
    <div>
      <div className="mb-4">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center m-1 p-2 bg-gray-200 rounded">
            <span className="mr-2">{tag}</span>
            <button
              onClick={() => handleClose(tag)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      {inputVisible ? (
        <Input
          id="tags-input"
          ref={inputRef}
          type="text"
          size="small"
          className="w-20 border rounded"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag 
          onClick={showInput} 
          className="p-2 border-dashed border rounded cursor-pointer bg-white"
        >
          <PlusOutlined className="mr-1" /> 
          <span>New Tag</span>
        </Tag>
      )}
    </div>
  );
}