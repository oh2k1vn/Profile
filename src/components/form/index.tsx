import { fieldContext, formContext } from '@/hooks/form-context'
import { createFormHook } from '@tanstack/react-form'
import CheckBoxForm from './CheckBoxForm'
import InputForm from './InputForm'
import RadioGroupForm from './RadioGroupForm'
import SelectForm from './SelectForm'
import SubmitForm from './SubmitForm'
import SwitchForm from './SwitchForm'
import TextareaForm from './TextareaForm'
import ToggleGroupForm from './ToggleGroupForm'

export const { useAppForm, withFieldGroup, withForm } = createFormHook({
  fieldContext: fieldContext,
  formContext: formContext,
  formComponents: {
    Submit: SubmitForm,
  },
  fieldComponents: {
    Input: InputForm,
    CheckBox: CheckBoxForm,
    Select: SelectForm,
    RadioGroup: RadioGroupForm,
    Textarea: TextareaForm,
    ToggleGroup: ToggleGroupForm,
    Switch: SwitchForm,
  },
})
