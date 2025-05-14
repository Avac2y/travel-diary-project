import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import { useDropzone } from 'react-dropzone';
import '../style/article.css';

const ArticleForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
    console.log('提交的文章信息：', {
      title,
      content,
      files,
    });
    // 在这里可以添加实际的提交逻辑，例如调用 API
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    },
    accept: { 'image/*': [], 'video/*': [] },
    maxFiles: 5, // 最多上传 5 个文件
  });

  return (
    <form className="article-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>标题</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>内容</label>
        <RichTextEditor
          value={content}
          onChange={setContent}
        />
      </div>
      <div className="form-group">
        <label>上传图片或视频</label>
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>松开鼠标以上传文件</p>
          ) : (
            <p>点击或拖拽文件到这里</p>
          )}
        </div>
        {files.length > 0 && (
          <div>
            <p>已选择文件：</p>
            <ul>
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button type="submit">发布文章</button>
    </form>
  );
};

export default ArticleForm;