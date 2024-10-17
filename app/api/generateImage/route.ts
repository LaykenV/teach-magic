import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/drizzle/db';
import { creationsTable } from '@/drizzle/schema';
import { eq, and} from 'drizzle-orm/expressions';
import { promptImage } from '@/utils/prompt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { creationId, slideIndex, slideImagePrompt } = req.body;

  if (!creationId || slideIndex === undefined || !slideImagePrompt) {
    return res.status(400).json({ error: 'Invalid request data.' });
  }

  try {

    const [creation] = await db.select().from(creationsTable).where(
        and(
          eq(creationsTable.id, creationId),
          eq(creationsTable.user_id, userId)
        )
      );

    if (!creation) {
      return res.status(404).json({ error: 'Creation not found.' });
    }

    const updatedSlides = [...creation.slides as any];

    // Generate the image
    const imageUrl = await promptImage(slideImagePrompt);

    // Update the slide
    updatedSlides[slideIndex].slide_image_url = imageUrl;

    // Update the database
    await db
      .update(creationsTable)
      .set({ slides: updatedSlides })
      .where(eq(creationsTable.id, creationId));

    // Return the updated slide
    res.status(200).json(updatedSlides[slideIndex]);
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
}