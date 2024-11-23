import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import PricingComponent from '@/components/PricingComponent';

const Pricing = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect('/');
  }

  return <PricingComponent />;
};

export default Pricing;