import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="bg-gradient-to-r from-indigo-500 to-purple-600 py-16">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-3xl font-bold mb-6 text-white">Ready to Transform Your Teaching?</h3>
        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Join thousands of educators who are already using TeachMagic to create engaging content in minutes.
        </p>
        <SignUpButton mode="modal">
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">Get Started for Free</Button>
        </SignUpButton>
      </div>
    </section>
  );
}

