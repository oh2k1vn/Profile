import { useFieldContext } from '@/hooks/form-context'
import { ToggleGroup } from '../ui/toggle-group'
import BaseForm, { type BaseFormProps } from './BaseForm'

type Props = BaseFormProps & React.ComponentProps<typeof ToggleGroup>

export default function ToggleGroupForm({ children, ...props }: Props) {
  const form = useFieldContext<string | string[]>()
  const isInvalid = form.state.meta.isTouched && !form.state.meta.isValid

  return (
    <BaseForm {...props}>
      <ToggleGroup
        value={form.state.value as any}
        onValueChange={form.handleChange}
        onBlur={form.handleBlur}
        aria-invalid={isInvalid}
        {...props}
      >
        {children}
      </ToggleGroup>
    </BaseForm>
  )
}
