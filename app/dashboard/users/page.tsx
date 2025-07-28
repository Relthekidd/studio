'use client';
import Layout from '@/components/Layout';
import UsersTable from '@/components/UsersTable';

export default function UsersPage() {
  return (
    <Layout>
      <h1 className="mb-4 text-xl font-bold">Users</h1>
      <UsersTable />
    </Layout>
  );
}
