import { useFieldContext } from '@/hooks/form-context'
import { RadioGroup } from '../ui/radio-group'
import BaseForm, { type BaseFormProps } from './BaseForm'

type Props = BaseFormProps & React.ComponentProps<typeof RadioGroup>

export default function RadioGroupForm({ children, ...props }: Props) {
  const form = useFieldContext<string>()

  const isInvalid = form.state.meta.isTouched && !form.state.meta.isValid

  return (
    <BaseForm {...props}>
      <RadioGroup
        value={form.state.value}
        onValueChange={form.handleChange}
        onBlur={form.handleBlur}
        aria-invalid={isInvalid}
        {...props}
      >
        {children}
      </RadioGroup>
    </BaseForm>
  )
}
