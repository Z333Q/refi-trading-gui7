import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Award,
  ArrowRight,
  FileText,
  HelpCircle
} from 'lucide-react'
import type { EducationModule, QuizAttempt } from '@/types/gamification'

interface EducationModuleProps {
  module: EducationModule
  userProgress?: {
    lessonsCompleted: number
    quizAttempts: QuizAttempt[]
    certificateEarned: boolean
  }
  onStartLesson: (lessonId: string) => void
  onStartQuiz: (quizId: string) => void
}

export function EducationModuleComponent({ 
  module, 
  userProgress,
  onStartLesson,
  onStartQuiz
}: EducationModuleProps) {
  const [selectedTab, setSelectedTab] = useState<'lessons' | 'quizzes'>('lessons')
  
  const completionPercentage = userProgress ? 
    ((userProgress.lessonsCompleted / module.lessons.length) * 100) : 0
  
  const bestQuizScore = userProgress?.quizAttempts.length ? 
    Math.max(...userProgress.quizAttempts.map(a => a.scorePct)) : 0
  
  const hasPassedQuiz = userProgress?.quizAttempts.some(a => a.passed) || false

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-6 w-6 text-blue-500" />
            <div>
              <CardTitle>{module.title}</CardTitle>
              <p className="text-sm text-gray-400 mt-1">{module.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {module.estimatedMinutes && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{module.estimatedMinutes}m</span>
              </Badge>
            )}
            {userProgress?.certificateEarned && (
              <Badge variant="success" className="flex items-center space-x-1">
                <Award className="h-3 w-3" />
                <span>Certified</span>
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Overview */}
        {userProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{userProgress.lessonsCompleted} / {module.lessons.length} lessons</span>
            </div>
            <Progress value={completionPercentage} />
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
          <Button
            variant={selectedTab === 'lessons' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setSelectedTab('lessons')}
            className="flex-1"
          >
            <FileText className="h-4 w-4 mr-2" />
            Lessons ({module.lessons.length})
          </Button>
          <Button
            variant={selectedTab === 'quizzes' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setSelectedTab('quizzes')}
            className="flex-1"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Quizzes ({module.quizzes.length})
          </Button>
        </div>

        {/* Lessons Tab */}
        {selectedTab === 'lessons' && (
          <div className="space-y-3">
            {module.lessons.map((lesson, index) => {
              const isCompleted = userProgress ? 
                index < userProgress.lessonsCompleted : false
              
              return (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800">
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{lesson.title}</h4>
                      {lesson.mediaUrl && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Play className="h-3 w-3" />
                          <span>Video content</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onStartLesson(lesson.id)}
                  >
                    {isCompleted ? 'Review' : 'Start'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}

        {/* Quizzes Tab */}
        {selectedTab === 'quizzes' && (
          <div className="space-y-3">
            {module.quizzes.map((quiz) => {
              const attempts = userProgress?.quizAttempts.filter(a => a.quizId === quiz.id) || []
              const bestScore = attempts.length ? Math.max(...attempts.map(a => a.scorePct)) : 0
              const hasPassed = attempts.some(a => a.passed)
              
              return (
                <div
                  key={quiz.id}
                  className="p-4 rounded-lg border border-gray-800"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <HelpCircle className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium">Module Quiz</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{quiz.questions.length} questions</span>
                          {quiz.timeLimitSec && (
                            <span>{Math.floor(quiz.timeLimitSec / 60)} minutes</span>
                          )}
                          <span>Pass: {module.passingScore}%</span>
                        </div>
                      </div>
                    </div>
                    {hasPassed && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  
                  {attempts.length > 0 && (
                    <div className="mb-3 p-2 rounded bg-gray-900">
                      <div className="flex justify-between text-sm">
                        <span>Best Score: {bestScore}%</span>
                        <span>Attempts: {attempts.length}</span>
                      </div>
                    </div>
                  )}
                  
                  <Button
                    onClick={() => onStartQuiz(quiz.id)}
                    className="w-full"
                    variant={hasPassed ? "outline" : "default"}
                  >
                    {attempts.length === 0 ? 'Start Quiz' : 
                     hasPassed ? 'Retake Quiz' : 'Try Again'}
                  </Button>
                </div>
              )
            })}
          </div>
        )}

        {/* Certificate Section */}
        {hasPassedQuiz && completionPercentage === 100 && (
          <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-950/20 to-orange-950/20 border border-yellow-800">
            <div className="flex items-center space-x-3">
              <Award className="h-6 w-6 text-yellow-500" />
              <div>
                <h4 className="font-medium text-yellow-400">Certificate Available</h4>
                <p className="text-sm text-yellow-300">
                  You've completed all requirements for this module
                </p>
              </div>
            </div>
            <Button className="w-full mt-3 bg-yellow-600 hover:bg-yellow-700">
              <Award className="h-4 w-4 mr-2" />
              Claim Certificate
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}