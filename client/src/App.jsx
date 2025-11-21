import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePublic from './pages/HomePublic';
import Home from './pages/HomePrivate';
import PostList from './pages/PostList';
import SinglePost from './pages/SinglePost';
import CreatePost from './pages/PostForm';
import EditPost from './pages/PostForm';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Categories from './pages/Categories';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Header />
      <main className="min-h-[80vh]">
        <Routes>
          <Route path="/" element={user ? <Home /> : <HomePublic />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/posts" element={<PostList />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/posts/:id" element={<SinglePost />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;