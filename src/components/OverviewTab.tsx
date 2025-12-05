import { Briefcase } from 'lucide-react'

const OverviewTab = ({ user }: { user: UserProfile }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800">
            Kinh nghiệm làm việc
          </h3>
          <button className="text-sm text-blue-600 font-medium hover:underline">
            Tải CV
          </button>
        </div>

        <div className="space-y-8">
          {user.experiences.map((exp) => (
            <div
              key={exp.id}
              className="relative pl-8 border-l-2 border-slate-200 last:border-0 pb-1"
            >
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-blue-500"></div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h4 className="text-base font-bold text-slate-800">
                  {exp.role}
                </h4>
                <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded mt-1 sm:mt-0 w-fit">
                  {exp.period}
                </span>
              </div>
              <div className="flex items-center text-sm text-slate-500 mb-2 font-medium">
                <Briefcase className="w-4 h-4 mr-1.5" />
                {exp.company}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default OverviewTab
