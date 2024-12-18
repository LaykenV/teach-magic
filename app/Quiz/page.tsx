import Link from 'next/link';
import { creationsTable } from '@/drizzle/schema';
import { Creation } from '@/types/types'
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm/expressions';
import { Slide, Quiz } from '@/types/types';
import QuizViewer from '@/components/QuizViewer';

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
    age_group: creation.age_group,
  };

  return c;
}

export default async function QuizViewerPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const id =  params.id as string;

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-start min-h-screen p-4">
        <p className="text-center mt-10">No creation ID provided.</p>
        <Link href="/generate" className="text-blue-500 hover:underline">
          Go back to Generate
        </Link>
      </div>
    );
  }

  // Fetch the creation from the database
  const creation: Creation = await getCreationById(id);

  if (!creation) {
    return (
      <div className="flex flex-col items-center justify-start min-h-screen p-4">
        <p className="text-center mt-10">Creation not found.</p>
        <Link href="/dashboard" className="text-blue-500 hover:underline" prefetch>
          Go back to Dashboard
        </Link>
      </div>
    );
  }

  return (
      <QuizViewer creation={creation} />
  );
}