import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import PricingComponent from '@/components/PricingComponent';

interface PageProps {
  params: { [key: string]: string | string[] | undefined };
  searchParams: { [key: string]: string | string[] | undefined };
}

const Pricing = async ({ searchParams }: PageProps) => {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) {
    redirect('/');
  }
  let paymentResult = '';
  const paramaters = await searchParams;
  if (paramaters.payment) {
    paymentResult = searchParams.payment as string;
  }

  if (paymentResult == 'success') {
    return <PricingComponent paid={true}/>;
  } else if (paymentResult == 'fail') {
    return <PricingComponent paid={false}/>;
  } else   return <PricingComponent paid={null}/>;

};

export default Pricing;