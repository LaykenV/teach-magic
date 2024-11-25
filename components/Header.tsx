
export function Header() {
  return (
    <header className="w-full bg-background border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-4xl md:text-5xl font-bold bg-primary bg-clip-text text-transparent pb-4">
              Teach Magic
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Unleash the power of interactive learning
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

