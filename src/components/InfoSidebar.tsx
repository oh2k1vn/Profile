import { Github, Linkedin, LinkIcon, Mail, Phone, Twitter } from 'lucide-react'

const InfoSidebar = ({ user }: { user: UserProfile }) => {
  return (
    <div className="space-y-6">
      {/* Intro Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Giới thiệu</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          {user.about}
        </p>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-slate-600">
            <Mail className="w-4 h-4 mr-3 text-slate-400" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center text-sm text-slate-600">
            <Phone className="w-4 h-4 mr-3 text-slate-400" />
            <span>{user.phone}</span>
          </div>
          <div className="flex items-center text-sm text-slate-600">
            <LinkIcon className="w-4 h-4 mr-3 text-slate-400" />
            <a
              href={`https://${user.website}`}
              className="text-blue-600 hover:underline"
            >
              {user.website}
            </a>
          </div>
        </div>

        <div className="border-t border-slate-100 my-5 pt-5">
          <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3">
            Mạng xã hội
          </h4>
          <div className="flex gap-4">
            <a
              href="#"
              className="p-2 bg-slate-50 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 bg-slate-50 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 bg-slate-50 rounded-full text-sky-500 hover:bg-sky-50 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Skills Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Kỹ năng</h3>
        <div className="flex flex-wrap gap-2">
          {user.skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InfoSidebar
