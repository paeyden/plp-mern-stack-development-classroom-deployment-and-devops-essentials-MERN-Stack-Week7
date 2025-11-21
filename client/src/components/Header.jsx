import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { authService } from '@/lib/services/api';

function Header() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const NavLinks = () => (
    <>
      <Link to="/" className="hover:underline">Home</Link>
      {user && <Link to="/create" className="hover:underline">Create Post</Link>}
      {!user ? (
        <>
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/register" className="hover:underline">Register</Link>
        </>
      ) : (
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      )}
    </>
  );

  const ProfileLink = () => {
    if (!user) return null;

    return (
      <Link to="/profile" className="flex items-center gap-2">
        <img src={user.avatar || '/default-avatar.png'} className="w-8 h-8 rounded-full" />
        <span className="text-sm font-medium">{user.name}</span>
      </Link>
    );
  };

  return (
    <header className="border-b px-6 py-4 bg-white flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">MyBlog</Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-4 items-center">
        <NavLinks />
        <ProfileLink />
      </nav>

      {/* Mobile Nav */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col gap-4 pt-10">
            <NavLinks />
            <ProfileLink />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default Header;