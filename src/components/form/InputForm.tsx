import { useFieldContext } from '@/hooks/form-context'
import { Input } from '../ui/input'
import type { BaseFormProps } from './BaseForm'
import BaseForm from './BaseForm'

type Props = BaseFormProps & React.ComponentProps<typeof Input> & {}

export default function InputForm({ ...props }: Props) {
  const form = useFieldContext<string>()

  const isInvalid = form.state.meta.isTouched && !form.state.meta.isValid

  return (
    <BaseForm {...props}>
      <Input
        value={form.state.value}
        onBlur={form.handleBlur}
        onChange={(e) => form.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        {...props}
      />
    </BaseForm>
  )
}
