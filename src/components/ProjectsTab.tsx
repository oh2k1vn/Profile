import { Layout } from 'lucide-react'

const ProjectsTab = ({ user }: { user: UserProfile }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {user.projects.map((project) => (
        <div
          key={project.id}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-shadow"
        >
          <div className="h-40 overflow-hidden relative">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-start p-4">
              <span className="text-white text-xs font-bold px-2 py-1 bg-blue-600 rounded">
                View Case Study
              </span>
            </div>
          </div>
          <div className="p-5">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">
              {project.category}
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
              {project.title}
            </h4>
            <div className="flex flex-wrap gap-2 mt-4">
              {project.tech.map((t, i) => (
                <span
                  key={i}
                  className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Add New Project Card Placeholder */}
      <div className="border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer min-h-[200px]">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <Layout className="w-6 h-6" />
        </div>
        <span className="font-medium text-sm">Thêm dự án mới</span>
      </div>
    </div>
  )
}

export default ProjectsTab
