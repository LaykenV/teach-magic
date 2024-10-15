import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start h-screen gap-[20%]">
      <div>teach magic Landing Page</div>
      <SignInButton mode="modal" />
      <SignUpButton mode="modal" />
    </div>  

  );
}
