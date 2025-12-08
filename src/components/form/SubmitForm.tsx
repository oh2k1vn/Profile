import { useFormContext } from '@/hooks/form-context'
import { Button, type ButtonProps } from '../ui/button'

type Props = ButtonProps & {
  submitAction?: 'submit' | 'submit-close'
}

export default function SubmitForm({
  children,
  submitAction = 'submit',
  ...props
}: Props) {
  const form = useFormContext()
  return (
    <form.Subscribe
      selector={(state) => ({
        canSubmit: state.canSubmit,
        isSubmitting: state.isSubmitting,
      })}
    >
      {({ canSubmit, isSubmitting }) => (
        <Button
          type="submit"
          variant="default"
          isLoading={isSubmitting}
          disabled={!canSubmit || isSubmitting}
          onClick={() => form.handleSubmit({ submitAction })}
          {...props}
        >
          {children}
        </Button>
      )}
    </form.Subscribe>
  )
}
