"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Music,
  Utensils,
  Palette,
  Users,
  DollarSign,
  MapPin,
  Check,
} from "lucide-react"

interface QuizQuestion {
  id: string
  title: string
  subtitle?: string
  type: "single" | "multiple" | "slider" | "budget"
  icon: React.ReactNode
  options?: string[]
  min?: number
  max?: number
  step?: number
  unit?: string
}

interface EventPreferences {
  eventStyle: string[]
  budget: number
  guestCount: number
  cateringStyle: string[]
  decorationStyle: string[]
  musicPreferences: string[]
  activityPreferences: string[]
  venueType: string[]
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "eventStyle",
    title: "What's your event vibe?",
    subtitle: "Choose the styles that resonate with your vision",
    type: "multiple",
    icon: <Sparkles className="w-6 h-6" />,
    options: [
      "Elegant & Formal",
      "Casual & Fun",
      "Modern & Minimalist",
      "Rustic & Cozy",
      "Bold & Dramatic",
      "Vintage & Classic",
      "Bohemian & Artistic",
      "Industrial & Urban",
    ],
  },
  {
    id: "budget",
    title: "What's your venue budget?",
    subtitle: "This helps us recommend venues in your price range",
    type: "budget",
    icon: <DollarSign className="w-6 h-6" />,
    min: 500,
    max: 25000,
    step: 500,
    unit: "$",
  },
  {
    id: "guestCount",
    title: "How many guests are you expecting?",
    subtitle: "We'll find venues that can accommodate your group",
    type: "slider",
    icon: <Users className="w-6 h-6" />,
    min: 10,
    max: 500,
    step: 10,
  },
  {
    id: "cateringStyle",
    title: "Food & beverage preferences?",
    subtitle: "Select all that appeal to you",
    type: "multiple",
    icon: <Utensils className="w-6 h-6" />,
    options: [
      "Cocktail Reception",
      "Buffet Style",
      "Plated Dinner",
      "Food Stations",
      "Food Trucks",
      "Wine & Cheese",
      "Dessert Bar",
      "Coffee & Pastries",
    ],
  },
  {
    id: "decorationStyle",
    title: "What decoration style speaks to you?",
    subtitle: "Choose your aesthetic preferences",
    type: "multiple",
    icon: <Palette className="w-6 h-6" />,
    options: [
      "Floral & Natural",
      "Lights & Candles",
      "Modern & Clean",
      "Colorful & Vibrant",
      "Monochrome & Elegant",
      "Themed Decorations",
      "Minimal & Simple",
      "Luxurious & Opulent",
    ],
  },
  {
    id: "musicPreferences",
    title: "What kind of music fits your event?",
    subtitle: "Select your preferred musical atmosphere",
    type: "multiple",
    icon: <Music className="w-6 h-6" />,
    options: [
      "Live Band",
      "DJ & Dancing",
      "Acoustic & Intimate",
      "Classical & Elegant",
      "Jazz & Lounge",
      "Background Music",
      "No Music",
      "Interactive Entertainment",
    ],
  },
  {
    id: "venueType",
    title: "What type of venue do you envision?",
    subtitle: "Choose your ideal venue characteristics",
    type: "multiple",
    icon: <MapPin className="w-6 h-6" />,
    options: [
      "Historic & Charming",
      "Modern & Sleek",
      "Outdoor & Natural",
      "Intimate & Cozy",
      "Grand & Spacious",
      "Unique & Unconventional",
      "Waterfront Views",
      "City Skyline",
    ],
  },
]

interface EventPreferenceQuizProps {
  onComplete: (preferences: EventPreferences) => void
  onSkip?: () => void
}

export function EventPreferenceQuiz({ onComplete, onSkip }: EventPreferenceQuizProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<EventPreferences>>({
    eventStyle: [],
    cateringStyle: [],
    decorationStyle: [],
    musicPreferences: [],
    activityPreferences: [],
    venueType: [],
    budget: 5000,
    guestCount: 50,
  })
  const [isCompleting, setIsCompleting] = useState(false)

  const currentQuestion = quizQuestions[currentStep]
  const progress = ((currentStep + 1) / quizQuestions.length) * 100

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleMultipleChoice = (questionId: string, option: string) => {
    const currentAnswers = (answers[questionId as keyof EventPreferences] as string[]) || []
    const newAnswers = currentAnswers.includes(option)
      ? currentAnswers.filter((item) => item !== option)
      : [...currentAnswers, option]

    handleAnswer(questionId, newAnswers)
  }

  const handleNext = () => {
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleComplete = async () => {
    setIsCompleting(true)

    // Simulate saving preferences
    setTimeout(() => {
      onComplete(answers as EventPreferences)
      setIsCompleting(false)
    }, 1500)
  }

  const isAnswered = () => {
    const answer = answers[currentQuestion.id as keyof EventPreferences]
    if (currentQuestion.type === "multiple") {
      return Array.isArray(answer) && answer.length > 0
    }
    return answer !== undefined && answer !== null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4 lg:p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-blue-200/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-200/20 to-pink-200/20 rounded-full blur-3xl animate-float-reverse" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            <h1 className="text-3xl font-bold text-black mb-2">Event Preference Quiz</h1>
            <p className="text-gray-600">Help us understand your perfect event vision</p>
          </motion.div>

          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>
                Question {currentStep + 1} of {quizQuestions.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2 bg-white/50" />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-card border-white/20 shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white">
                    {currentQuestion.icon}
                  </div>
                </div>
                <CardTitle className="text-xl text-black">{currentQuestion.title}</CardTitle>
                {currentQuestion.subtitle && <p className="text-gray-600 text-sm">{currentQuestion.subtitle}</p>}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Multiple Choice */}
                {currentQuestion.type === "multiple" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentQuestion.options?.map((option, index) => {
                      const isSelected = (answers[currentQuestion.id as keyof EventPreferences] as string[])?.includes(
                        option,
                      )
                      return (
                        <motion.div
                          key={option}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Button
                            variant={isSelected ? "default" : "outline"}
                            className={`w-full p-4 h-auto text-left justify-start transition-all duration-200 ${
                              isSelected
                                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105"
                                : "bg-white/50 border-white/30 text-black hover:bg-white/70 hover:scale-102"
                            }`}
                            onClick={() => handleMultipleChoice(currentQuestion.id, option)}
                          >
                            <div className="flex items-center gap-3">
                              {isSelected && <Check className="w-4 h-4" />}
                              <span className="text-sm font-medium">{option}</span>
                            </div>
                          </Button>
                        </motion.div>
                      )
                    })}
                  </div>
                )}

                {/* Slider */}
                {(currentQuestion.type === "slider" || currentQuestion.type === "budget") && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-black mb-2">
                        {currentQuestion.unit}
                        {(answers[currentQuestion.id as keyof EventPreferences] as number)?.toLocaleString()}
                        {currentQuestion.type === "slider" && " guests"}
                      </div>
                      <div className="flex items-center justify-center gap-4">
                        <span className="text-sm text-gray-600">
                          {currentQuestion.unit}
                          {currentQuestion.min?.toLocaleString()}
                        </span>
                        <div className="flex-1 max-w-md">
                          <input
                            type="range"
                            min={currentQuestion.min}
                            max={currentQuestion.max}
                            step={currentQuestion.step}
                            value={
                              (answers[currentQuestion.id as keyof EventPreferences] as number) || currentQuestion.min
                            }
                            onChange={(e) => handleAnswer(currentQuestion.id, Number.parseInt(e.target.value))}
                            className="w-full h-2 bg-white/50 rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {currentQuestion.unit}
                          {currentQuestion.max?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {currentQuestion.type === "budget" && (
                      <div className="grid grid-cols-3 gap-2">
                        {[2500, 5000, 10000].map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            onClick={() => handleAnswer(currentQuestion.id, amount)}
                            className="bg-white/50 border-white/30 text-black hover:bg-white/70"
                          >
                            ${amount.toLocaleString()}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="bg-white/50 border-white/30 text-black hover:bg-white/70 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {onSkip && (
              <Button variant="ghost" onClick={onSkip} className="text-gray-600 hover:text-black hover:bg-white/50">
                Skip Quiz
              </Button>
            )}

            <Button
              onClick={handleNext}
              disabled={!isAnswered() || isCompleting}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white disabled:opacity-50"
            >
              {isCompleting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-4 h-4 mr-2"
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                  Saving...
                </>
              ) : currentStep === quizQuestions.length - 1 ? (
                <>
                  Complete Quiz
                  <Sparkles className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Selected Answers Preview */}
        {currentQuestion.type === "multiple" && (
          <div className="mt-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {(answers[currentQuestion.id as keyof EventPreferences] as string[])?.map((answer) => (
                <Badge key={answer} className="bg-purple-100 text-purple-700 border-purple-200">
                  {answer}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #3b82f6);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #3b82f6);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-180deg); }
        }
        
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 10s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
