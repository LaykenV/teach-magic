import { Gem } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function TokenCount({ count }: { count: number | null }) {
  return (
    <Button
      variant="secondary"
      size="sm"
      className="flex items-center space-x-2 text-secondary-foreground hover:bg-secondary/80"
      asChild
    >
      <Link href="/pricing">
        <Gem className="w-4 h-4" aria-hidden="true" />
        <span className="font-medium tabular-nums">{count ? count.toLocaleString() : 0}</span>
        <span className="sr-only">tokens - Click to view pricing</span>
      </Link>
    </Button>
  )
}