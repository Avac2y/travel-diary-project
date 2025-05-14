import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import MyPosts from './pages/MyPosts/MyPosts';
import PostDetail from './pages/PostDetail/PostDetail';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import EditPost from './pages/EditPost/EditPost';
import PersonalInfo from './pages/Personal Information/PersonalInfo';
import EditProfile from './pages/EditProfile/EditProfile';
import Navbar from './components/Navbar/Navbar';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './styles/theme.css'; // 导入主题样式
import './App.css'; // 导入应用样式

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/home" element={<Home />} />
                <Route path="/myposts" element={<MyPosts />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/edit-post/:id" element={<EditPost />} />
                <Route path="/personal-info" element={<PersonalInfo />} />
                <Route path="/edit-profile" element={<EditProfile />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
