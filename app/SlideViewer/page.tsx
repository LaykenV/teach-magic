import SlideViewer from '@/components/SlideViewer';
import Link from 'next/link';
import { SlideWithImage } from '@/types/types';
import { Creation, creationsTable } from '@/drizzle/schema';
import { db } from '@/drizzle/db';
import { promptImage } from '@/utils/prompt';
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


async function generateImage(slideImagePrompt: string): Promise<string | null> {
  try {
    const imageUrl = await promptImage(slideImagePrompt);
    return imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}


async function updateSlideImageUrl(creationId: string, slideIndex: number, imageUrl: string) {
  // Update the slide's image URL in the database
  const [creation] = await db.select().from(creationsTable).where(eq(creationsTable.id, creationId));

  const newSlides = [...creation.slides as Slide[]];

  if ('slide_image_url' in newSlides[slideIndex]) {
    newSlides[slideIndex].slide_image_url = imageUrl;
  }

  await db.update(creationsTable).set({ slides: newSlides }).where(eq(creationsTable.id, creationId));
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
  let creation: Creation = await getCreationById(id);

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

  // Check for slides with null slide_image_url and generate images
  const slidesToUpdate: { slide: SlideWithImage; index: number }[] = creation.slides
    .map((slide, index) => ({ slide, index }))
    .filter(
      ({ slide }) =>
        slide.slide_image_url == null &&
        (slide.slide_type === 'title' || slide.slide_type === 'content')
    );

  if (slidesToUpdate.length > 0) {
    for (const { slide, index } of slidesToUpdate) {
      const imageUrl = await generateImage(slide.slide_image_prompt);
      if (imageUrl) {
        slide.slide_image_url = imageUrl;
        // Update the slide in the database
        await updateSlideImageUrl(creation.id, index, imageUrl);
      }
    }
    // Refetch the updated creation
    creation = await getCreationById(id);
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