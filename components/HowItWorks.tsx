import { Lightbulb, Layers, FileQuestion, ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <Lightbulb className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />,
      title: "Enter Your Topic",
      description: "Provide a subject or topic you want to teach about, no matter how specific or niche.",
      gradient: "from-yellow-400/20 to-orange-400/20 dark:from-yellow-500/15 dark:to-orange-500/15"
    },
    {
      icon: <Layers className="h-8 w-8 text-blue-500 dark:text-blue-400" />,
      title: "AI Generates Slides",
      description: "Our AI creates comprehensive slides with custom images and informative content.",
      gradient: "from-blue-400/20 to-indigo-400/20 dark:from-blue-500/15 dark:to-indigo-500/15"
    },
    {
      icon: <FileQuestion className="h-8 w-8 text-green-500 dark:text-green-400" />,
      title: "Quiz Creation",
      description: "Based on the slide content, a multiple-choice quiz is automatically generated.",
      gradient: "from-green-400/20 to-emerald-400/20 dark:from-green-500/15 dark:to-emerald-500/15"
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/30 to-transparent dark:via-indigo-950/20" />
      
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-300/10 to-purple-300/10 dark:from-blue-500/5 dark:to-purple-500/5 rounded-full blur-2xl animate-pulse delay-300" />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-br from-green-300/10 to-blue-300/10 dark:from-green-500/5 dark:to-blue-500/5 rounded-full blur-2xl animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 dark:from-indigo-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
            How TeachMagic Works
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into engaging educational content in three simple steps
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-8 xl:space-x-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center max-w-sm w-full group">
              {/* Enhanced step card */}
              <div className="relative mb-6">
                {/* Gradient background */}
                <div className={`absolute -inset-2 bg-gradient-to-br ${step.gradient} rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-all duration-500`} />
                
                {/* Icon container */}
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-4 sm:p-5 border border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group-hover:-translate-y-1">
                  {step.icon}
                </div>
                
                {/* Step number */}
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                {step.title}
              </h3>
              
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300 px-2">
                {step.description}
              </p>
              
              {/* Arrow connector for larger screens */}
              {index < steps.length - 1 && (
                <>
                  {/* Horizontal arrow for desktop */}
                  <div className="hidden lg:block absolute top-1/2 left-full transform -translate-y-1/2 translate-x-4 xl:translate-x-6">
                    <ArrowRight className="h-6 w-6 text-indigo-400/60 dark:text-indigo-500/60 animate-pulse" />
                  </div>
                  
                  {/* Vertical arrow for mobile */}
                  <div className="lg:hidden mt-6 mb-2">
                    <ArrowRight className="h-6 w-6 text-indigo-400/60 dark:text-indigo-500/60 rotate-90 animate-pulse" />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/50 dark:border-gray-700/50">
            <span>✨</span>
            <span>Ready to get started?</span>
            <span>✨</span>
          </div>
        </div>
      </div>
    </section>
  );
}

