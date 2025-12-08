import Logo from '@/assets/images/logo.png'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ModeToggle } from './ModeToggle'

const menuItems = [
  { name: 'Projects', href: '#projects' },
  { name: 'Tech Stack', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact', href: '#contact' },
]

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Đổi trạng thái khi scroll quá 20px
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
      <nav
        className={cn(
          'transition-all duration-500 ease-in-out border border-transparent',
          isScrolled
            ? 'w-full max-w-4xl bg-background/70 backdrop-blur-xs rounded-xl shadow-lg border-border/40 py-2 px-4'
            : 'w-full max-w-7xl bg-transparent py-4 px-2',
        )}
      >
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-2 cursor-pointer">
            <img src={Logo} alt="" className="w-8 h-auto" />
            {/* Ẩn tên khi scroll để tiết kiệm diện tích trên mobile, hoặc giữ nguyên tùy ý */}
            <span
              className={cn(
                'font-bold text-xl tracking-tight transition-opacity duration-300',
                isScrolled ? 'hidden sm:block' : 'block',
              )}
            >
              HieuNguyen.
            </span>
          </div>

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex items-center gap-8">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          {/* ACTIONS & MOBILE TOGGLE */}
          <div className="flex items-center gap-3">
            {/* Logic Button thay đổi theo trạng thái Scroll */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Khi Scrolled: Chỉ hiện nút Get Started (Icon style) */}
              {/* <div
                className={cn(
                  'transition-all duration-300 overflow-hidden flex gap-2',
                  isScrolled ? 'w-0 opacity-0' : 'w-auto opacity-100',
                )}
              >
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
                <Button variant="outline" size="sm">
                  Sign Up
                </Button>
              </div> */}

              <ModeToggle />

              {/* <Button
                size={isScrolled ? 'sm' : 'default'}
                className={cn(
                  'transition-all duration-300',
                  isScrolled ? 'rounded-full px-6' : '',
                )}
              >
                {isScrolled ? 'Contact Me' : 'Hire Me'}
              </Button> */}
            </div>

            {/* Nút Github (Optional - để trông dev hơn) */}
            {/* <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Github size={20} />
            </Button> */}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:bg-muted rounded-full transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {/* Render có điều kiện hoặc dùng CSS height để animate */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
            isMobileMenuOpen
              ? 'max-h-96 opacity-100 mt-4 pb-4'
              : 'max-h-0 opacity-0',
          )}
        >
          <div className="flex flex-col gap-4 bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-sm font-medium p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="h-px bg-border my-2" />
            <div className="flex flex-col gap-2">
              {/* <Button variant="outline" className="w-full justify-start">
                Log In
              </Button>
              <Button className="w-full">Hire Me</Button> */}
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
