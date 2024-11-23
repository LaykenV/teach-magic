'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Gem, CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

const PricingComponent = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const pricingOptions = [
    { name: 'Single Gem', price: '$1', gems: 1, popular: false },
    { name: '15 Gems Pack', price: '$10', gems: 15, popular: true },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <Link href="/dashboard" prefetch={true} className="absolute top-4 left-4 z-10">
        <Button variant="outline" size="icon" className="rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
          <Home className="h-5 w-5" />
          <span className="sr-only">Home</span>
        </Button>
      </Link>
      <h1 className="text-4xl font-bold text-center mb-8 text-purple-800">Choose Your Gem Pack</h1>
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        {pricingOptions.map((option, index) => (
          <motion.div
            key={option.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            onHoverStart={() => setHoveredCard(index)}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <Card className={`relative overflow-hidden ${option.popular ? 'border-purple-500 border-2' : ''}`}>
              {option.popular && (
                <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-sm font-semibold rounded-bl-lg">
                  Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center text-purple-800">{option.name}</CardTitle>
                <CardDescription className="text-center text-purple-600">
                  {option.gems} {option.gems === 1 ? 'Gem' : 'Gems'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="text-5xl font-bold text-purple-800 mb-4">{option.price}</div>
                <motion.div
                  animate={{ 
                    rotate: hoveredCard === index ? [0, 15, -15, 0] : 0,
                    scale: hoveredCard === index ? 1.2 : 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <Gem size={64} className="text-purple-500" />
                </motion.div>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-purple-700">
                    <CheckCircle size={20} className="mr-2 text-green-500" />
                    Instant delivery
                  </li>
                  <li className="flex items-center text-purple-700">
                    <CheckCircle size={20} className="mr-2 text-green-500" />
                    Use for any creation
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Buy Now
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      <Link href="/dashboard" prefetch passHref>
        <Button variant="outline" className="mt-8">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  )
}

export default PricingComponent

