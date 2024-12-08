
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card mt-16 py-5">
        <div className="container mx-auto text-center text-primary">
        <p>© {currentYear} TeachMagic. All rights reserved.</p>
        </div>
    </footer>
  )
}

