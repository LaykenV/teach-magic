/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Home, ChevronLeft, ChevronRight, Check, X, Award, RefreshCw, BookOpen } from 'lucide-react'
import { Creation } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { ModeToggle } from './theme/ThemeToggle'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import confetti from 'canvas-confetti';

interface QuizViewerProps {
  creation: Creation
}

export default function QuizViewer({ creation }: QuizViewerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const calculateScore = () => {
    let score = 0
    creation.quiz.forEach((question, index) => {
      const userAnswerIndex = userAnswers[index]
      if (userAnswerIndex !== undefined && question.answer_choices[userAnswerIndex].correct) {
        score += 1
      }
    })
    return score
  }

  useEffect(() => {
    if (isSubmitted) {
      setScore(calculateScore())
    }
  }, [isSubmitted, calculateScore, setScore])

  const handleAnswerSelect = (answerIndex: number) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestionIndex]: answerIndex,
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < creation.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setIsSubmitted(true)
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setUserAnswers({})
    setIsSubmitted(false)
    setScore(0)
  }

  const shootConfetti = () => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
 
    const frame = () => {
      if (Date.now() > end) return;
 
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });
 
      requestAnimationFrame(frame);
    };
 
    frame();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isSubmitted) return
      
      if (event.key === "ArrowLeft") {
        handleBack()
      } else if (event.key === "ArrowRight") {
        if (userAnswers[currentQuestionIndex] !== undefined) {
          handleNext()
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentQuestionIndex, userAnswers, isSubmitted])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Beautiful Gradient Background */}
      <div className="absolute inset-0 slide-gradient-bg" />

      {/* Animated floating elements - hidden on mobile for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-20 right-20 w-80 h-80 slide-floating-orb-1" />
        <div className="absolute bottom-20 left-20 w-96 h-96 slide-floating-orb-2" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 slide-floating-orb-3" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header with Navigation */}
        <header className="flex-shrink-0 p-4 md:p-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Left: Navigation buttons */}
            <div className="flex items-center gap-2 md:gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/dashboard" prefetch={true}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full glass-effect smooth-hover h-9 px-3 md:h-10 md:px-4"
                      >
                        <Home className="h-4 w-4 md:mr-2" />
                        <span className="hidden sm:inline">Home</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Back to Dashboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/SlideViewer?id=${creation.id}`} prefetch={true}>
                      <Button
                        size="sm"
                        className="rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 smooth-hover shadow-lg h-9 px-3 md:h-10 md:px-4"
                      >
                        <BookOpen className="h-4 w-4 md:mr-2" />
                        <span className="hidden sm:inline">Slides</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Slides</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Right: Theme toggle */}
            <ModeToggle />
          </div>
        </header>

        {/* Main Quiz Content */}
        <div className="flex-1 px-4 md:px-6 pb-6 overflow-hidden">
          <div className="h-full flex items-center justify-center max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={isSubmitted ? 'results' : currentQuestionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full"
              >
                <Card className="w-full shadow-2xl glass-effect border-border/20 overflow-hidden">
                  <CardHeader className="glass-effect border-b border-border/20">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      className="text-center space-y-2"
                    >
                      <CardTitle className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground bg-clip-text">
                        {isSubmitted ? 'Quiz Results' : `Question ${currentQuestionIndex + 1}`}
                      </CardTitle>
                      {!isSubmitted && (
                        <p className="text-sm md:text-base text-muted-foreground">
                          {currentQuestionIndex + 1} of {creation.quiz.length}
                        </p>
                      )}
                    </motion.div>
                    
                    {/* Progress bar for non-mobile and non-submitted state */}
                    {!isSubmitted && !isMobile && (
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mt-4"
                      >
                        <Progress 
                          value={((currentQuestionIndex + 1) / creation.quiz.length) * 100} 
                          className="w-full h-2" 
                        />
                      </motion.div>
                    )}
                  </CardHeader>

                  <CardContent className="p-4 md:p-6 lg:p-8 min-h-[400px] md:min-h-[500px] flex flex-col">
                    {isSubmitted ? (
                      <div className="space-y-6 lg:space-y-8 flex-1">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                          className="text-center"
                        >
                          <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-4 md:mb-6">
                            <Award className="h-12 w-12 md:h-16 md:w-16 text-primary" />
                          </div>
                          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                            {score} / {creation.quiz.length}
                          </p>
                          <p className="text-base md:text-lg text-muted-foreground">
                            You scored {Math.round((score / creation.quiz.length) * 100)}%
                          </p>
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                        >
                          <Progress value={(score / creation.quiz.length) * 100} className="w-full h-3 md:h-4" />
                        </motion.div>

                        <motion.div
                          initial="hidden"
                          animate="visible"
                          variants={{
                            visible: { transition: { staggerChildren: 0.1 } },
                          }}
                          className="space-y-4 md:space-y-6 max-h-[400px] md:max-h-[500px] overflow-y-auto pr-2 scrollbar-hide"
                        >
                          {creation.quiz.map((question, index) => {
                            const userAnswerIndex = userAnswers[index]
                            const isCorrect =
                              userAnswerIndex !== undefined && question.answer_choices[userAnswerIndex].correct
                            return (
                              <motion.div
                                key={index}
                                variants={{
                                  hidden: { opacity: 0, y: 20 },
                                  visible: { opacity: 1, y: 0 },
                                }}
                                className="glass-effect rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow border border-border/20"
                              >
                                <div className="flex items-start space-x-3 md:space-x-4">
                                  <div className={`mt-1 p-2 rounded-full ${isCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                    {isCorrect ? (
                                      <Check className="h-4 w-4 md:h-5 md:w-5 text-green-600 dark:text-green-400" />
                                    ) : (
                                      <X className="h-4 w-4 md:h-5 md:w-5 text-red-600 dark:text-red-400" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-semibold text-base md:text-lg mb-3 text-foreground leading-relaxed">
                                      {question.question}
                                    </p>
                                    <p className={`text-sm md:text-base mb-2 ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                      Your answer: {question.answer_choices[userAnswerIndex]?.answer_text || 'No answer selected'}
                                    </p>
                                    {!isCorrect && (
                                      <p className="text-sm md:text-base text-green-600 dark:text-green-400">
                                        Correct answer: {question.answer_choices.find((choice) => choice.correct)?.answer_text}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )
                          })}
                        </motion.div>
                      </div>
                    ) : (
                      <div className="space-y-6 md:space-y-8 flex-1">
                        <motion.h3
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1, duration: 0.3 }}
                          className="text-lg md:text-xl lg:text-2xl font-semibold text-foreground leading-relaxed"
                        >
                          {creation.quiz[currentQuestionIndex].question}
                        </motion.h3>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.4 }}
                        >
                          <RadioGroup
                            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                            value={userAnswers[currentQuestionIndex]?.toString() || ''}
                            className="space-y-3 md:space-y-4"
                          >
                            <LayoutGroup>
                              {creation.quiz[currentQuestionIndex].answer_choices.map((choice, index) => (
                                <motion.div
                                  key={index}
                                  layout
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                                  className="relative"
                                >
                                  <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center space-x-3 md:space-x-4 p-4 md:p-5 rounded-xl glass-effect hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 cursor-pointer border border-border/20 hover:border-primary/30"
                                  >
                                    <RadioGroupItem
                                      value={index.toString()}
                                      id={`answer-${index}`}
                                      className="peer sr-only"
                                    />
                                    <div className="relative w-5 h-5 border-2 border-primary rounded-full flex items-center justify-center">
                                      <motion.div
                                        initial={false}
                                        animate={{
                                          scale: userAnswers[currentQuestionIndex] === index ? 1 : 0,
                                        }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        className="absolute w-2.5 h-2.5 bg-primary rounded-full"
                                      />
                                    </div>
                                    <Label
                                      htmlFor={`answer-${index}`}
                                      className="flex-grow cursor-pointer font-medium text-sm md:text-base peer-checked:text-primary transition-colors duration-200 ease-in-out leading-relaxed"
                                    >
                                      {choice.answer_text}
                                    </Label>
                                  </motion.div>
                                </motion.div>
                              ))}
                            </LayoutGroup>
                          </RadioGroup>
                        </motion.div>

                        {/* Mobile Progress Bar */}
                        {isMobile && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.3 }}
                            className="mt-6"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-muted-foreground">
                                Question {currentQuestionIndex + 1} of {creation.quiz.length}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {Math.round(((currentQuestionIndex + 1) / creation.quiz.length) * 100)}%
                              </span>
                            </div>
                            <Progress 
                              value={((currentQuestionIndex + 1) / creation.quiz.length) * 100} 
                              className="w-full h-2" 
                            />
                          </motion.div>
                        )}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="glass-effect border-t border-border/20 p-4 md:p-6 lg:p-8">
                    {isSubmitted ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        className="w-full"
                      >
                        <Button 
                          onClick={resetQuiz} 
                          className="w-full rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl h-11 md:h-12 text-base font-medium"
                        >
                          <RefreshCw className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                          Restart Quiz
                        </Button>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col sm:flex-row justify-between w-full gap-3 md:gap-4">
                        <Button
                          onClick={handleBack}
                          disabled={currentQuestionIndex === 0}
                          variant="outline"
                          className="w-full sm:w-auto rounded-full glass-effect hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 h-11 md:h-12 px-6 md:px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                          Back
                        </Button>
                        
                        {currentQuestionIndex === creation.quiz.length - 1 ? (
                          <Button
                            onClick={() => {handleNext(); shootConfetti()}}
                            disabled={userAnswers[currentQuestionIndex] === undefined}
                            className="w-full sm:w-auto rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl h-11 md:h-12 px-6 md:px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Submit Quiz
                            <ChevronRight className="h-4 w-4 md:h-5 md:w-5 ml-2" />
                          </Button>
                        ) : (
                          <Button
                            onClick={handleNext}
                            disabled={userAnswers[currentQuestionIndex] === undefined}
                            className="w-full sm:w-auto rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl h-11 md:h-12 px-6 md:px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                            <ChevronRight className="h-4 w-4 md:h-5 md:w-5 ml-2" />
                          </Button>
                        )}
                      </div>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

