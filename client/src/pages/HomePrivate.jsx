import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ErrorBoundary from '@/components/ErrorBoundary';
import { postService } from '@/lib/services/api';

function HomeContent() {
  const [user] = useState(() => {
    const rawUser = localStorage.getItem('user');
    return rawUser ? JSON.parse(rawUser) : null;
  });

  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    postService.getAllPosts()
      .then(data => {
        const allPosts = data.posts || data;
        setPosts(allPosts);
        setFiltered(allPosts);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const query = search.toLowerCase();
    const results = posts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.tags?.some(tag => tag.toLowerCase().includes(query))
    );
    setFiltered(results);
  }, [search, posts]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to MyBlog</h1>
        <div className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">Welcome back, {user.name} 👋</h1>
          <Link to="/posts">
            <Button>View Latest Posts</Button>
          </Link>
        </div>
        <p className="text-muted-foreground text-lg">
          Discover stories, tutorials, and insights from creators around the world.
        </p>

        {/* 🔍 Search Bar */}
        <Input
          placeholder="Search posts by title, content, or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xl mx-auto"
        />

        <Link to="/posts">
          <Button size="lg">Browse Posts</Button>
        </Link>
      </section>

      {/* 🧠 Search Results Preview */}
      {search && (
        <section className="space-y-4">
          {filtered.length > 0 ? (
            filtered.slice(0, 5).map(post => (
              <Card key={post._id}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{post.content.slice(0, 100)}...</p>
                  <Link to={`/posts/${post._id}`}>
                    <Button variant="link" className="mt-2">Read More</Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">No matching posts found.</p>
          )}
        </section>
      )}

      {/* 🧭 Navigation Cards */}
      <section className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Start Writing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Share your thoughts, tutorials, or experiences with the world.
            </p>
            <Link to="/create">
              <Button variant="outline">Create a Post</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Explore Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Browse posts by category to find what interests you most.
            </p>
            <Link to="/categories">
              <Button variant="outline">View Categories</Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Home() {
  return (
    <ErrorBoundary>
      <HomeContent />
    </ErrorBoundary>
  );
}

export default Home;