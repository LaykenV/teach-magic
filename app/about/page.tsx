import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MyDock } from '@/components/MyDock';
import { FeatureSection } from '@/components/FeatureSection';
import { FAQAccordion } from '@/components/FAQAccordion';
import { HowItWorks } from '@/components/HowItWorks';
import { Zap, Layers, FileQuestion, Users, Download, GraduationCap, Sparkles, FileSearch, PenTool } from 'lucide-react';
import { ModeToggle } from '@/components/theme/ThemeToggle';

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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">

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

        <section className="py-16 ">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
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

