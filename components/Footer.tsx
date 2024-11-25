
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted mt-16 py-5">
        <div className="container mx-auto text-center text-muted-foreground">
        <p>© 2024 TeachMagic. All rights reserved.</p>
        </div>
    </footer>
  )
}

