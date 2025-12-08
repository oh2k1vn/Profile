import { useFieldContext } from '@/hooks/form-context'
import { Select } from '../ui/select'
import BaseForm, { type BaseFormProps } from './BaseForm'

type Props = BaseFormProps & React.ComponentProps<typeof Select>

export default function SelectForm({ children, ...props }: Props) {
  const form = useFieldContext<string>()

  const isInvalid = form.state.meta.isTouched && !form.state.meta.isValid

  return (
    <BaseForm {...props}>
      <Select
        value={form.state.value}
        onValueChange={form.handleChange}
        aria-invalid={isInvalid}
        {...props}
      >
        {children}
      </Select>
    </BaseForm>
  )
}
