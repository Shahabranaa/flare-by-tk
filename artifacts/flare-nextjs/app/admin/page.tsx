import { cookies } from 'next/headers';
import AdminClient from './client';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin — Flare by TK' };

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin-session');
  const isAuth = session?.value === process.env.ADMIN_PASSWORD && !!process.env.ADMIN_PASSWORD;

  return <AdminClient initialAuth={isAuth} />;
}
