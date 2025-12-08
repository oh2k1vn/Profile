import { useAppForm } from '@/components/form'
import HomePage from '@/pages/home'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const profileSchema = z.object({
  username: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  bio: z.string().max(100, 'Bio không được quá 100 ký tự'),
  role: z.string().min(1, 'Vui lòng chọn vai trò'),
  workMode: z.string(), // Radio: remote | hybrid | office
  skills: z.array(z.string()).min(1, 'Chọn ít nhất 1 kỹ năng'), // ToggleGroup (multiple)
  notifications: z.boolean(), // Switch
  terms: z
    .boolean()
    .refine((val) => val === true, 'Bạn phải đồng ý điều khoản'), // Checkbox
})

function App() {
  const defaultValues = {
    fullName: '',
    email: '',
  }
  const form = useAppForm({
    defaultValues: {
      username: '',
      bio: '',
      role: '',
      workMode: 'remote',
      skills: [], // Array cho ToggleGroup multiple
      notifications: true,
      terms: false,
    },
    onSubmit: async ({ value }) => {
      // Giả lập API call
      await new Promise((r) => setTimeout(r, 2000))
      console.log('Submitted:', value)
      alert('Cập nhật thành công!')
    },
  })

  const [selectedValues, setSelectedValues] = useState<string[]>([])

  const options = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'angular', label: 'Angular' },
  ]

  return <div className="flex items-center justify-center h-screen">123 </div>
}
