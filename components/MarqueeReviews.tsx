import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";
import { useMemo } from "react";
import { Star, Quote, Users, Zap, Sparkles } from "lucide-react";

const reviews = [
    {
      name: "Sarah J.",
      role: "Teacher",
      body: "Creates engaging content in minutes!",
      img: "https://avatar.vercel.sh/sarah",
      rating: 5,
    },
    {
      name: "Michael C.",
      role: "Professor",
      body: "AI-generated quizzes save hours of work.",
      img: "https://avatar.vercel.sh/michael",
      rating: 5,
    },
    {
      name: "Emily R.",
      role: "Homeschool Parent",
      body: "Game-changer for homeschooling.",
      img: "https://avatar.vercel.sh/emily",
      rating: 5,
    },
    {
      name: "David T.",
      role: "Science Teacher",
      body: "Excellent for niche scientific topics.",
      img: "https://avatar.vercel.sh/david",
      rating: 5,
    },
    {
      name: "Lisa P.",
      role: "Tutor",
      body: "Adapts content to different grade levels.",
      img: "https://avatar.vercel.sh/lisa",
      rating: 5,
    },
    {
      name: "Robert K.",
      role: "University Lecturer",
      body: "Depth and accuracy impress me.",
      img: "https://avatar.vercel.sh/robert",
      rating: 5,
    },
    {
      name: "Anna M.",
      role: "Elementary Teacher",
      body: "Students love the interactive elements!",
      img: "https://avatar.vercel.sh/anna",
      rating: 5,
    },
    {
      name: "James L.",
      role: "High School Teacher",
      body: "Saves time on lesson planning.",
      img: "https://avatar.vercel.sh/james",
      rating: 5,
    },
    {
      name: "Sophia W.",
      role: "ESL Instructor",
      body: "Great for language learning materials.",
      img: "https://avatar.vercel.sh/sophia",
      rating: 5,
    },
    {
      name: "Daniel R.",
      role: "History Teacher",
      body: "Brings historical topics to life.",
      img: "https://avatar.vercel.sh/daniel",
      rating: 5,
    },
    // New Homeschool-Focused Reviews
    {
      name: "Laura S.",
      role: "Homeschool Parent",
      body: "Balancing subjects is easier with TeachMagic.",
      img: "https://avatar.vercel.sh/laura",
      rating: 5,
    },
    {
      name: "Mark B.",
      role: "Homeschool Parent",
      body: "TeachMagic enriches our homeschooling curriculum significantly.",
      img: "https://avatar.vercel.sh/mark",
      rating: 5,
    },
    {
      name: "Natalie K.",
      role: "Homeschool Parent",
      body: "Adaptive learning makes homeschooling more effective.",
      img: "https://avatar.vercel.sh/natalie",
      rating: 5,
    },
    {
      name: "Olivia M.",
      role: "Homeschool Parent",
      body: "TeachMagic provides comprehensive resources effortlessly.",
      img: "https://avatar.vercel.sh/olivia",
      rating: 5,
    },
    {
      name: "Ethan L.",
      role: "Homeschool Parent",
      body: "Easily create tailored lessons for my kids.",
      img: "https://avatar.vercel.sh/ethan",
      rating: 5,
    },
    {
      name: "Grace H.",
      role: "Homeschool Parent",
      body: "Interactive quizzes keep my children engaged.",
      img: "https://avatar.vercel.sh/grace",
      rating: 5,
    },
  ];

const ReviewCard = ({
  img,
  name,
  role,
  body,
  rating,
}: {
  img: string;
  name: string;
  role: string;
  body: string;
  rating: number;
}) => {
  return (
    <figure
      className={cn(
        "relative w-72 sm:w-80 cursor-pointer overflow-hidden rounded-2xl border p-6 mx-3 group",
        "border-border/40 bg-background/60 backdrop-blur-md hover:bg-background/80",
        "transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02]",
        "dark:border-border/30 dark:bg-background/40 dark:hover:bg-background/60"
      )}
    >
      {/* Enhanced background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/8 to-secondary/6 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
      <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-tr from-accent/6 to-primary/8 rounded-full blur-lg group-hover:scale-125 transition-transform duration-700"></div>
      
      {/* Quote icon */}
      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
        <Quote className="w-6 h-6 text-primary" />
      </div>
      
      <div className="relative z-10">
        {/* Header with avatar and info */}
        <div className="flex flex-row items-center gap-3 mb-4">
          <div className="relative">
            <img 
              className="rounded-full ring-2 ring-primary/30 group-hover:ring-primary/50 transition-all duration-300 shadow-lg" 
              width="40" 
              height="40" 
              alt={`${name} avatar`} 
              src={img} 
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-background shadow-sm"></div>
          </div>
          <div className="flex flex-col flex-1">
            <figcaption className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
              {name}
            </figcaption>
            <p className="text-xs font-medium text-muted-foreground">{role}</p>
          </div>
        </div>

        {/* Star rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-primary text-primary drop-shadow-sm" />
          ))}
        </div>

        {/* Review text */}
        <blockquote className="text-sm leading-relaxed text-foreground/90 group-hover:text-foreground transition-colors duration-300">
          &ldquo;{body}&rdquo;
        </blockquote>
      </div>
    </figure>
  );
};

export function MarqueeReviews() {
  // Shuffle the reviews using useMemo to avoid reshuffling on every render
  const shuffledReviews = useMemo(() => {
    const shuffled = [...reviews];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  return (
    <section className="relative py-16 sm:py-20 lg:py-24">
      {/* Section-specific gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/6 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/4 via-transparent to-primary/6" />
      
      {/* Enhanced floating elements for this section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-12 left-12 w-40 h-40 bg-gradient-to-br from-accent/8 to-primary/6 rounded-full blur-2xl animate-pulse delay-500" />
        <div className="absolute bottom-12 right-12 w-48 h-48 bg-gradient-to-tr from-secondary/6 to-accent/8 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 px-4">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Educators Are{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
              Saying
            </span>
          </h3>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands of educators who have transformed their teaching with TeachMagic
          </p>
        </div>

        {/* Marquee container */}
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:50s] py-4">
            {shuffledReviews.map((review, index) => (
              <ReviewCard key={index} {...review} />
            ))}
          </Marquee>
          
          {/* Enhanced gradient overlays for fade effect */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 lg:w-32 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 lg:w-32 bg-gradient-to-l from-background via-background/80 to-transparent"></div>
        </div>

        {/* Trust indicators */}
        <div className="text-center mt-12 sm:mt-16 px-4">
          <p className="text-sm text-muted-foreground mb-3">Trusted by educators worldwide</p>
          <div className="flex items-center justify-center space-x-4 opacity-70">
            <div className="flex items-center space-x-1 bg-background/40 backdrop-blur-sm px-2 py-1 rounded-md border border-border/20">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">K-12 Schools</span>
            </div>
            <div className="w-1 h-1 bg-muted-foreground rounded-full" />
            <div className="flex items-center space-x-1 bg-background/40 backdrop-blur-sm px-2 py-1 rounded-md border border-border/20">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Universities</span>
            </div>
            <div className="w-1 h-1 bg-muted-foreground rounded-full" />
            <div className="flex items-center space-x-1 bg-background/40 backdrop-blur-sm px-2 py-1 rounded-md border border-border/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Training Centers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

