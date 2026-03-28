import { redirect } from 'next/navigation';

export default function Home() {
  // TODO: Check auth session and redirect to appropriate dashboard based on role
  redirect('/login');
}
