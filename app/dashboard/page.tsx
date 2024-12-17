// pages/dashboard.tsx
import { currentUser} from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import CreationsLibrary from '@/components/CreationsLibrary';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookOpen, ImageIcon, BrainCircuit } from 'lucide-react';
import { MyDock } from '@/components/MyDock';
import { getUserCreations } from '@/utils/getUserCreations';
import { getUser } from '@/utils/getUser';


export default async function Dashboard() {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) {
    redirect('/');
  }
  const email = user?.emailAddresses[0].emailAddress;
  const name = user?.firstName + ' ' + user?.lastName;


  const User = await getUser(userId, email, name);
  const formattedCreations = await getUserCreations(userId);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-12">
          <CreationsLibrary initialCreations={formattedCreations} tokens={User.tokens}/>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <DashboardCard
            icon={BookOpen}
            title="Recent Activity"
            description={`You've created ${formattedCreations.length} learning modules so far. Keep up the great work!`}
          />
          <DashboardCard
            icon={ImageIcon}
            title="AI-Generated Visuals"
            description="Enhance your learning modules with custom AI-generated images on any topic!"
          />
          <DashboardCard
            icon={BrainCircuit}
            title="Knowledge Check"
            description="Don't forget to take the interactive quiz for better learning retention."
          />
        </div>
      </main>

      <Footer />
      <MyDock dashboard={true} />
    </div>
  );
}

function DashboardCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-card transition-colors duration-300">
      <CardHeader>
        <Icon className="w-10 h-10 mb-2 text-primary" />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}