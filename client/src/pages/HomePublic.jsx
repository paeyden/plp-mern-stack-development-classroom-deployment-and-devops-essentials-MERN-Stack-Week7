import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

function HomePublic() {
  const featuredCategories = ['Technology', 'Education', 'Lifestyle', 'Travel'];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to MyBlog</h1>
        <p className="text-lg text-muted-foreground">
          Discover stories, share your voice, and connect with a vibrant community.
        </p>
        <Link to="/register">
          <Button size="lg">Join Now</Button>
        </Link>
      </section>

      {/* Featured Categories */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Explore Topics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {featuredCategories.map((cat) => (
            <Card key={cat}>
              <CardHeader className="text-lg font-medium">{cat}</CardHeader>
              <CardContent>
                <Link to={`/posts?category=${cat.toLowerCase()}`} className="text-blue-600 hover:underline">
                  View Posts
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Already have an account?</h3>
        <Link to="/login">
          <Button variant="outline">Login</Button>
        </Link>
      </section>
    </div>
  );
}

export default HomePublic;