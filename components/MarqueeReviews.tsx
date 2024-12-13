import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";
import { useMemo } from "react";

const reviews = [
    {
      name: "Sarah J.",
      role: "Teacher",
      body: "Creates engaging content in minutes!",
      img: "https://avatar.vercel.sh/sarah",
    },
    {
      name: "Michael C.",
      role: "Professor",
      body: "AI-generated quizzes save hours of work.",
      img: "https://avatar.vercel.sh/michael",
    },
    {
      name: "Emily R.",
      role: "Homeschool Parent",
      body: "Game-changer for homeschooling.",
      img: "https://avatar.vercel.sh/emily",
    },
    {
      name: "David T.",
      role: "Science Teacher",
      body: "Excellent for niche scientific topics.",
      img: "https://avatar.vercel.sh/david",
    },
    {
      name: "Lisa P.",
      role: "Tutor",
      body: "Adapts content to different grade levels.",
      img: "https://avatar.vercel.sh/lisa",
    },
    {
      name: "Robert K.",
      role: "University Lecturer",
      body: "Depth and accuracy impress me.",
      img: "https://avatar.vercel.sh/robert",
    },
    {
      name: "Anna M.",
      role: "Elementary Teacher",
      body: "Students love the interactive elements!",
      img: "https://avatar.vercel.sh/anna",
    },
    {
      name: "James L.",
      role: "High School Teacher",
      body: "Saves time on lesson planning.",
      img: "https://avatar.vercel.sh/james",
    },
    {
      name: "Sophia W.",
      role: "ESL Instructor",
      body: "Great for language learning materials.",
      img: "https://avatar.vercel.sh/sophia",
    },
    {
      name: "Daniel R.",
      role: "History Teacher",
      body: "Brings historical topics to life.",
      img: "https://avatar.vercel.sh/daniel",
    },
    // New Homeschool-Focused Reviews
    {
      name: "Laura S.",
      role: "Homeschool Parent",
      body: "Balancing subjects is easier with TeachMagic.",
      img: "https://avatar.vercel.sh/laura",
    },
    {
      name: "Mark B.",
      role: "Homeschool Parent",
      body: "TeachMagic enriches our homeschooling curriculum significantly.",
      img: "https://avatar.vercel.sh/mark",
    },
    {
      name: "Natalie K.",
      role: "Homeschool Parent",
      body: "Adaptive learning makes homeschooling more effective.",
      img: "https://avatar.vercel.sh/natalie",
    },
    {
      name: "Olivia M.",
      role: "Homeschool Parent",
      body: "TeachMagic provides comprehensive resources effortlessly.",
      img: "https://avatar.vercel.sh/olivia",
    },
    {
      name: "Ethan L.",
      role: "Homeschool Parent",
      body: "Easily create tailored lessons for my kids.",
      img: "https://avatar.vercel.sh/ethan",
    },
    {
      name: "Grace H.",
      role: "Homeschool Parent",
      body: "Interactive quizzes keep my children engaged.",
      img: "https://avatar.vercel.sh/grace",
    },
  ];

const ReviewCard = ({
  img,
  name,
  role,
  body,
}: {
  img: string;
  name: string;
  role: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4 mx-2",
        "border-primary/10 bg-primary/5 hover:bg-primary/10",
        "dark:border-primary-foreground/10 dark:bg-primary-foreground/10 dark:hover:bg-primary-foreground/20",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-foreground">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-muted-foreground">{role}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-foreground">{body}</blockquote>
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
    <div className="relative flex h-[300px] w-full flex-col items-center justify-center overflow-hidden py-10">
      <h3 className="text-2xl font-bold mb-6 text-center">What Educators Are Saying</h3>
      <Marquee pauseOnHover className="[--duration:40s]">
        {shuffledReviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
    </div>
  );
}

