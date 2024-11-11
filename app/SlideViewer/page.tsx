import SlideViewer from '@/components/SlideViewer';
import Link from 'next/link';
import { Creation, creationsTable } from '@/drizzle/schema';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm/expressions';
import { Slide } from '@/types/types';

interface SlideViewerPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

async function getCreationById(id: string) {
  // Fetch the creation from the database using your ORM or database client
  const [creation] = await db.select().from(creationsTable).where(eq(creationsTable.id, id));

  const c: Creation = {
    id: creation.id,
    user_id: creation.user_id,
    created_at: creation.created_at,
    slides: creation.slides as Slide[],
  };

  return c;
}

export default async function SlideViewerPage({ searchParams }: SlideViewerPageProps) {
  const id = searchParams.id as string;

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
        <Link href="/generate" className="text-blue-500 hover:underline">
          Go back to Generate
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4">
      <Link href={`/dashboard`} className="text-blue-500 hover:underline">
        Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold mb-4">Slide Viewer</h1>
      <SlideViewer creation={creation} />
    </div>
  );
}