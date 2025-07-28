'use client';
import { useEffect, useState } from 'react';
import { supabaseAdmin } from '@/lib/supabase';

export default function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const supabase = supabaseAdmin();
      const { data, error } = await (supabase as any).auth.admin.listUsers();
      if (!error) setUsers(data.users);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const updateRole = async (id: string, role: string) => {
    setSavingId(id);
    const supabase = supabaseAdmin();
    await (supabase as any).auth.admin.updateUserById(id, { data: { role } });
    setUsers((u) =>
      u.map((user) =>
        user.id === id ? { ...user, user_metadata: { ...user.user_metadata, role } } : user
      )
    );
    setSavingId(null);
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Delete user?')) return;
    const supabase = supabaseAdmin();
    await (supabase as any).auth.admin.deleteUser(id);
    setUsers((u) => u.filter((user) => user.id !== id));
  };

  const filtered = filter
    ? users.filter((u) => (u.user_metadata?.role || 'listener') === filter)
    : users;

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="space-y-4">
      <div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded border p-2"
        >
          <option value="">All roles</option>
          <option value="listener">Listener</option>
          <option value="artist">Artist</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-2">{user.email}</td>
              <td className="p-2">
                <select
                  value={user.user_metadata?.role || 'listener'}
                  onChange={(e) => updateRole(user.id, e.target.value)}
                  className="rounded border p-1 text-sm"
                >
                  <option value="listener">listener</option>
                  <option value="artist">artist</option>
                  <option value="admin">admin</option>
                </select>
                {savingId === user.id && <span className="ml-2 text-xs">Saving...</span>}
              </td>
              <td className="p-2">
                <button
                  onClick={() => deleteUser(user.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
