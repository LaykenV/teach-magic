import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/8 border-border/50 bg-card/50 backdrop-blur-sm group relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-xl group-hover:scale-105 transition-transform duration-500"></div>
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent/5 rounded-full blur-lg group-hover:scale-110 transition-transform duration-700"></div>
      
      <CardHeader className="relative z-10 pb-4">
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
          {icon}
        </div>
        <CardTitle className="text-xl md:text-2xl mb-3 font-bold text-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 pt-0">
        <p className="text-muted-foreground leading-relaxed text-base group-hover:text-foreground/80 transition-colors duration-300">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

