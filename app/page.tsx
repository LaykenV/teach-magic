import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Image as ImageIcon, BrainCircuit } from "lucide-react";

export default async function Home() {
  const user = await currentUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">TeachMagic</h1>
          <nav>
            <SignInButton mode="modal">
              <Button variant="ghost">Sign In</Button>
            </SignInButton>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
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
              src="/assets/mock.png" 
              layout="fill" 
              objectFit="cover" 
              alt="TeachMagic platform preview" 
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <BookOpen className="w-10 h-10 mb-2 text-primary" />
              <CardTitle>In-Depth Study Material</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access comprehensive learning resources tailored to your chosen topic, powered by cutting-edge AI.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <ImageIcon className="w-10 h-10 mb-2 text-primary" />
              <CardTitle>AI-Generated Visuals</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Enhance your learning experience with custom-generated images that perfectly match your study material.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <BrainCircuit className="w-10 h-10 mb-2 text-primary" />
              <CardTitle>Interactive Knowledge Checks</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Reinforce your understanding with AI-crafted questions at the end of each learning module.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-muted mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 TeachMagic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}