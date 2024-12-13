import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/FeatureCard";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Zap, Layers, FileQuestion, Users, Download, GraduationCap, Sparkles, FileSearch, PenTool } from 'lucide-react';
import { HeroSection } from "@/components/HeroSection";
import { FeatureSection } from "@/components/FeatureSection";
import { CTASection } from "@/components/CTASection";
import { MarqueeReviews } from "@/components/MarqueeReviews";
import { ModeToggle } from "@/components/theme/ThemeToggle";

export default async function Home() {
  const user = await currentUser();

  if (user) {
    redirect('/dashboard');
  }

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Content Creation",
      description: "Generate comprehensive educational content on any topic in minutes, not hours."
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Interactive Slides",
      description: "Create engaging slides with AI-generated images, tailored to your specific subject matter."
    },
    {
      icon: <FileQuestion className="h-6 w-6" />,
      title: "Auto-Generated Quizzes",
      description: "Reinforce learning with automatically created quizzes based on your slide content."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Content",
      description: "Explore and learn from a vast library of community-created educational materials."
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Easy Export",
      description: "Export your slides to PowerPoint and quizzes to PDF for offline use and sharing."
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Adaptive Learning",
      description: "Content automatically adjusts to various grade levels, ensuring age-appropriate materials."
    }
  ];

  const slideFeatures = [
    { icon: <Sparkles size={20} />, title: "Niche Topics", description: "Generate content on ultra-specific subjects with ease." },
    { icon: <Layers size={20} />, title: "Custom Visuals", description: "AI-generated images tailored to your content." },
    { icon: <Download size={20} />, title: "PowerPoint Export", description: "Easily export slides for offline use." },
    { icon: <Zap size={20} />, title: "Rapid Creation", description: "Create full slide decks in minutes, not hours." },
  ];

  const quizFeatures = [
    { icon: <FileSearch size={20} />, title: "Content-Based", description: "Questions generated from your slide content." },
    { icon: <PenTool size={20} />, title: "Multiple Choice", description: "Choose from four answer choices for each question." },
    { icon: <Download size={20} />, title: "PDF Export", description: "Export quizzes for printing or digital distribution." },
    { icon: <GraduationCap size={20} />, title: "Adaptive Difficulty", description: "Automatically adjust to different learning levels." },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">TeachMagic</h1>
          <nav className="space-x-4">
            <SignInButton mode="modal">
              <Button variant="ghost">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="text-white">Start Free</Button>
            </SignUpButton>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <HeroSection />
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">Revolutionize Your Teaching</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <MarqueeReviews />

        <FeatureSection
          title="Interactive Slides"
          description="Create engaging slides with AI-generated images on any topic imaginable, no matter how niche."
          imageSrc="/assets/SlidesSS.png"
          imageAlt="TeachMagic Slides"
          features={slideFeatures}
          isAbout={false}
        />

        <FeatureSection
          title="Auto-Generated Quizzes"
          description="Reinforce learning with quizzes automatically created from your slide content, perfect for any subject."
          imageSrc="/assets/QuizSS.png"
          imageAlt="TeachMagic Quiz"
          features={quizFeatures}
          reversed
          isAbout={false}
        />

        <CTASection />

        <section className="container mx-auto px-4 py-16">
          <h3 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h3>
          <FAQAccordion />
        </section>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>© 2024 TeachMagic. All rights reserved.</p>
        </div>
      </footer>
      <ModeToggle />
    </div>
  );
}

