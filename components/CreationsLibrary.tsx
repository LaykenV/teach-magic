'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Book, Users, Coins, Gem } from 'lucide-react'
import UserCreations from './UserCreations'
import { Creation } from '@/types/types'
import { useRouter } from 'next/navigation'

// Import your community creations here
import { useSlideContext } from '@/context/SlideContext'
import { getData } from '@/utils/getComCreations'

interface CreationsLibraryProps {
  initialCreations: Creation[],
  tokens: number | null
}

export default function CreationsLibrary({ initialCreations, tokens }: CreationsLibraryProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'community'>('community');
  const [searchTerm, setSearchTerm] = useState('')
  const [ageFilter, setAgeFilter] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null);
  const [filteredCreations, setFilteredCreations] = useState<Creation[]>([])
  const { userCreations, setUserCreations } = useSlideContext();
  const router = useRouter()
  const community_creations = getData();

  useEffect(() => {
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
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'library' | 'community')} className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <div 
            className="flex items-center space-x-2 hover:bg-primary px-3 py-2 rounded-md cursor-pointer transition-colors h-10"
            onClick={() => router.push('/pricing')}
          >
            <Gem className="w-5 h-5" />
            <span className='no-wrap'>{tokens} gems</span>
          </div>
          <TabsList>
            <TabsTrigger value="library" className="flex items-center">
              <Book className="mr-2" />
              My Library
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center">
              <Users className="mr-2" />
              Community
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
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
            <SelectTrigger className="w-full md:w-[180px] bg-card">
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
            <UserCreations filteredCreations={filteredCreations} self={true} setSuccess={setSuccess} success={success} tokens={tokens}/>
          </TabsContent>
          <TabsContent value="community">
            <UserCreations filteredCreations={filteredCreations} self={false} setSuccess={setSuccess} success={success} tokens={tokens}/>
          </TabsContent>
        </motion.div>
      </AnimatePresence>
    </Tabs>
  </div>
  )
}

