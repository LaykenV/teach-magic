import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center md:text-left">
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Create Teaching Content in Minutes, Not Hours
          </h2>
          <p className="text-xl text-muted-foreground">
            TeachMagic uses AI to generate comprehensive slides and quizzes on any topic, revolutionizing how you create educational content.
          </p>
          <div>
            <SignUpButton mode="modal">
              <Button size="lg" className="text-white">Start Creating for Free</Button>
            </SignUpButton>
          </div>
        </div>
        <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-xl">
          <Image 
            src="/assets/Capture.png" 
            layout="fill" 
            objectFit="cover" 
            alt="TeachMagic platform preview" 
            className="rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}

