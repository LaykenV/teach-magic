'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Gem, CheckCircle, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { MyDock } from '@/components/MyDock'
import { Footer } from '@/components/Footer'
import { loadStripe } from "@stripe/stripe-js"
import { useToast } from '@/hooks/use-toast'

interface PricingComponentProps {
  paid: boolean | null;
}

export default function PricingComponent({ paid }: PricingComponentProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const { toast } = useToast();

  useEffect(() => {
    if (paid === false) {
      toast({
        title: "Error",
        description: "Failed to process payment.",
        variant: "destructive",
      });
    } else if (paid) {
      toast({
        title: "Success",
        description: "Payment Processed Successfully.",
        variant: "default",
      });
    }
  }, [paid, toast]);

  const handleCheckout = async (amt: number) => {
    console.log('Initiating checkout...', amt);
    try {
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      const response = await fetch("/api/checkoutSession", { method: "POST", body: JSON.stringify({amt}) });
      const { sessionId } = await response.json();

      if (stripe && sessionId) {
        const result = await stripe.redirectToCheckout({ sessionId });
        if (result.error) {
          console.error('Stripe checkout error:', result.error);
          toast({
            title: "Error",
            description: "Failed to initiate checkout. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  }

  const pricingOptions = [
    { 
      name: 'Single Gem', 
      price: '$1', 
      gems: 1, 
      popular: false,
      description: 'Perfect for trying out TeachMagic',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50'
    },
    { 
      name: '15 Gems Pack', 
      price: '$10', 
      gems: 15, 
      popular: true,
      description: 'Best value for regular creators',
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50'
    },
  ]

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Enhanced glass-morphism background matching FAQ component */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-background backdrop-blur-sm -z-10" />
      <div className="fixed inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-blue-950/20 dark:via-purple-950/15 dark:to-pink-950/20 -z-10" />
      
      {/* Subtle floating gradient orbs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/15 to-purple-400/15 dark:from-cyan-500/8 dark:to-purple-500/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/15 to-pink-400/15 dark:from-purple-500/8 dark:to-pink-500/8 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-400/15 to-cyan-400/15 dark:from-pink-500/8 dark:to-cyan-500/8 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className='relative h-[10px] bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500'></div>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12 relative z-10">
        {/* Enhanced header section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="inline-flex items-center space-x-2 bg-background/70 backdrop-blur-lg border border-border/40 rounded-full px-4 py-2 shadow-lg mb-4">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-muted-foreground">Unlock Creative Potential</span>
              <Sparkles className="h-4 w-4 text-purple-500" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent leading-tight">
              Choose Your Gem Pack
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Power your creativity with TeachMagic gems. Create stunning educational content that captivates and inspires.
            </p>
          </motion.div>
        </div>

        {/* Enhanced pricing cards */}
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 w-full max-w-4xl mx-auto">
          {pricingOptions.map((option, index) => (
            <motion.div
              key={option.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative group"
            >
              {/* Enhanced gradient background */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${option.gradient} rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-500 -z-10`} />
              
              <Card className={`relative overflow-hidden bg-background/70 backdrop-blur-lg border border-border/40 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 ${
                option.popular 
                  ? 'ring-2 ring-purple-500/30 dark:ring-purple-400/30' 
                  : ''
              }`}>
                {/* Popular badge */}
                {option.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm font-semibold rounded-bl-2xl rounded-tr-2xl shadow-lg z-20">
                    <div className="flex items-center space-x-1">
                      <Sparkles className="h-3 w-3" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                {/* Card background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${option.bgGradient} opacity-30 -z-10`} />
                
                <CardHeader className="relative z-10 text-center pb-4">
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    {option.name}
                  </CardTitle>
                  <CardDescription className="text-base sm:text-lg text-muted-foreground">
                    {option.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10 flex flex-col items-center space-y-6 pb-6">
                  {/* Price display */}
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-2">
                      {option.price}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {option.gems} {option.gems === 1 ? 'Gem' : 'Gems'}
                    </p>
                  </div>

                  {/* Fixed gem icon with proper layering */}
                  <motion.div
                    animate={{ 
                      rotate: hoveredCard === index ? [0, 15, -15, 0] : 0,
                      scale: hoveredCard === index ? 1.3 : 1.1,
                      y: hoveredCard === index ? -5 : 0
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="relative z-20"
                  >
                    {/* Background glow effect - positioned behind the gem */}
                    <div className={`absolute inset-0 w-20 h-20 bg-gradient-to-r ${option.gradient} rounded-full blur-xl opacity-40 -z-10`} />
                    {/* Gem icon - positioned in front */}
                    <Gem size={72} className={`relative z-10 drop-shadow-lg`} style={{
                      background: `linear-gradient(to right, ${option.gradient.includes('blue') ? '#3b82f6, #4f46e5' : '#a855f7, #ec4899'})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }} />
                  </motion.div>

                  {/* Features list */}
                  <ul className="space-y-3 w-full max-w-xs">
                    <li className="flex items-center text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <CheckCircle size={20} className="mr-3 text-green-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base">Instant delivery</span>
                    </li>
                    <li className="flex items-center text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <CheckCircle size={20} className="mr-3 text-green-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base">Use for any creation</span>
                    </li>
                    <li className="flex items-center text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <CheckCircle size={20} className="mr-3 text-green-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base">No expiration date</span>
                    </li>
                  </ul>
                </CardContent>

                <CardFooter className="relative z-10 pt-2">
                  <Button 
                    className={`w-full text-white font-semibold py-3 sm:py-4 text-base sm:text-lg bg-gradient-to-r ${option.gradient} hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-0`}
                    onClick={() => handleCheckout(option.gems)}
                  >
                    <span>Buy Now</span>
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Enhanced trust indicators */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-12 sm:mt-16 lg:mt-20"
        >
          <div className="inline-flex items-center space-x-4 bg-background/70 backdrop-blur-lg border border-border/40 rounded-full px-6 py-3 shadow-lg">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Secure Payment</span>
            </div>
            <div className="w-px h-4 bg-border/60" />
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span>Instant Access</span>
            </div>
            <div className="w-px h-4 bg-border/60" />
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Gem className="h-4 w-4 text-blue-500" />
              <span>Premium Quality</span>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
      <MyDock dashboard={false} />
    </div>
  )
}

