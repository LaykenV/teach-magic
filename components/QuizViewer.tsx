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
import confetti from 'canvas-confetti';


interface QuizViewerProps {
  creation: Creation
}

export default function QuizViewer({ creation }: QuizViewerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)

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

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-y-auto">
      <div className="absolute bottom-4 sm:top-4 left-4 z-10 flex flex-row space-y-0 space-x-4">
        
              <Link href="/dashboard" prefetch={true}>
                <Button variant="outline" size="lg" className="rounded-full bg-background/10 hover:bg-background/90 text-white hover:text-black transition-all duration-300 ease-in-out w-full sm:w-auto">
                  <Home className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
            

        
              <Link href={`/SlideViewer?id=${creation.id}`} prefetch={true}>
                <Button variant="default" size="lg" className="rounded-full hover:bg-primary/90 transition-all duration-300 ease-in-out w-full sm:w-auto">
                  <BookOpen className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">View Slides</span>
                </Button>
              </Link>
            
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={isSubmitted ? 'results' : currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl mx-auto"
        >
          <Card className="w-full max-w-2xl mx-auto shadow-xl bg-card/50 dark:bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-muted/50 dark:bg-muted/20 rounded-t-lg">
              <CardTitle className="text-xl sm:text-2xl font-bold text-center text-foreground">
                {isSubmitted ? 'Quiz Results' : `Question ${currentQuestionIndex + 1} of ${creation.quiz.length}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
              {isSubmitted ? (
                <div className="space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 dark:bg-primary/20 mb-4">
                      <Award className="h-16 w-16 text-primary dark:text-primary" />
                    </div>
                    <p className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                      {score} / {creation.quiz.length}
                    </p>
                    <p className="text-lg text-muted-foreground">
                      You scored {Math.round((score / creation.quiz.length) * 100)}%
                    </p>
                  </motion.div>
                  <Progress value={(score / creation.quiz.length) * 100} className="w-full h-3" />
                  <motion.ul
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.1 } },
                    }}
                    className="space-y-6 mt-8"
                  >
                    {creation.quiz.map((question, index) => {
                      const userAnswerIndex = userAnswers[index]
                      const isCorrect =
                        userAnswerIndex !== undefined && question.answer_choices[userAnswerIndex].correct
                      return (
                        <motion.li
                          key={index}
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 },
                          }}
                          className="bg-card dark:bg-card/80 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`mt-1 p-1 rounded-full ${isCorrect ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                              {isCorrect ? (
                                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                              ) : (
                                <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-lg mb-2 text-foreground">{question.question}</p>
                              <p className={`text-sm ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                Your answer: {question.answer_choices[userAnswerIndex]?.answer_text || 'No answer selected'}
                              </p>
                              {!isCorrect && (
                                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                  Correct answer: {question.answer_choices.find((choice) => choice.correct)?.answer_text}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.li>
                      )
                    })}
                  </motion.ul>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-card-foreground">{creation.quiz[currentQuestionIndex].question}</h3>
                  <RadioGroup
                    onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                    value={userAnswers[currentQuestionIndex]?.toString() || ''}
                    className="space-y-3"
                  >
                    <LayoutGroup>
                      {creation.quiz[currentQuestionIndex].answer_choices.map((choice, index) => (
                        <motion.div
                          key={index}
                          layout
                          className="relative"
                        >
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center space-x-3 p-4 rounded-lg bg-card dark:bg-card/80 hover:bg-primary/5 dark:hover:bg-primary/20 transition-colors cursor-pointer"
                          >
                            <RadioGroupItem
                              value={index.toString()}
                              id={`answer-${index}`}
                              className="peer sr-only"
                            />
                            <div className="relative w-4 h-4 border-2 border-primary dark:border-primary rounded-full flex items-center justify-center">
                              <motion.div
                                initial={false}
                                animate={{
                                  scale: userAnswers[currentQuestionIndex] === index ? 1 : 0,
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="absolute w-2 h-2 bg-primary dark:bg-primary rounded-full"
                              />
                            </div>
                            <Label
                              htmlFor={`answer-${index}`}
                              className="flex-grow cursor-pointer font-medium peer-checked:text-primary dark:peer-checked:text-primary-foreground transition-colors duration-200 ease-in-out"
                            >
                              {choice.answer_text}
                            </Label>
                          </motion.div>
                        </motion.div>
                      ))}
                    </LayoutGroup>
                  </RadioGroup>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between p-4 sm:p-6 bg-muted/50 dark:bg-muted/20 rounded-b-lg gap-4">
              {isSubmitted ? (
                <Button onClick={resetQuiz} className="w-full rounded-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restart Quiz
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleBack}
                    disabled={currentQuestionIndex === 0}
                    variant="outline"
                    className="w-full sm:w-auto rounded-full transition-all duration-200 hover:bg-primary/10 dark:hover:bg-primary/20 bg-background dark:bg-background/80"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  {currentQuestionIndex === creation.quiz.length - 1 ? (
                    <Button
                      onClick={() => {handleNext(); shootConfetti()}}
                      disabled={userAnswers[currentQuestionIndex] === undefined}
                      className="w-full sm:w-auto rounded-full transition-all duration-200 hover:bg-primary-dark"
                    >
                      Submit Quiz
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      disabled={userAnswers[currentQuestionIndex] === undefined}
                      className="w-full sm:w-auto rounded-full transition-all duration-200 hover:bg-primary-dark"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
      <ModeToggle />
    </div>
  )
}

