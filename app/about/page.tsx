import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { MyDock } from '@/components/MyDock';
import { FeatureSection } from '@/components/FeatureSection';
import { FAQAccordion } from '@/components/FAQAccordion';
import { HowItWorks } from '@/components/HowItWorks';
import { Zap, Layers, Download, GraduationCap, Sparkles, FileSearch, PenTool } from 'lucide-react';

const About = async () => {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) {
    redirect('/');
  }

  const slideFeatures = [
    { icon: <Sparkles size={20} />, title: "Niche Topics", description: "Generate content on ultra-specific subjects with ease." },
    { icon: <Layers size={20} />, title: "Custom Visuals", description: "AI-generated images tailored to your content." },
    { icon: <Download size={20} />, title: "PowerPoint Export", description: "Easily export slides for offline use." },
    { icon: <Zap size={20} />, title: "Rapid Creation", description: "Create full slide decks in minutes, not hours." },
  ];

  const quizFeatures = [
    { icon: <FileSearch size={20} />, title: "Content-Based", description: "Questions generated from your slide content." },
    { icon: <PenTool size={20} />, title: "Multiple Formats", description: "Create various question types for diverse assessment." },
    { icon: <Download size={20} />, title: "PDF Export", description: "Export quizzes for printing or digital distribution." },
    { icon: <GraduationCap size={20} />, title: "Adaptive Difficulty", description: "Automatically adjust to different learning levels." },
  ];

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Enhanced glass-morphism background matching FAQ component */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-background backdrop-blur-sm -z-10" />
      <div className="fixed inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-blue-950/20 dark:via-purple-950/15 dark:to-pink-950/20 -z-10" />
      
      {/* Subtle floating gradient orbs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/15 to-purple-400/15 dark:from-cyan-500/8 dark:to-purple-500/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/15 to-pink-400/15 dark:from-purple-500/8 dark:to-pink-500/8 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-400/15 to-cyan-400/15 dark:from-pink-500/8 dark:to-cyan-500/8 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className='relative h-[10px] bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500'></div>
      
      <main className="flex-grow relative z-10">
        {/* Hero section with enhanced spacing for mobile */}
        <section className="py-4 sm:py-8 lg:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent leading-tight py-4">
                Transform Teaching with AI Magic
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
                Create engaging educational content effortlessly with our AI-powered platform designed for modern educators.
              </p>
            </div>
          </div>
        </section>

        <HowItWorks />

        <FeatureSection
          title="Interactive Slides"
          description="Create engaging slides with AI-generated images on any topic imaginable, no matter how niche."
          imageSrc="/assets/SlidesSS.png"
          imageAlt="TeachMagic Slides"
          features={slideFeatures}
          isAbout
        />

        <FeatureSection
          title="Auto-Generated Quizzes"
          description="Reinforce learning with quizzes automatically created from your slide content, perfect for any subject."
          imageSrc="/assets/QuizSS.png"
          imageAlt="TeachMagic Quiz"
          features={quizFeatures}
          reversed
          isAbout
        />

        <section className="py-12 sm:py-16 lg:py-20 relative">
          {/* Section-specific gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                Find answers to common questions about TeachMagic
              </p>
            </div>
            <FAQAccordion />
          </div>
        </section>
      </main>
      
      <Footer />
      <MyDock dashboard={false} />
    </div>
  );
};

export default About;

