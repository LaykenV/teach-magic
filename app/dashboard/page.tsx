import { SignOutButton, UserButton } from '@clerk/nextjs';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/drizzle/db';
import { usersTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm/expressions';
import ClientTest from '@/components/ClientTest';
import { User } from '@/drizzle/schema';
import SetUserContext from '@/components/SetContext';
import { UserEntry } from '@/types/types';
import Router from 'next/router';
import { creationsTable } from '@/drizzle/schema';
import { Creation } from '@/drizzle/schema';


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
  //pass creations to my creations page

  //generate new creation

  //gallery of creations
  return (
    <div>
      <div>Dashboard {userId} {user?.name}</div>
      <div> {loggedInUser.length > 0 ? loggedInUser[0].name + 'working' : "mock user"}</div>
      <SignOutButton />
      <UserButton />
      <SetUserContext user={user} />
      <ClientTest />
      <button onClick={() => Router.push('/generate')}>Generate</button>
      <div>user creations</div>
      {formattedCreations.map((creation) => (
        <div key={creation.id}>
          <h2>{creation.id}</h2>
          <p>{creation.slides[0].slide_title}</p>
          <button onClick={() => Router.push(`/SlideViewer?id=${creation.id}`)}>View</button>
        </div>
      ))}
    </div>
  );
}