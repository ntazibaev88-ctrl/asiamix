import { createClient } from '@/lib/supabase/server';
import { Navbar } from './Navbar';

export async function NavbarWrapper() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <Navbar user={user} />;
}
