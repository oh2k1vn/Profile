import { useFieldContext } from '@/hooks/form-context'
import { Textarea } from '../ui/textarea'
import BaseForm, { type BaseFormProps } from './BaseForm'

type Props = BaseFormProps & React.ComponentProps<typeof Textarea>

export default function TextareaForm({ ...props }: Props) {
  const field = useFieldContext<string>()

  return (
    <BaseForm {...props}>
      <Textarea
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
      />
    </BaseForm>
  )
}
