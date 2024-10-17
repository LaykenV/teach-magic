// pages/api/getCreation.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db"; // Adjust the import path based on your project structure
import { creationsTable, Creation } from "@/drizzle/schema"; // Adjust the import path
import { eq, and } from "drizzle-orm/expressions";

interface GetCreationRequestBody {
  id: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow only POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Authenticate the user
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Extract 'id' from the request body
  const { id } = req.body as GetCreationRequestBody;

  // Validate the 'id'
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid or missing 'id' in request body." });
  }

  try {
    // Query the database for the creation with the given 'id' and 'user_id'
    const [creationRecord] = await db.select().from(creationsTable).where(
        and(
          eq(creationsTable.id, id),
          eq(creationsTable.user_id, userId)
        )
      );

    if (!creationRecord) {
      return res.status(404).json({ error: "Creation not found." });
    }

    // Structure the creation data as per the 'Creation' interface
    const creation: Creation = {
      id: creationRecord.id,
      user_id: creationRecord.user_id,
      created_at: creationRecord.created_at,
      slides: creationRecord.slides as any[], // Ensure that 'slides' are correctly typed
    };

    // Return the creation data
    return res.status(200).json(creation);
  } catch (error) {
    console.error("Error fetching creation:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}