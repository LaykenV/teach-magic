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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Enhanced gradient background layers */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-background" />
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/8" />
      <div className="fixed inset-0 bg-gradient-to-tr from-transparent via-accent/3 to-primary/6" />
      <div className="fixed inset-0 bg-gradient-to-bl from-secondary/4 via-transparent to-accent/5" />
      
      {/* Floating gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/15 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gradient-to-tr from-accent/15 to-primary/10 rounded-full blur-3xl animate-float delay-300" />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-gradient-to-bl from-secondary/18 to-accent/12 rounded-full blur-3xl animate-float delay-700" />
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-gradient-to-r from-primary/8 to-secondary/12 rounded-full blur-3xl animate-float delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6 sm:py-8">
          <div className="mb-8 sm:mb-12">
            <CreationsLibrary initialCreations={formattedCreations} tokens={User.tokens}/>
          </div>

          {/* Dashboard stats cards with improved mobile layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
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
    <Card className="bg-card/60 backdrop-blur-sm border border-border/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02] hover:bg-card/80 group">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
            <Icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}