import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

function ReviewCard({ post, role, onApprove, onReject, onToggleDelete }) {
  const isDeleted = post.isDeleted;

  return (
 <Card className={`p-3 shadow-sm ${post.isDeleted ? 'bg-light text-muted' : ''}`}>
      <div className="d-flex">
        {/* 左侧图片 */}
        <img
          src={post.images[0]}
          alt="cover"
          className={post.isDeleted ? 'img-deleted' : ''}
          style={{
            width: '120px',
            height: '120px',
            objectFit: 'cover',
            objectPosition: 'left',
            borderRadius: '10px',
            marginRight: '16px'
          }}
        />

{/* 内容区域整体 */}
        <div className="flex-grow-1 d-flex flex-column justify-content-between">
          {/* 上半部分：标题 + 按钮 */}
          <div className="d-flex justify-content-between">
            {/* 标题独立 */}
            <div>
              <h5 className={`fw-bold mb-0 ${post.isDeleted ? 'text-decoration-line-through' : ''}`}>
                {post.title}
              </h5>
              <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                用户ID: {post.author?.id || '未知'}
              </div>
            </div>

            {/* 按钮独立 */}
            <div>
              {role === 'admin' || role === 'auditor' ? (
                <>
                  {post.status === 'pending' && (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => onApprove(post._id)}
                      >
                        通过
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => onReject(post)}
                      >
                        拒绝
                      </Button>
                    </>
                  )}
                  {role === 'admin' && (
                    <Button
                      variant={post.isDeleted ? 'secondary' : 'danger'}
                      size="sm"
                      onClick={() => onToggleDelete(post._id, post.isDeleted)}
                    >
                      {post.isDeleted ? '恢复' : '删除'}
                    </Button>
                  )}
                </>
              ) : null}
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-start mt-2">
  {/* 左侧文案区域 */}
  <div style={{ flex: 1, maxWidth: 'calc(100% - 120px)', wordBreak: 'break-word' }}>
    <p className={`mb-0 ${post.isDeleted ? 'text-muted text-decoration-line-through' : ''}`}>
      {post.content}
    </p>
  </div>

  {/* 右侧状态区域（固定宽度） */}
  <div style={{ width: '105px', textAlign: 'center' }}>
    <span className={`status-badge ${post.isDeleted ? 'status-deleted' : `status-${post.status}`}`}>
      {post.status === 'approved' && '已通过'}
      {post.status === 'rejected' && '未通过'}
      {post.status === 'pending' && '待审核'}
    </span>
  </div>
</div>
        </div>
      </div>
    </Card>
  );
}

export default ReviewCard;
