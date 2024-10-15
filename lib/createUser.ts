import { db } from "@/drizzle/db";
import { User } from "@/drizzle/schema";
import { usersTable } from "@/drizzle/schema";
import { UserEntry } from "@/types/types";


export async function createUser(userDetails: UserEntry) {
  console.log('userDetails', userDetails);
  console.log(db);
  try {
    await db.insert(usersTable).values(userDetails).onConflictDoNothing();
    console.log("User created successfully");
    return { success: true };
    
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Error creating user" };
  }
}