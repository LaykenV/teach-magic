import { Gem } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function TokenCount({ count }: { count: number | null }) {
  return (
    <div className="">
        <Gem className="w-4 h-4" aria-hidden="true" />
        <span className="font-medium tabular-nums">{count ? count.toLocaleString() : 0}</span>
    </div>
        
  )
}