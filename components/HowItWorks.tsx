import { Lightbulb, Layers, FileQuestion, ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <Lightbulb className="h-8 w-8 text-yellow-400" />,
      title: "Enter Your Topic",
      description: "Provide a subject or topic you want to teach about, no matter how specific or niche.",
    },
    {
      icon: <Layers className="h-8 w-8 text-blue-500" />,
      title: "AI Generates Slides",
      description: "Our AI creates comprehensive slides with custom images and informative content.",
    },
    {
      icon: <FileQuestion className="h-8 w-8 text-green-500" />,
      title: "Quiz Creation",
      description: "Based on the slide content, a multiple-choice quiz is automatically generated.",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How TeachMagic Works</h2>
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start space-y-8 md:space-y-0 md:space-x-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center max-w-xs">
              <div className="bg-gray-100 rounded-full p-4 mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              {index < steps.length - 1 && (
                <ArrowRight className="h-6 w-6 text-gray-400 mt-4 hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

