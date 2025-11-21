import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService, categoryService } from '@/lib/services/api';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

function PostForm() {
  const [form, setForm] = useState({ title: '', content: '', category: '', tags: '' });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams(); // if present, we're editing

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
        setError('Failed to load categories. Please try refreshing the page.');
      }
    };

    fetchCategories();

    if (id) {
      setIsEditing(true);
      postService.getPost(id)
        .then(post => {
          setForm({
            title: post.title,
            content: post.content,
            category: post.category._id || post.category,
            tags: post.tags?.join(', ') || ''
          });
        })
        .catch(err => {
          console.error('Failed to load post', err);
          setError('Post not found');
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!form.title || !form.content || !form.category) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const payload = {
      title: form.title,
      content: form.content,
      category: form.category,
      tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    try {
      if (isEditing) {
        await postService.updatePost(id, payload);
      } else {
        await postService.createPost(payload);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">
        {isEditing ? 'Edit Post' : 'Create New Post'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="title"
          placeholder="Post title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <Textarea
          name="content"
          placeholder="Write your content here..."
          value={form.content}
          className="white-space-pre-wrap"
          onChange={handleChange}
          rows={8}
          required
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {categories.length === 0 && !loading && !error && (
            <p className="text-yellow-600 text-sm">
              No categories available. Please try refreshing the page.
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Tags</label>
          <Input
            name="tags"
            placeholder="e.g. react, mern, tutorial"
            value={form.tags}
            onChange={handleChange}
          />
          <p className="text-xs text-muted-foreground">
            Separate tags with commas
          </p>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? (isEditing ? 'Updating...' : 'Creating...') : isEditing ? 'Update Post' : 'Create Post'}
        </Button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}

export default PostForm;