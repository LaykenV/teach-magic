export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card/40 backdrop-blur-sm border-t border-border/30 mt-12 sm:mt-16 py-6 sm:py-8 relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-secondary/3" />
      <div className="container mx-auto text-center text-foreground/80 relative z-10">
        <p className="text-sm sm:text-base">© {currentYear} TeachMagic. All rights reserved.</p>
      </div>
    </footer>
  )
}

