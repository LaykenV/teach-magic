'use client'

import { useState, useEffect, useContext } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Book, Users } from 'lucide-react'
import UserCreations from './UserCreations'
import { Creation } from '@/types/types'

// Import your community creations here
import { community_creations } from '@/lib/commCreations'
import { useSlideContext } from '@/context/SlideContext'

interface CreationsLibraryProps {
  initialCreations: Creation[]
}

export default function CreationsLibrary({ initialCreations }: CreationsLibraryProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'community'>('library')
  const [searchTerm, setSearchTerm] = useState('')
  const [ageFilter, setAgeFilter] = useState<string | null>(null)
  const [filteredCreations, setFilteredCreations] = useState<Creation[]>([])
  const { userCreations, setUserCreations } = useSlideContext();

  useEffect(() => {
    // On component mount, initialize context state with the server-provided data if it's empty
    if (userCreations.length === 0) {
      setUserCreations(initialCreations);
    }
  }, [initialCreations, userCreations, setUserCreations]);

  useEffect(() => {
    const creations = activeTab === 'library' ? userCreations : community_creations
    setFilteredCreations(
      creations.filter((creation) => {
        const matchesSearch = creation.slides.some((slide) =>
          slide.slide_title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        const matchesAge = !ageFilter || creation.age_group === ageFilter
        return matchesSearch && matchesAge
      })
    )
  }, [activeTab, searchTerm, ageFilter, userCreations])

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="library" className="w-full" onValueChange={(value) => setActiveTab(value as 'library' | 'community')}>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <TabsList className="mb-4 sm:mb-0">
            <TabsTrigger value="library" className="flex items-center">
              <Book className="mr-2" />
              My Library
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center">
              <Users className="mr-2" />
              Community
            </TabsTrigger>
          </TabsList>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search creations..."
                className="pl-10 bg-card"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select onValueChange={setAgeFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-card">
                <SelectValue placeholder="Filter by age" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elementary">elementary</SelectItem>
                <SelectItem value="middle-school">middle school</SelectItem>
                <SelectItem value="high-school">high school</SelectItem>
                <SelectItem value="college">college</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${JSON.stringify(filteredCreations)}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="library">
              <UserCreations filteredCreations={filteredCreations} self={true}/>
            </TabsContent>
            <TabsContent value="community">
              <UserCreations filteredCreations={filteredCreations} self={false}/>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}

