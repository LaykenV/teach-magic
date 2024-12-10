import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MyDock } from '@/components/MyDock';
import { FeatureCard } from '@/components/FeatureCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { BookOpen, Image, FileQuestion, Layers, Lightbulb, GraduationCap } from 'lucide-react';

const About = async () => {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) {
    redirect('/');
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
      icon: <Image className="h-6 w-6" />,
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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center">About Our Educational Slides App</h1>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
            <FAQAccordion />
          </div>
        </div>
      </main>
      <Footer />
      <MyDock dashboard={false} />
    </div>
  );
};

export default About;

