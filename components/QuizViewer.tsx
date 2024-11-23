/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Home, ChevronLeft, ChevronRight, Check, X, Award, RefreshCw } from 'lucide-react'
import { Creation } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'

interface QuizViewerProps {
  creation: Creation
}

export default function QuizViewer({ creation }: QuizViewerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (isSubmitted) {
      setScore(calculateScore())
    }
  }, [isSubmitted])

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

  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setUserAnswers({})
    setIsSubmitted(false)
    setScore(0)
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-y-auto bg-gradient-to-b from-primary/10 to-primary/5">
      <Link href="/dashboard" prefetch={true} className="absolute top-4 left-4 z-10">
        <Button variant="outline" size="icon" className="rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
          <Home className="h-5 w-5" />
          <span className="sr-only">Home</span>
        </Button>
      </Link>
      <AnimatePresence mode="wait">
        <motion.div
          key={isSubmitted ? 'results' : currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl mx-auto"
        >
          <Card className="w-full max-w-2xl mx-auto shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-primary/5 rounded-t-lg">
              <CardTitle className="text-xl sm:text-2xl font-bold text-center text-primary">
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
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 mb-4">
                      <Award className="h-16 w-16 text-primary" />
                    </div>
                    <p className="text-3xl sm:text-4xl font-bold text-primary mb-2">
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
                          className="bg-card rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`mt-1 p-1 rounded-full ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                              {isCorrect ? (
                                <Check className="h-5 w-5 text-green-600" />
                              ) : (
                                <X className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-lg mb-2">{question.question}</p>
                              <p className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                Your answer: {question.answer_choices[userAnswerIndex]?.answer_text || 'No answer selected'}
                              </p>
                              {!isCorrect && (
                                <p className="text-sm text-green-600 mt-1">
                                  Correct answer: {question.answer_choices.find((choice: any) => choice.correct)?.answer_text}
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
                  <h3 className="text-xl font-semibold text-primary">{creation.quiz[currentQuestionIndex].question}</h3>
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
                            className="flex items-center space-x-3 p-4 rounded-lg bg-card hover:bg-primary/5 transition-colors cursor-pointer"
                          >
                            <RadioGroupItem
                              value={index.toString()}
                              id={`answer-${index}`}
                              className="peer sr-only"
                            />
                            <div className="relative w-4 h-4 border-2 border-primary rounded-full flex items-center justify-center">
                              <motion.div
                                initial={false}
                                animate={{
                                  scale: userAnswers[currentQuestionIndex] === index ? 1 : 0,
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="absolute w-2 h-2 bg-primary rounded-full"
                              />
                            </div>
                            <Label
                              htmlFor={`answer-${index}`}
                              className="flex-grow cursor-pointer font-medium peer-checked:text-primary transition-colors duration-200 ease-in-out"
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
            <CardFooter className="flex flex-col sm:flex-row justify-between p-4 sm:p-6 bg-primary/5 rounded-b-lg gap-4">
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
                    className="w-full sm:w-auto rounded-full transition-all duration-200 hover:bg-primary/10"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={userAnswers[currentQuestionIndex] === undefined}
                    className="w-full sm:w-auto rounded-full transition-all duration-200 hover:bg-primary-dark"
                  >
                    {currentQuestionIndex === creation.quiz.length - 1 ? 'Submit Quiz' : 'Next'}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

