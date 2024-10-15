import type { NextApiRequest, NextApiResponse } from 'next';
import { createCreation } from '@/utils/createCreation';
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { slides } = req.body;

  if (!slides || !Array.isArray(slides)) {
    return res.status(400).json({ error: 'Invalid slides data' });
  }

  try {
    const newCreation = await createCreation({ user_id: userId, slides });
    return res.status(201).json(newCreation);
  } catch (error) {
    console.error('Error creating creation:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}