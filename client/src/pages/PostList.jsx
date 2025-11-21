import { useEffect, useState } from 'react';
import { postService } from '@/lib/services/api';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (category) query.append('category', category);

    postService.getAllPosts({ params: query })
      .then(data => setPosts(data.posts || data))
      .catch(err => console.error('Failed to fetch posts', err))
      .finally(() => setLoading(false));
  }, [search, category]);

  useEffect(() => {
    postService.getAllPosts()
      .then(data => setPosts(data.posts || data))
      .catch(err => console.error('Failed to fetch posts', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-8">Loading posts...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts by title or content..."
        />
      </div>

      {/* Post Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <Card key={post._id} className="shadow-sm hover:shadow-md transition">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              {post.category && (
                <Badge variant="secondary" className="mt-2">
                  {post.category.name || post.category}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
            </CardContent>
            <CardFooter>
              <Link to={`/posts/${post._id}`}>
                <Button variant="outline">Read More</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default PostList;