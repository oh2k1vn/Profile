import { useFieldContext } from '@/hooks/form-context'
import { Checkbox } from '../ui/checkbox'
import BaseForm, { type BaseFormProps } from './BaseForm'

type Props = BaseFormProps & React.ComponentProps<typeof Checkbox>

export default function CheckboxForm({ ...props }: Props) {
  const form = useFieldContext<boolean>()

  const isInvalid = form.state.meta.isTouched && !form.state.meta.isValid

  return (
    <BaseForm {...props}>
      <Checkbox
        checked={form.state.value}
        onCheckedChange={(checked) => form.handleChange(!!checked)}
        onBlur={form.handleBlur}
        aria-invalid={isInvalid}
        {...props}
      />{' '}
    </BaseForm>
  )
}
