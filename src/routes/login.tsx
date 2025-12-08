import { useAuth } from '@/components/AuthProvider'
import { useAppForm } from '@/components/form'
import SubmitForm from '@/components/form/SubmitForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import z from 'zod'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

const authSchema = z.object({
  username: z.string().min(5, 'Tên phải có ít nhất 5 ký tự'),
  password: z.string().min(5, 'Mật khẩu phải có ít nhất 5 ký tự'),
})

function RouteComponent() {
  const { login } = useAuth()

  // 1. Lấy hook navigate và router
  const navigate = Route.useNavigate()
  const router = useRouter()

  // 2. Lấy giá trị redirect từ URL (ví dụ: /login?redirect=/profile)
  const search = Route.useSearch({
    select: (data) => data?.redirect,
  })

  const defaultValues = {
    username: '',
    password: '',
  }
  const form = useAppForm({
    defaultValues: defaultValues,
    validators: {
      onMount: authSchema,
      onSubmit: authSchema,
    },
    onSubmit: async ({ value }) => {
      await new Promise((r) => setTimeout(r, 2000))
      login('token')
      form.reset(defaultValues)

      // 3. QUAN TRỌNG: Làm mới Router để nó nhận diện lại trạng thái Auth mới
      await router.invalidate()

      // 4. Điều hướng:
      // Nếu có search.redirect thì quay lại đó, nếu không thì về trang chủ ('/')
      await navigate({
        to: search || '/',
        replace: true, // Dùng replace để user không back lại trang login được
      })
    },
  })
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <form.AppForm>
        <Card className="min-w-md">
          <CardHeader>
            Đăng nhập tài khoản
            <CardDescription>
              Vui lòng đăng nhập tài khoản để tiếp tục
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form.AppField name="username">
              {(field) => (
                <field.Input
                  label="Tài khoản"
                  placeholder="Nhập thông tin..."
                />
              )}
            </form.AppField>
            <form.AppField name="password">
              {(field) => (
                <field.Input label="Mật khẩu" placeholder="Nhập thông tin..." />
              )}
            </form.AppField>
          </CardContent>
          <CardFooter>
            <SubmitForm className="w-full">Đăng nhập</SubmitForm>
          </CardFooter>
        </Card>
      </form.AppForm>
    </div>
  )
}
