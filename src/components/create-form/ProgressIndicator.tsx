import { ScaleIn } from '@/components/ui/motion'

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <ScaleIn delay={0.1}>
      <div className="mb-12">
        <div className="flex justify-between mb-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index + 1 === currentStep 
                  ? 'bg-[var(--kiwi-dark)] text-white' 
                  : index + 1 < currentStep 
                    ? 'bg-[var(--kiwi-medium)] text-white' 
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {index + 1}
              </div>
              <span className="text-sm mt-1">
                {index === 0 ? 'Personnalisation' : index === 1 ? 'Gommettes' : 'Prévisualisation'}
              </span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full w-full mt-2">
          <div 
            className="h-full bg-[var(--kiwi-medium)] rounded-full" 
            style={{ width: `${(currentStep - 1) / (totalSteps - 1) * 100}%` }}
          ></div>
        </div>
      </div>
    </ScaleIn>
  )
}

export default ProgressIndicator