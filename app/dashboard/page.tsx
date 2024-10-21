import { SignOutButton, UserButton } from '@clerk/nextjs';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/drizzle/db';
import { usersTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm/expressions';
import ClientTest from '@/components/ClientTest';
import { User } from '@/drizzle/schema';
import SetUserContext from '@/components/SetContext';
import { UserEntry } from '@/types/types';
import { creationsTable } from '@/drizzle/schema';
import { Creation } from '@/drizzle/schema';
import UserCreations from '@/components/UserCreations';


export default async function Home() {
  const { userId} = auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) {
    return <div>No user found</div>;
  }
  const stringId = userId.toString();

  let user: User | null = null;

  const loggedInUser = await db.select().from(usersTable).where(eq(usersTable.id, stringId));

  if (loggedInUser.length > 0) {
    user = loggedInUser[0];
  } else {
    const userEntry: UserEntry = {
      id: clerkUser?.id,
      email: clerkUser?.emailAddresses[0].emailAddress,
      name: clerkUser?.firstName + ' ' + clerkUser?.lastName,
    };

    await db.insert(usersTable).values(userEntry).onConflictDoNothing();

    const [newUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, clerkUser.id));
    user = newUser;
  }


  console.log('loggedInUser', loggedInUser);
  console.log('user', user);

  //query db for user creations with userId
  const userCreations = await db.select().from(creationsTable).where(eq(creationsTable.user_id, userId));
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
      <div>Dashboard {userId} {user?.name}</div>
      <div> {loggedInUser.length > 0 ? loggedInUser[0].name + 'working' : "mock user"}</div>
      <SignOutButton />
      <UserButton />
      <SetUserContext user={user} />
      <ClientTest />
      <div>user creations</div>
      <UserCreations userCreations={formattedCreations} />
    </div>
  );
}