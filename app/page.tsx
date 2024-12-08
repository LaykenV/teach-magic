import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/FeatureCard";
import { FAQAccordion } from "@/components/FAQAccordion";
import { BookOpen } from 'lucide-react';
import { Image as Image2, FileQuestion, Layers, Lightbulb, GraduationCap } from 'lucide-react';


export default async function Home() {
  const user = await currentUser();

  if (user) {
    redirect('/dashboard');
  }

  const features = [
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "AI-Powered Content Generation",
      description: "Simply provide a subject prompt, and our AI generates comprehensive educational slides tailored to your needs."
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Custom Slide Creation",
      description: "Each slide includes a title, informative paragraphs, and a custom AI-generated image to illustrate the content."
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Grade-Level Adaptation",
      description: "Content is automatically adjusted to suit various grade levels, ensuring age-appropriate learning materials."
    },
    {
      icon: <FileQuestion className="h-6 w-6" />,
      title: "Interactive Quizzes",
      description: "Each set of slides comes with a quiz to reinforce learning and test understanding of the material."
    },
    {
      icon: <Image2 className="h-6 w-6" />,
      title: "AI Image Generation",
      description: "Unique, relevant images are created for each slide, enhancing visual learning and engagement."
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Diverse Subject Coverage",
      description: "Generate slides on any subject, from history and science to literature and beyond."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">TeachMagic</h1>
          <nav className="space-x-4">
            <SignInButton mode="modal">
              <Button variant="ghost">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button>Create an account</Button>
            </SignUpButton>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                Unlock the Power of AI-Driven Learning
              </h2>
              <p className="text-xl text-muted-foreground">
                Explore any topic imaginable with TeachMagics revolutionary AI-powered teaching platform.
              </p>
              <SignUpButton mode="modal">
                <Button size="lg" className="mt-4">Get Started for Free</Button>
              </SignUpButton>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
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

        <section className="bg-muted py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h3 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h3>
          <FAQAccordion />
        </section>
      </main>

      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 TeachMagic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

