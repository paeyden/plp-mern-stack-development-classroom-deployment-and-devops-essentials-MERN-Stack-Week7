import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authService, userService } from '@/lib/services/api';
import ErrorBoundary from '@/components/ErrorBoundary';

function ProfileContent() {
  const [form, setForm] = useState({ name: '', email: '', avatar: '' });
  const [loading, setLoading] = useState(false);
const [user, setUser] = useState(() => {
    const rawUser = localStorage.getItem('user');
    return rawUser ? JSON.parse(rawUser) : null;
  });

  if (!user) {
    return null;
  }

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, avatar: user.avatar || '' });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await userService.updateUser(user.id, {
        name: form.name,
        avatar: form.avatar,
      });
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      alert('Profile updated!');
    } catch (err) {
      console.error(err);
      alert('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Your Profile</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <Input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
        <Input name="email" value={form.email} disabled />
        <Input name="avatar" value={form.avatar} onChange={handleChange} placeholder="Avatar URL" />
        {form.avatar && (
          <img src={user.avatar || '/default-avatar.png'} className="w-8 h-8 rounded-full" />
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </Button>
      </form>
    </div>
  );
}

function Profile() {
  return (
    <ErrorBoundary>
      <ProfileContent />
    </ErrorBoundary>
  );
}

export default Profile;