"use client";
import { useSlideContext } from '@/context/SlideContext';

export default function ClientTest() {
    const {user} = useSlideContext();
    console.log('user', user);
  return (
    <div>
      <h1>Client Test</h1>
      <p>This is a test component that is rendered on the client-side.</p>
      <p>User data: {user?.tokens} name {user?.name}</p>
    </div>
  );
}