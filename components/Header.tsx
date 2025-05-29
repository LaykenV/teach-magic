import Particles from "@/components/ui/particles";
import Link from "next/link";


export function Header() {
  return (
    <header className="w-full relative">
      <Particles quantity={100} ease={80} size={1} className="absolute inset-0 h-full opacity-60" refresh color="#be5eed"/>
      <div className='relative h-[10px] bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500'></div>
        <div className="relative text-center py-8">
          <Link href="/dashboard" prefetch>
            <h2 className="text-6xl font-bold mb-2 text-primary">TeachMagic</h2>
          </Link>
          <p className="text-xl text-muted-foreground mb-4">
          Revolutionizing education with AI-powered slide creation and quiz generation for any topic, no matter how niche.          </p>
        </div>
    </header>
  );
}
