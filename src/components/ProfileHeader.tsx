import { MapPin, MessageSquare, MoreHorizontal, UserPlus } from 'lucide-react'

const ProfileHeader = ({ user }: { user: UserProfile }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      {/* Cover Image */}
      <div className="h-48 md:h-64 w-full relative group">
        <img
          src={user.coverImage}
          alt="Cover"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
      </div>

      {/* Info Bar */}
      <div className="px-6 pb-6 relative">
        <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-4">
          {/* Avatar */}
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-white"
            />
            <div
              className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-white rounded-full"
              title="Online"
            ></div>
          </div>

          {/* Basic Info */}
          <div className="mt-4 md:mt-0 md:ml-6 flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-slate-500 font-medium">{user.role}</p>
            <div className="flex items-center mt-1 text-sm text-slate-400">
              <MapPin className="w-4 h-4 mr-1" />
              {user.location}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 md:mt-0 flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none items-center justify-center inline-flex px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-blue-200">
              <UserPlus className="w-4 h-4 mr-2" />
              Follow
            </button>
            <button className="flex-1 md:flex-none items-center justify-center inline-flex px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors">
              <MessageSquare className="w-4 h-4 mr-2" />
              Nhắn tin
            </button>
            <button className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-lg">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ProfileHeader
