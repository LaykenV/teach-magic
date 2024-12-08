"use cache"
import { auth } from '@clerk/nextjs/server';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm/expressions';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { creationsTable, usersTable, User } from '@/drizzle/schema';
import { Creation } from '@/types/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ImageIcon, BrainCircuit } from 'lucide-react';
import { redirect } from "next/navigation";
import { MyDock } from '@/components/MyDock';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import CreationsLibrary from '@/components/CreationsLibrary';
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'


 export const revalidate = 60; // revalidate every 60 seconds

async function getUserCreations(userId: string) {
  'use cache' // Cache just this function as well
  cacheTag('user-creations') // tag to revalidate
  cacheLife('max') // Choose the "max" profile to cache indefinitely
  const userCreations = await db.select().from(creationsTable).where(eq(creationsTable.user_id, userId));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedCreations: Creation[] = userCreations.map((creation: any) => ({
    id: creation.id,
    user_id: creation.user_id,
    slides: creation.slides,
    quiz: creation.quiz,
    created_at: creation.created_at,
    age_group: creation.age_group,
  }));
  return formattedCreations;
}

export default async function Dashboard() {
  const { userId } = auth();
  if (!userId) {
    redirect('/');
  }

  const formattedCreations = await getUserCreations(userId);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        

        <div className="mb-12">
          <CreationsLibrary initialCreations={formattedCreations} />
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
    <Card className="bg-card transition-colors duration-300">
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

