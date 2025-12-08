import { useFieldContext } from '@/hooks/form-context'
import { CircleAlert } from 'lucide-react'
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export type BaseFormProps = {
  children?: React.ReactNode
  description?: string
  label?: string
  required?: boolean
  tooltip?: string
  orientation?: 'vertical' | 'horizontal' | 'responsive' | null | undefined
}

export default function BaseForm({
  children,
  orientation,
  label,
  required,
  tooltip,
  description,
}: BaseFormProps) {
  const form = useFieldContext()

  const isInvalid = form.state.meta.isTouched && !form.state.meta.isValid

  const LabelNode = label && (
    <FieldLabel
      htmlFor={form.name}
      className="flex items-center gap-1 text-sm font-medium"
    >
      {label}
      {required && <span className="text-red-500">*</span>}
      {tooltip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <CircleAlert className="h-4 w-4 cursor-pointer text-gray-400" />
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      )}
    </FieldLabel>
  )

  return (
    <Field orientation={orientation} data-invalid={isInvalid}>
      {LabelNode}
      {children}
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={form.state.meta.errors} />}
    </Field>
  )
}
