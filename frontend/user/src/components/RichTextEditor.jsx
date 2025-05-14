import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useMediaQuery } from 'react-responsive';

const RichTextEditor = ({ value, onChange }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      placeholder="请输入文章内容..."
      style={{ height: isMobile ? '200px' : '300px' }}
    />
  );
};

export default RichTextEditor;