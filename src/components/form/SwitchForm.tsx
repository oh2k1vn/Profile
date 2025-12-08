import { useFieldContext } from '@/hooks/form-context'
import { Switch } from '../ui/switch'
import BaseForm, { type BaseFormProps } from './BaseForm'

type Props = BaseFormProps & React.ComponentProps<typeof Switch>

export default function SwitchForm({ ...props }: Props) {
  const form = useFieldContext<boolean>()
  const isInvalid = form.state.meta.isTouched && !form.state.meta.isValid

  return (
    <BaseForm {...props}>
      <Switch
        checked={form.state.value}
        onCheckedChange={form.handleChange}
        onBlur={form.handleBlur}
        aria-invalid={isInvalid}
        {...props}
      />
    </BaseForm>
  )
}
