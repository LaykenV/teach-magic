import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import PricingComponent from '@/components/PricingComponent';
import { PageProps } from '@/.next/types/app/page';

interface MyPageProps extends PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Pricing = async ({ searchParams }: MyPageProps) => {
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