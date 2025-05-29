import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import PricingComponent from '@/components/PricingComponent';

interface PageProps {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Pricing = async ({ searchParams }: PageProps) => {
  const user = await currentUser();
  const userId = user?.id;
  
  if (!userId) {
    redirect('/');
  }

  let paymentResult: string | null = null;
  const parameters = await searchParams;
  
  if (parameters.payment) {
    const payment = parameters.payment as string;
    if (payment === 'success') {
      paymentResult = 'success';
    } else if (payment === 'fail') {
      paymentResult = 'fail';
    }
  }

  const paid = paymentResult === 'success' ? true : paymentResult === 'fail' ? false : null;

  return <PricingComponent paid={paid} />;
};

export default Pricing;