import SlideViewer from '@/components/SlideViewer';
import Link from 'next/link';
import { creationsTable } from '@/drizzle/schema';
import { Creation } from '@/types/types'
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm/expressions';
import { Slide, Quiz } from '@/types/types';

interface PageProps {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getCreationById(id: string) {
  // Fetch the creation from the database using your ORM or database client
  const [creation] = await db.select().from(creationsTable).where(eq(creationsTable.id, id));

  const c: Creation = {
    id: creation.id,
    user_id: creation.user_id,
    created_at: creation.created_at,
    slides: creation.slides as Slide[],
    quiz: creation.quiz as Quiz,
    age_group: creation.age_group
  };

  return c;
}

export default async function SlideViewerPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const id = params.id as string;

  if (!id) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-card to-background">
        <div className="text-center space-y-4 p-8 bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg">
          <p className="text-xl text-foreground">No creation ID provided.</p>
          <Link href="/dashboard" className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full hover:from-primary/90 hover:to-secondary/90 transition-all duration-300" prefetch>
            Go back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Fetch the creation from the database
  const creation: Creation = await getCreationById(id);

  if (!creation) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-card to-background">
        <div className="text-center space-y-4 p-8 bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg">
          <p className="text-xl text-foreground">Creation not found.</p>
          <Link href="/generate" className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full hover:from-primary/90 hover:to-secondary/90 transition-all duration-300">
            Go back to Generate
          </Link>
        </div>
      </div>
    );
  }

  return <SlideViewer creation={creation} />;
}