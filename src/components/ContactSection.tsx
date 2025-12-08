import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Code2,
  Facebook,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react'

export default function ContactSection() {
  return (
    <footer
      id="contact"
      className="bg-background pt-24 pb-12 relative overflow-hidden border-t border-border"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start mb-20">
          {/* Left Column: Contact Info */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
              Get in touch
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Let's build something <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                amazing together.
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Bạn đang tìm kiếm giải pháp tối ưu cho Mobile App hay Zalo Mini
              App? Hoặc cần tư vấn về kiến trúc hệ thống? Hãy để lại lời nhắn,
              tôi sẽ phản hồi trong vòng 24h.
            </p>

            <div className="space-y-6">
              <a
                href="mailto:contact@yourdomain.com"
                className="flex items-center gap-4 group p-4 rounded-2xl transition-all hover:bg-secondary/50 border border-transparent hover:border-border"
              >
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center border border-border group-hover:border-blue-500 group-hover:text-blue-500 transition-colors shadow-sm">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Email me at
                  </p>
                  <p className="font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                    dev.profile@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="tel:+84999999999"
                className="flex items-center gap-4 group p-4 rounded-2xl transition-all hover:bg-secondary/50 border border-transparent hover:border-border"
              >
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center border border-border group-hover:border-green-500 group-hover:text-green-500 transition-colors shadow-sm">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Call or Zalo
                  </p>
                  <p className="font-semibold text-foreground group-hover:text-green-600 transition-colors">
                    (+84) 099 999 999
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center border border-border shadow-sm">
                  <MapPin className="text-muted-foreground" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Based in
                  </p>
                  <p className="font-semibold text-foreground">
                    Ho Chi Minh City, Vietnam
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-10 pl-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
              >
                <Linkedin size={20} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all"
              >
                <Github size={20} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all"
              >
                <Facebook size={20} />
              </Button>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-border shadow-2xl shadow-blue-500/5 relative">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Code2 size={120} />
            </div>

            <h3 className="text-2xl font-bold mb-2">Send a message</h3>
            <p className="text-muted-foreground mb-8 text-sm">
              Fill out the form below and I'll get back to you shortly.
            </p>

            <form className="space-y-4 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                    Name
                  </label>
                  <Input placeholder="John Doe" className="bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                    Email
                  </label>
                  <Input
                    placeholder="john@example.com"
                    type="email"
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                  Subject
                </label>
                <Input
                  placeholder="Project Discussion"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                  Message
                </label>
                <Textarea
                  className="min-h-[150px] resize-none bg-background"
                  placeholder="Tell me about your project needs..."
                />
              </div>

              <Button
                size="lg"
                className="w-full gap-2 font-bold shadow-lg shadow-blue-500/20"
              >
                Send Message <Send size={16} />
              </Button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-border pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()}{' '}
            <span className="font-semibold text-foreground">Your Name</span>.
            All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Built with{' '}
            <span className="text-foreground font-medium">React</span>,{' '}
            <span className="text-foreground font-medium">Tailwind</span> &{' '}
            <span className="text-foreground font-medium">Shadcn UI</span>.
          </p>
        </div>
      </div>
    </footer>
  )
}
