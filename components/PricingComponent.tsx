'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Gem, CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { MyDock } from '@/components/MyDock'
import { Header } from '@/components/Header'
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
    { name: 'Single Gem', price: '$1', gems: 1, popular: false },
    { name: '15 Gems Pack', price: '$10', gems: 15, popular: true },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">Choose Your Gem Pack</h1>
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
          {pricingOptions.map((option, index) => (
            <motion.div
              key={option.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <Card className={`relative overflow-hidden ${option.popular ? 'border-primary border-2' : ''}`}>
                {option.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-sm font-semibold rounded-bl-lg">
                    Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-center">{option.name}</CardTitle>
                  <CardDescription className="text-center">
                    {option.gems} {option.gems === 1 ? 'Gem' : 'Gems'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="text-5xl font-bold mb-4">{option.price}</div>
                  <motion.div
                    animate={{ 
                      rotate: hoveredCard === index ? [0, 15, -15, 0] : 0,
                      scale: hoveredCard === index ? 1.2 : 1
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <Gem size={64} className="text-primary" />
                  </motion.div>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center text-muted-foreground">
                      <CheckCircle size={20} className="mr-2 text-green-500" />
                      Instant delivery
                    </li>
                    <li className="flex items-center text-muted-foreground">
                      <CheckCircle size={20} className="mr-2 text-green-500" />
                      Use for any creation
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full text-white" onClick={() => handleCheckout(option.gems)}>
                    Buy Now
                    <ArrowRight size={20} className="ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
      <MyDock dashboard={false} />
    </div>
  )
}

