import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

export function CTA() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20">
      {/* Complex mesh gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" />
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/30 via-transparent to-cyan-400/40" />
      <div className="absolute inset-0 bg-gradient-to-bl from-orange-400/20 via-transparent to-emerald-500/30" />
      <div className="absolute inset-0 bg-gradient-to-tl from-blue-600/25 via-transparent to-purple-500/35" />
      
      {/* Mesh overlay for texture */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform rotate-12" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent transform -rotate-12" />
      </div>
      
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-8 right-8 w-48 h-48 bg-gradient-to-br from-pink-400/20 to-purple-600/20 rounded-full blur-2xl animate-pulse delay-300" />
        <div className="absolute bottom-8 left-8 w-56 h-56 bg-gradient-to-tr from-cyan-400/15 to-blue-600/15 rounded-full blur-2xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-gradient-to-bl from-emerald-400/15 to-indigo-600/15 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-orange-400/20 to-pink-500/20 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-l from-violet-400/20 to-cyan-500/20 rounded-full blur-xl animate-float delay-500" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/20">
          <Sparkles className="w-4 h-4" />
          <span>Start Your Teaching Revolution</span>
        </div>

        {/* Main heading - smaller sizes */}
        <div className="space-y-4 mb-8">
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Ready to Transform Your{" "}
            <span className="bg-gradient-to-r from-white via-cyan-200 to-pink-200 bg-clip-text text-transparent">
              Teaching?
            </span>
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Join thousands of educators who are already using TeachMagic to create engaging, 
            comprehensive educational content in minutes, not hours.
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <SignUpButton mode="modal">
            <Button 
              size="lg" 
              className="group bg-white/95 backdrop-blur-sm text-purple-700 hover:bg-white hover:text-purple-800 shadow-xl hover:shadow-2xl transition-all duration-300 text-base px-6 py-3 h-auto font-semibold border border-white/30"
            >
              Get Started for Free
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </SignUpButton>
          <div className="flex items-center space-x-2 text-white/90 text-sm">
            <Zap className="w-4 h-4" />
            <span>No credit card required</span>
          </div>
        </div>
      </div>
    </section>
  );
}

