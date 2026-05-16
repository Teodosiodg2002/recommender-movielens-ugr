import { CheckCircle, Circle, ChevronRight } from 'lucide-react'
import { RecommendationAlgorithm, Step } from '../types/movie'

interface StepperProps {
  currentStep: Step
  labels: Record<Step, string>
}

export function Stepper({ currentStep, labels }: StepperProps) {
  const steps: Step[] = ['vote', 'results']

  return (
    <nav className="flex items-center gap-3 rounded-3xl border border-indigo-700/25 bg-slate-900/80 p-4 text-slate-300 shadow-lg">
      {steps.map((step, index) => {
        const isActive = currentStep === step
        const isCompleted = steps.indexOf(currentStep) > index

        return (
          <div key={step} className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition ${
                  isActive
                    ? 'border-indigo-400 bg-indigo-600 text-white shadow-xl'
                    : isCompleted
                    ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-200'
                    : 'border-slate-700 bg-slate-950 text-slate-500'
                }`}
              >
                {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Paso {index + 1}</p>
                <p className={`text-sm font-semibold ${isActive ? 'text-slate-100' : 'text-slate-300'}`}>
                  {labels[step]}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && <ChevronRight className="h-5 w-5 text-slate-500" />}
          </div>
        )
      })}
    </nav>
  )
}
