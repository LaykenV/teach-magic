import Image from "next/image";

const testimonials = [
  {
    quote: "TeachMagic has transformed how I create content for my classes. It's a game-changer!",
    author: "Sarah Johnson",
    role: "High School Teacher"
  },
  {
    quote: "The ability to generate quizzes automatically has saved me countless hours of work.",
    author: "Michael Chen",
    role: "University Professor"
  },
  {
    quote: "I can now create engaging content on niche topics that were previously hard to find resources for.",
    author: "Emily Rodriguez",
    role: "Online Course Creator"
  }
];

export function TestimonialSection() {
  return (
    <section className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-center mb-12">What Our Users Say</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-background text-foreground rounded-lg p-6 shadow-lg">
              <p className="text-lg mb-4">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <Image
                  src=''
                  width={40}
                  height={40}
                  alt={testimonial.author}
                  className="rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

