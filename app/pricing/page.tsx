import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Pricing = async () => {
  const { userId } = auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) {
    redirect('/');
    return <div>No user found</div>;
  }

  const stringId = userId.toString();

  return (
    <div>
      <h1>Pricing {stringId}</h1>
      <Link href="/dashboard" prefetch>
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
};

export default Pricing;