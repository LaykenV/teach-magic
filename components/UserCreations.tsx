"use client";
import { Creation } from "@/drizzle/schema";
import Link from 'next/link'
import { useRouter } from "next/navigation";
import React from "react";

interface UserCreationsProps {
  userCreations: Creation[];
}

const UserCreations: React.FC<UserCreationsProps> = ({ userCreations }) => {
    const router = useRouter();

  return (
    <div>
      <h2>My Creations</h2>
      <div>
        {userCreations.map((creation) => (
          <div key={creation.id} onClick={() => router.push(`/SlideViewer?id=${creation.id}`)}>
            <h3>{creation.id}</h3>
            <p>{creation.slides[0].slide_title}</p>
            {/*<Image src={creation.slides[0].slide_image_url} alt="Slide Image" width={300} height={200} />*/}
          </div>
        ))}
      </div>
      <Link href="/generate">Generate</Link>
    </div>
    
  );
};

export default UserCreations;