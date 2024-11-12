'use client'

import React, { useState } from 'react'
import { Creation } from '@/drizzle/schema'
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { CldImage } from "next-cloudinary"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, Plus, Trash } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface UserCreationsProps {
  userCreations: Creation[]
}

export default function UserCreations({ userCreations }: UserCreationsProps) {
  const router = useRouter()
  const [creations, setCreations] = useState<Creation[]>(userCreations)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const deleteCreation = async (id: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation()
    setError(null)
    setSuccess(null)

    setDeletingIds(prev => new Set(prev).add(id))

    try {
      const response = await fetch(`/api/deleteCreation?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `API error: ${response.statusText}`)
      }

      setCreations(prevCreations => prevCreations.filter(creation => creation.id !== id))
      setSuccess('Creation deleted successfully.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error deleting creation:', error)
      setError(error.message || 'Failed to delete creation.')
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const handleCardClick = (id: string) => {
    router.push(`/SlideViewer?id=${id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">My Creations</h2>

      {success && (
        <Alert variant="default" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {creations.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">You have no creations.</p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href="/generate">
                <Plus className="mr-2 h-4 w-4" />
                Create your first
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {creations.map((creation) => (
            <Card 
              key={creation.id} 
              className="overflow-hidden cursor-pointer transition-shadow hover:shadow-lg"
              onClick={() => handleCardClick(creation.id)}
            >
              <CardHeader className="p-0">
                {creation.slides[0]?.slide_image_url ? (
                  <div className="relative aspect-video">
                    <CldImage
                      width={400}
                      height={225}
                      src={creation.slides[0].slide_image_url}
                      alt={creation.slides[0].slide_title || 'Slide Image'}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="bg-muted aspect-video flex items-center justify-center">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg line-clamp-2">
                  {creation.slides[0]?.slide_title || 'Untitled Creation'}
                </CardTitle>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-end">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={(e) => deleteCreation(creation.id, e)}
                  disabled={deletingIds.has(creation.id)}
                >
                  {deletingIds.has(creation.id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4" />
                  )}
                  <span className="sr-only">Delete creation</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}