import { db } from "@/drizzle/db";
import { usersTable } from "@/drizzle/schema";
import { UserEntry } from "@/types/types";


export async function createUser(userDetails: UserEntry) {
  console.log('userDetails', userDetails);
  console.log(db);
  try {
    const [newUser] = await db.insert(usersTable).values({ id: userDetails.id, email: userDetails.email, name: userDetails.name}).returning().onConflictDoNothing();
    if (!newUser) {
      console.log("User already exists or there was an error");
      return { success: false };
    }
    console.log("User created successfully");
    return { success: true };
    
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Error creating user" };
  }
}