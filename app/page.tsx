import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Home() {

  //use landing page?
  //montessori learning
  //try for free, no card
  //reviews
  //faq
  
  return (
    <div className="flex flex-col items-center justify-start h-screen gap-[20%]">
      <div>teach magic Landing Page</div>
      <SignInButton mode="modal" />
      <SignUpButton mode="modal" />
    </div>  

  );
}
