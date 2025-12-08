import { Check, Languages } from 'lucide-react' // Thêm icon Check để biết đang chọn ngôn ngữ nào
import { useTranslation } from 'react-i18next'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export default function LanguageToggle() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: 'en' | 'vi') => {
    i18n.changeLanguage(lng)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => changeLanguage('vi')}
          className="cursor-pointer flex justify-between"
        >
          Tiếng Việt
          {i18n.language === 'vi' && <Check className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => changeLanguage('en')}
          className="cursor-pointer flex justify-between"
        >
          English
          {i18n.language === 'en' && <Check className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
