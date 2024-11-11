import { SignOutButton, UserButton } from '@clerk/nextjs';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm/expressions';
import ClientTest from '@/components/ClientTest';
import { creationsTable } from '@/drizzle/schema';
import { Creation } from '@/drizzle/schema';
import UserCreations from '@/components/UserCreations';


export default async function Home() {
  const { userId} = auth();
  const clerkUser = await currentUser();
  console.log(clerkUser);

  if (!userId || !clerkUser) {
    return <div>No user found</div>;
  }
  const stringId = userId.toString();

  //query db for user creations with userId
  const userCreations = await db.select().from(creationsTable).where(eq(creationsTable.user_id, stringId));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedCreations: Creation[] = userCreations.map((creation: any) => ({
    id: creation.id,
    user_id: creation.user_id,
    slides: creation.slides,
    created_at: creation.created_at,
  }));

  //set user creations to formattedCreations


  //gallery of creations
  // create showcase table, load data, and fetch here

  //FAQ and help

  //discord?


  return (
    <div>
      <div>Dashboard {userId}</div>
      <SignOutButton />
      <UserButton />
      <ClientTest />
      <div>user creations</div>
      <UserCreations userCreations={formattedCreations} />
    </div>
  );
}