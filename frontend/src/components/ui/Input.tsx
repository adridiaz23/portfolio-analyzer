// Reusable Input component — consistent styling across all forms in the app
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {/* Label */}
      {label && (
        <label className="text-xs font-medium text-zinc-400">
          {label}
          {props.required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}

      {/* Input field */}
      <input
        className={cn(
          'w-full bg-zinc-800 border rounded-lg px-3 py-2 text-sm text-zinc-100 transition-colors',
          'placeholder-zinc-600 outline-none',
          // Focus ring — green when valid, red when error
          error
            ? 'border-red-500/50 focus:border-red-500'
            : 'border-zinc-700 focus:border-emerald-500',
          // Disable spinner arrows on number inputs
          '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          className
        )}
        {...props}
      />

      {/* Error message */}
      {error && (
        <span className="text-xs text-red-400">{error}</span>
      )}

      {/* Helper hint */}
      {hint && !error && (
        <span className="text-xs text-zinc-600">{hint}</span>
      )}
    </div>
  )
}