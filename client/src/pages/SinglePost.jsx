import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postService, authService } from '@/lib/services/api';
import { Button } from '@/components/ui/button';

function SinglePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const user = authService.getCurrentUser();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postService.getPost(id);
        setPost(data);
      } catch (err) {
        setError('Post not found');
        console.error('Failed to fetch post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await postService.deletePost(id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-center">{error}</p>
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => navigate('/')}>
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const isAuthor = user && user.id === post.author._id;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <div className="text-sm text-muted-foreground">
        By {post.author.name} • {new Date(post.createdAt).toLocaleDateString()} • {post.category.name}
      </div>
      {post.image && (
        <img src={post.image} alt="Post visual" className="w-full rounded-md my-4" />
      )}
      {post.excerpt && (
        <p className="italic text-muted-foreground">{post.excerpt}</p>
      )}
      <div className="prose max-w-none">{post.content}</div>
      {post.tags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag, i) => (
            <span key={i} className="bg-gray-100 text-sm px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}
      {isAuthor && (
        <div className="flex gap-4 mt-6">
          <Link to={`/edit/${post._id}`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </div>
      )}
    </div>
  );
}

export default SinglePost;