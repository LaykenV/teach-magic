import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import PricingComponent from '@/components/PricingComponent';

interface PricingPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const Pricing = async ({ searchParams }: PricingPageProps) => {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) {
    redirect('/');
  }
  const params = await searchParams;
  let paymentResult = '';
  if (params.payment) {
    paymentResult = params.payment as string;
  }

  if (paymentResult == 'success') {
    return <PricingComponent paid={true}/>;
  } else if (paymentResult == 'fail') {
    return <PricingComponent paid={false}/>;
  } else   return <PricingComponent paid={null}/>;

};

export default Pricing;