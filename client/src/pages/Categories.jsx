import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '@/lib/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

function CategoriesContent() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  useEffect(() => {
    const fetchCategoriesWithPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const cats = await categoryService.getAllCategories();

        const enriched = await Promise.all(
          cats.map(async (cat) => {
            const posts = await categoryService.getPostsByCategory(cat._id);
            return { ...cat, posts };
          })
        );

        setCategories(enriched);
      } catch (err) {
        setError(err.message || 'Failed to fetch categories');
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesWithPosts();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const created = await categoryService.createCategory(newCategory);
      const posts = await categoryService.getPostsByCategory(created._id);
      setCategories((prev) => [...prev, { ...created, posts }]);
      setNewCategory({ name: '', description: '' });
    } catch (err) {
      setError(err.message || 'Failed to create category');
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="text-red-600 mb-4">⚠️ {error}</div>
            <Button variant="outline" onClick={() => window.location.reload()} className="bg-white">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Browse Categories</h2>
        <p className="text-muted-foreground">Explore our collection of posts by category</p>
      </div>

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="space-y-4 mb-8">
        <Input
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          placeholder="New category name"
          required
        />
        <Textarea
          value={newCategory.description}
          onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
          placeholder="Optional description"
        />
        <Button type="submit">Add Category</Button>
      </form>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <Card key={cat._id} className="group hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {cat.name}
                <Badge variant="secondary" className="ml-2">
                  {cat.posts?.length || 0} posts
                </Badge>
              </CardTitle>
              {cat.description && <CardDescription>{cat.description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-2">
              {cat.posts?.length > 0 ? (
                cat.posts.slice(0, 3).map((post) => (
                  <Link key={post._id} to={`/posts/${post._id}`} className="block text-sm text-primary hover:underline">
                    • {post.title}
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No posts yet</p>
              )}
            </CardContent>
          </Card>
        ))}

        {categories.length === 0 && (
          <div className="col-span-2 text-center py-8 text-muted-foreground">No categories found</div>
        )}
      </div>
    </div>
  );
}

function Categories() {
  return (
    <ErrorBoundary>
      <CategoriesContent />
    </ErrorBoundary>
  );
}

export default Categories;