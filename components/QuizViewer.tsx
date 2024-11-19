/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Home } from 'lucide-react'
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
    <div className="container mx-auto px-4 py-8">
      <Link href="/dashboard" prefetch={true} className="absolute top-4 left-4 z-10">
        <Button variant="outline" size="icon">
          <Home className="h-4 w-4" />
          <span className="sr-only">Home</span>
        </Button>
      </Link>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {isSubmitted ? 'Quiz Results' : `Question ${currentQuestionIndex + 1} of ${creation.quiz.length}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="space-y-4">
              <p className="text-center text-lg font-semibold">
                You scored {calculateScore()} out of {creation.quiz.length}
              </p>
              <Progress value={(calculateScore() / creation.quiz.length) * 100} className="w-full" />
              <ul className="space-y-4">
                {creation.quiz.map((question, index) => {
                  const userAnswerIndex = userAnswers[index]
                  const isCorrect =
                    userAnswerIndex !== undefined && question.answer_choices[userAnswerIndex].correct
                  return (
                    <li key={index} className="border-b pb-4 last:border-b-0">
                      <p className="font-semibold">
                        {question.question} {isCorrect ? '✅' : '❌'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Your answer:{' '}
                        {question.answer_choices[userAnswerIndex]?.answer_text || 'No answer selected'}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-muted-foreground">
                          Correct answer:{' '}
                          {question.answer_choices.find((choice: any) => choice.correct)?.answer_text}
                        </p>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{creation.quiz[currentQuestionIndex].question}</h3>
              <RadioGroup
                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                value={userAnswers[currentQuestionIndex]?.toString()}
              >
                {creation.quiz[currentQuestionIndex].answer_choices.map((choice, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`answer-${index}`} />
                    <Label htmlFor={`answer-${index}`}>{choice.answer_text}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </CardContent>
        {!isSubmitted && (
          <CardFooter className="flex justify-between">
            <Button onClick={handleBack} disabled={currentQuestionIndex === 0} variant="outline">
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={userAnswers[currentQuestionIndex] === undefined}
            >
              {currentQuestionIndex === creation.quiz.length - 1 ? 'Submit Quiz' : 'Next'}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}