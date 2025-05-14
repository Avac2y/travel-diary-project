import React, { useEffect, useState, useRef, useCallback, useMemo, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicPostList } from '../../store/modules/diary';
import { useNavigate } from 'react-router-dom';
import { Input, Card, Avatar, Typography, Spin, Empty, Alert, Button, message } from 'antd';
import { SearchOutlined, UserOutlined, ReloadOutlined, WarningOutlined } from '@ant-design/icons';
import LazyImage from '../../components/LazyImage/LazyImage';
import { processImageUrl } from '../../utils/imageUtils';
import { useTheme } from '../../context/ThemeContext';
import './Home.css';

const { Title } = Typography;
const { Search } = Input;

// 随机图片生成函数 - 使用静态占位图
const getRandomImageUrl = () => {
  return "https://via.placeholder.com/300x200?text=旅行图片";
};

// 防抖函数
const useDebounce = (fn, delay) => {
  const timer = useRef(null);
  
  return useCallback((...args) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      fn(...args);
    }, delay);
  }, [fn, delay]);
};

// 旅行卡片组件
const TravelCard = memo(({ item, isLastElement, onTravelClick, lastPostElementRef }) => {
  const { darkMode } = useTheme();
  // 如果没有图片，生成一个随机图片用于展示
  const coverImage = item.images && item.images.length > 0 
    ? processImageUrl(item.images[0]) 
    : getRandomImageUrl();
  
  return (
    <div 
      ref={isLastElement ? lastPostElementRef : null}
      className={`waterfall-item ${darkMode ? 'dark-mode' : ''}`}
    >
      <Card 
        className="travel-card" 
        onClick={() => onTravelClick(item._id)}
        cover={
          <div className="travel-card-image-container">
            <LazyImage 
              src={coverImage} 
              alt={item.title} 
              className="travel-card-cover" 
            />
          </div>
        }
        bordered={false}
        bodyStyle={{ padding: 0 }}
      >
        <div className="travel-card-content">
          <Title level={5} ellipsis={{ rows: 2 }} className="travel-card-title">{item.title}</Title>
          <div className="travel-card-author">
            <Avatar 
              size="small" 
              icon={<UserOutlined />} 
              src={item.author && item.author.avatar ? processImageUrl(item.author.avatar) : null} 
              className="author-avatar"
            />
            <span className="author-name">{item.author ? item.author.nickname : '匿名用户'}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}, (prevProps, nextProps) => {
  // 只有在以下情况才重新渲染:
  // 1. 如果项目ID不同
  // 2. 如果isLastElement状态改变
  return (
    prevProps.item._id === nextProps.item._id && 
    prevProps.isLastElement === nextProps.isLastElement
  );
});

// 设置组件显示名称，便于调试
TravelCard.displayName = 'TravelCard';

// 加载中组件
const LoadingView = memo(() => (
  <div className="loading-container">
    <Spin size="large" />
  </div>
));

LoadingView.displayName = 'LoadingView';

// 错误视图组件
const ErrorView = memo(({ error, retrying, onRetry }) => (
  <div className="error-container">
    <Alert
      type="error"
      message="加载失败"
      description={error}
      showIcon
      icon={<WarningOutlined />}
    />
    <Button 
      type="primary" 
      icon={<ReloadOutlined />} 
      loading={retrying}
      onClick={onRetry}
      className="retry-button"
    >
      重新加载
    </Button>
  </div>
));

ErrorView.displayName = 'ErrorView';

// 加载更多错误组件
const LoadMoreErrorView = memo(({ error, onRetry }) => (
  <div className="load-more-error-container">
    <Alert 
      type="warning" 
      message={error} 
      banner 
      className="load-more-error-alert"
    />
    <Button 
      type="link" 
      icon={<ReloadOutlined />} 
      onClick={onRetry}
      className="retry-load-more-button"
    >
      点击重试
    </Button>
  </div>
));

LoadMoreErrorView.displayName = 'LoadMoreErrorView';

// 空结果组件
const EmptyView = memo(() => <Empty description="暂无游记" />);
EmptyView.displayName = 'EmptyView';

// 加载更多指示器
const LoadingMoreView = memo(() => (
  <div className="loading-more-container">
    <Spin />
    <span className="loading-text">加载更多...</span>
  </div>
));

LoadingMoreView.displayName = 'LoadingMoreView';

// 没有更多结果提示
const NoMoreView = memo(() => (
  <div className="no-more-container">
    <span className="no-more-text">没有更多游记了</span>
  </div>
));

NoMoreView.displayName = 'NoMoreView';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { publicPosts, loading, pagination, error: reduxError } = useSelector(state => state.diary);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadMoreError, setLoadMoreError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const { darkMode } = useTheme();
  const observer = useRef();
  
  // 初始加载数据
  useEffect(() => {
    loadInitialData();
  }, []);

  // 监听Redux错误
  useEffect(() => {
    if (reduxError) {
      if (initialLoading) {
        setError(reduxError);
      } else if (page > 1) {
        setLoadMoreError(reduxError);
        message.error('加载更多游记失败，请稍后再试');
      }
    }
  }, [reduxError, initialLoading, page]);
  
  // 搜索防抖处理
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);
  
  // 基于防抖后的搜索查询重置数据
  useEffect(() => {
    if (!initialLoading) {
      setAllPosts([]);
      setPage(1);
      setHasMore(true);
      setError(null);
      loadData(1, debouncedSearchQuery, true);
    }
  }, [debouncedSearchQuery]);

  // 当publicPosts更新时合并到allPosts
  useEffect(() => {
    if (!initialLoading && publicPosts.length > 0) {
      setAllPosts(prevPosts => {
        // 如果是第一页，替换所有posts
        if (page === 1) return [...publicPosts];
        
        // 否则合并并去重
        const newPosts = [...prevPosts];
        publicPosts.forEach(post => {
          if (!newPosts.some(p => p._id === post._id)) {
            newPosts.push(post);
          }
        });
        return newPosts;
      });
    }
    
    // 检查是否还有更多数据
    if (pagination && pagination.total <= page * pagination.pageSize) {
      setHasMore(false);
    }
    
    setInitialLoading(false);
  }, [publicPosts, pagination]);

  // 防抖处理Intersection Observer回调
  const handleIntersection = useCallback((entries) => {
    if (entries[0].isIntersecting && hasMore && !loading && !loadMoreError) {
      loadNextPage();
    }
  }, [hasMore, loading, loadMoreError]);
  
  // 使用防抖包装handleIntersection
  const debouncedHandleIntersection = useDebounce(handleIntersection, 200);
  
  // 最后一个元素的引用回调
  const lastPostElementRef = useCallback(node => {
    if (loading || loadMoreError) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(debouncedHandleIntersection, { threshold: 0.5 });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, debouncedHandleIntersection, loadMoreError]);
  
  // 初始加载
  const loadInitialData = async () => {
    setInitialLoading(true);
    setError(null);
    try {
      await loadData(1, '', true);
    } catch (err) {
      console.error('加载数据失败:', err);
      setError(err.message || '加载游记失败，请稍后再试');
    } finally {
      setInitialLoading(false);
      setRetrying(false);
    }
  };

  // 加载数据
  const loadData = useCallback(async (pageNum = 1, search = debouncedSearchQuery, replace = false) => {
    try {
      if (pageNum === 1) {
        setError(null);
      } else {
        setLoadMoreError(null);
      }
      
      await dispatch(fetchPublicPostList(pageNum, 10, search));
      
      if (replace) {
        setPage(1);
      }
      return true;
    } catch (err) {
      console.error('加载数据失败:', err);
      if (pageNum === 1) {
        setError(err.message || '加载游记失败，请稍后再试');
      } else {
        setLoadMoreError(err.message || '加载更多游记失败');
      }
      return false;
    }
  }, [dispatch, debouncedSearchQuery]);
  
  // 加载下一页 - 添加节流逻辑防止频繁触发
  const loadNextPageRef = useRef(false);
  
  const loadNextPage = useCallback(() => {
    if (loadNextPageRef.current || loadMoreError) return;
    
    loadNextPageRef.current = true;
    const nextPage = page + 1;
    setPage(nextPage);
    loadData(nextPage).finally(() => {
      // 300ms后重置锁定状态
      setTimeout(() => {
        loadNextPageRef.current = false;
      }, 300);
    });
  }, [page, loadData, loadMoreError]);

  // 搜索处理 - 直接修改状态，由防抖效果处理实际搜索
  const handleSearch = useCallback((value) => {
    setSearchQuery(value);
  }, []);

  const handleTravelClick = useCallback((id) => {
    navigate(`/post/${id}`);
  }, [navigate]);
  
  // 重试加载初始数据
  const handleRetry = useCallback(() => {
    setRetrying(true);
    loadInitialData();
  }, []);
  
  // 重试加载更多
  const handleRetryLoadMore = useCallback(() => {
    setLoadMoreError(null);
    loadNextPage();
  }, [loadNextPage]);

  // 使用useMemo缓存搜索组件，避免不必要的重新渲染
  const searchComponent = useMemo(() => (
    <div className="search-container">
      <Search
        placeholder="搜索游记标题或作者昵称"
        enterButton={<SearchOutlined />}
        size="large"
        onSearch={handleSearch}
        onChange={(e) => handleSearch(e.target.value)}
        className="search-input"
      />
    </div>
  ), [handleSearch]);

  // 缓存旅行卡片列表，避免在滚动时不必要地重新渲染所有卡片
  const travelCardsGrid = useMemo(() => (
    <div className="waterfall-grid">
      {allPosts.map((item, index) => (
        <TravelCard
          key={item._id}
          item={item}
          isLastElement={index === allPosts.length - 1}
          onTravelClick={handleTravelClick}
          lastPostElementRef={lastPostElementRef}
        />
      ))}
    </div>
  ), [allPosts, handleTravelClick, lastPostElementRef]);

  return (
    <div className={`home-container ${darkMode ? 'dark-mode' : ''}`}>
      {searchComponent}

      <div className="travels-container">
        {initialLoading ? (
          <LoadingView />
        ) : error ? (
          <ErrorView 
            error={error} 
            retrying={retrying} 
            onRetry={handleRetry} 
          />
        ) : allPosts.length > 0 ? (
          travelCardsGrid
        ) : (
          <EmptyView />
        )}
        
        {!initialLoading && loading && hasMore && !loadMoreError && (
          <LoadingMoreView />
        )}
        
        {loadMoreError && (
          <LoadMoreErrorView 
            error={loadMoreError} 
            onRetry={handleRetryLoadMore} 
          />
        )}
        
        {!loading && !hasMore && allPosts.length > 0 && !loadMoreError && (
          <NoMoreView />
        )}
      </div>
    </div>
  );
}

// 使用React.memo包装整个Home组件
export default memo(Home);