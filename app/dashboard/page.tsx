import { UserButton } from '@clerk/nextjs';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm/expressions';
import { creationsTable } from '@/drizzle/schema';
import { Creation } from '@/drizzle/schema';
import UserCreations from '@/components/UserCreations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ImageIcon, BrainCircuit } from 'lucide-react';

export default async function Dashboard() {
  const { userId } = auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) {
    return <div>No user found</div>;
  }
  const stringId = userId.toString();

  const userCreations = await db.select().from(creationsTable).where(eq(creationsTable.user_id, stringId));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedCreations: Creation[] = userCreations.map((creation: any) => ({
    id: creation.id,
    user_id: creation.user_id,
    slides: creation.slides,
    created_at: creation.created_at,
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">TeachMagic</h1>
          <nav className="flex items-center space-x-4">
            <UserButton />
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Welcome back, {clerkUser.firstName}!</h2>
          <p className="text-xl text-muted-foreground">
            Ready to create more amazing learning content?
          </p>
        </div>

        <div className="mb-12">
          <UserCreations userCreations={formattedCreations} />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <BookOpen className="w-10 h-10 mb-2 text-primary" />
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Youve created {formattedCreations.length} learning modules so far. Keep up the great work!
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <ImageIcon className="w-10 h-10 mb-2 text-primary" />
              <CardTitle>AI-Generated Visuals</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Enhance your learning modules with custom AI-generated images. Try it in your next creation!
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <BrainCircuit className="w-10 h-10 mb-2 text-primary" />
              <CardTitle>Knowledge Check</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Dont forget to add interactive questions to your modules for better learning retention.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-muted mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 TeachMagic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}