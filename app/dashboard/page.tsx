import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm/expressions';
import { creationsTable, usersTable, User } from '@/drizzle/schema';
import { Creation } from '@/types/types'
import UserCreations from '@/components/UserCreations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ImageIcon, BrainCircuit } from 'lucide-react';
import { redirect } from "next/navigation";
import { MyDock } from '@/components/MyDock';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default async function Dashboard() {
  const { userId } = auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) {
    redirect('/')
  }
  const stringId = userId.toString();

  const user = await db.select().from(usersTable).where(eq(usersTable.id, stringId));
  const formattedUser: User = user[0];

  const userCreations = await db.select().from(creationsTable).where(eq(creationsTable.user_id, stringId));
  const formattedCreations: Creation[] = userCreations.map((creation: any) => ({
    id: creation.id,
    user_id: creation.user_id,
    slides: creation.slides,
    quiz: creation.quiz,
    created_at: creation.created_at,
    age_group: creation.age_group
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {clerkUser.firstName}!</h2>
          <p className="text-xl text-muted-foreground mb-4">
            Ready to create more amazing learning content?
          </p>
        </div>

        <div className="mb-12">
          <UserCreations userCreations={formattedCreations} />
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

function DashboardCard({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
  return (
    <Card className="bg-card hover:bg-accent transition-colors duration-300">
      <CardHeader>
        <Icon className="w-10 h-10 mb-2 text-primary" />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

