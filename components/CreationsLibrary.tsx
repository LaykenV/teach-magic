'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Book, Users, Gem } from 'lucide-react'
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
      if (initialCreations.length === 0) {
        setActiveTab('community');
      } else {
        setActiveTab('library');
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, searchTerm, ageFilter, userCreations])

  return (
    <section className="relative">
      {/* Section-specific gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/6 to-transparent rounded-2xl" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/4 via-transparent to-accent/4 rounded-2xl" />
      
      {/* Enhanced floating elements for this section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-8 right-8 w-40 h-40 bg-gradient-to-br from-secondary/8 to-primary/6 rounded-full blur-3xl animate-pulse delay-300" />
        <div className="absolute bottom-8 left-8 w-48 h-48 bg-gradient-to-tr from-accent/6 to-secondary/8 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'library' | 'community')} className="w-full">
          <div className="flex flex-col space-y-4 sm:space-y-6 mb-6 sm:mb-8">
            {/* Header section with improved mobile layout */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                {/* Mobile: Gems and tabs in same row */}
                <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto space-x-3 sm:space-x-4">
                  <div 
                    className="flex items-center justify-center space-x-2 hover:bg-primary hover:text-white px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary hover:to-secondary border border-primary/20 hover:border-primary group"
                    onClick={() => router.push('/pricing')}
                  >
                    <Gem className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className='font-medium'>{tokens} gems</span>
                  </div>
                  <TabsList className="bg-background/60 backdrop-blur-sm border border-border/30">
                    <TabsTrigger value="library" className="flex items-center space-x-2 data-[state=active]:bg-primary/20">
                      <Book className="w-4 h-4" />
                      <span className="hidden sm:inline">My Library</span>
                      <span className="sm:hidden">Library</span>
                    </TabsTrigger>
                    <TabsTrigger value="community" className="flex items-center space-x-2 data-[state=active]:bg-primary/20">
                      <Users className="w-4 h-4" />
                      <span className="hidden sm:inline">Community</span>
                      <span className="sm:hidden">Community</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
              
              {/* Search and filter controls */}
              <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search creations..."
                    className="pl-10 bg-background/60 backdrop-blur-sm border-border/30 focus:border-primary/50 w-full xs:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select onValueChange={setAgeFilter}>
                  <SelectTrigger className="w-full xs:w-[160px] bg-background/60 backdrop-blur-sm border-border/30 focus:border-primary/50">
                    <SelectValue placeholder="Filter by age" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-sm border-border/30">
                    <SelectItem value="elementary">Elementary</SelectItem>
                    <SelectItem value="middle-school">Middle School</SelectItem>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${JSON.stringify(filteredCreations)}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <TabsContent value="library" className="mt-0">
                <UserCreations filteredCreations={filteredCreations} self={true} setSuccess={setSuccess} success={success} tokens={tokens}/>
              </TabsContent>
              <TabsContent value="community" className="mt-0">
                <UserCreations filteredCreations={filteredCreations} self={false} setSuccess={setSuccess} success={success} tokens={tokens}/>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </section>
  )
}

