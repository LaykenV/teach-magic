/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Home, ChevronLeft, ChevronRight, Check, X } from 'lucide-react'
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-primary/5 flex flex-col items-center justify-center p-4">
      <Link href="/dashboard" prefetch={true} className="absolute top-4 left-4 z-10">
        <Button variant="outline" size="icon" className="rounded-full shadow-md hover:shadow-lg transition-shadow">
          <Home className="h-4 w-4" />
          <span className="sr-only">Home</span>
        </Button>
      </Link>
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="bg-primary/5 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center text-primary">
            {isSubmitted ? 'Quiz Results' : `Question ${currentQuestionIndex + 1} of ${creation.quiz.length}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isSubmitted ? (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-2">
                  {calculateScore()} / {creation.quiz.length}
                </p>
                <p className="text-lg text-muted-foreground">
                  You scored {Math.round((calculateScore() / creation.quiz.length) * 100)}%
                </p>
              </div>
              <Progress value={(calculateScore() / creation.quiz.length) * 100} className="w-full h-3" />
              <ul className="space-y-6 mt-8">
                {creation.quiz.map((question, index) => {
                  const userAnswerIndex = userAnswers[index]
                  const isCorrect =
                    userAnswerIndex !== undefined && question.answer_choices[userAnswerIndex].correct
                  return (
                    <li key={index} className="bg-card rounded-lg p-4 shadow-md">
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
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-primary">{creation.quiz[currentQuestionIndex].question}</h3>
              <RadioGroup
                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                value={userAnswers[currentQuestionIndex]?.toString() || ''}
                className="space-y-3"
              >
                {creation.quiz[currentQuestionIndex].answer_choices.map((choice, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-card hover:bg-primary/5 transition-colors">
                    <RadioGroupItem value={index.toString()} id={`answer-${index}`} />
                    <Label htmlFor={`answer-${index}`} className="flex-grow cursor-pointer">{choice.answer_text}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </CardContent>
        {!isSubmitted && (
          <CardFooter className="flex justify-between p-6 bg-primary/5 rounded-b-lg">
            <Button onClick={handleBack} disabled={currentQuestionIndex === 0} variant="outline" className="rounded-full">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={userAnswers[currentQuestionIndex] === undefined}
              className="rounded-full"
            >
              {currentQuestionIndex === creation.quiz.length - 1 ? 'Submit Quiz' : 'Next'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}