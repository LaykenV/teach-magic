import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FeaturesSection } from "@/components/FeaturesSection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Zap, Layers, FileQuestion, Users, Download, GraduationCap, Sparkles, FileSearch, PenTool, BookOpen } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Global gradient background that flows through the entire page */}
      <div className="fixed inset-0 z-0">
        {/* Primary gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-secondary/6" />
        {/* Secondary overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/4 via-transparent to-primary/5" />
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-primary/3 to-transparent animate-pulse" />
      </div>

      {/* Floating background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/8 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-accent/8 to-primary/6 rounded-full blur-3xl animate-float delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-secondary/6 to-accent/8 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <header className="relative z-10 bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                TeachMagic
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-sm font-medium hover:bg-primary/10 transition-colors">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="text-sm font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Free
                </Button>
              </SignUpButton>
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
              <SignUpButton mode="modal">
                <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg">
                  Start Free
                </Button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow relative z-10">
        <HeroSection />
        
        <FeaturesSection 
          features={features}
        />

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

        <section className="relative py-16 sm:py-20 lg:py-24">
          {/* Section-specific gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent" />
          
          <div className="container mx-auto px-4 relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
              Frequently Asked Questions
            </h3>
            <FAQAccordion />
          </div>
        </section>
      </main>

      <footer className="relative z-10 bg-gradient-to-t from-muted/20 to-transparent backdrop-blur-sm border-t border-border/30 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 TeachMagic. All rights reserved.</p>
        </div>
      </footer>
      
      <ModeToggle />
    </div>
  );
}

