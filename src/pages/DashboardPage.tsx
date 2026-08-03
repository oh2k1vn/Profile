import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FolderKanban,
  Tags,
  Users,
  Loader2,
  ShieldAlert,
} from 'lucide-react';

import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { db } from '../services/firebase';
import { logoutUser } from '../services/authService';
import {
  createBlogPost,
  updateBlogPost,
  deleteBlogPostById,
} from '../services/blogService';
import {
  fetchProjectsFromFirestore,
  createProjectInFirestore,
  deleteProjectInFirestore,
} from '../services/projectService';
import type { CreateProjectInput } from '../services/projectService';
import { audioService } from '../services/audioService';
import { useSEO } from '../hooks/useSEO';
import type { BlogPost, CreateBlogInput } from '../types/blog';
import type { Project } from '../types/project';
import { useProfile } from '../contexts/ProfileContext';

import {
  DashboardHeader,
  DashboardSidebar,
  DashboardStats,
  DashboardAccessDenied,
  ProfileTab,
  BlogTab,
  CategoriesTab,
  ProjectsTab,
  UsersTab,
} from '../components/dashboard';
import type { DashboardTab } from '../components/dashboard';

export default function DashboardPage() {
  useSEO({
    title: 'Quản Trị Hệ Thống & Cấu Hình',
    description:
      'Trang quản trị hệ thống cá nhân, quản lý thông tin profile, bài viết blog, danh mục và danh sách dự án.',
  });

  const navigate = useNavigate();
  const {
    user,
    profile: contextProfile,
    isAdmin,
    loading: loadingAuth,
    updateProfile,
  } = useProfile();

  const [activeTab, setActiveTab] = useState<DashboardTab>('profile');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Local state for profile form editing
  const [profile, setProfile] = useState(contextProfile);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Sync local profile state with context profile when context updates
  useEffect(() => {
    if (contextProfile) {
      setProfile(contextProfile);
    }
  }, [contextProfile]);

  // Blog State
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingBlog, setLoadingBlog] = useState(true);

  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Realtime Blog Listener
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const posts: BlogPost[] = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as BlogPost
        );

        setBlogPosts(posts);
        setLoadingBlog(false);
      },
      (err) => {
        console.error('Firestore blog listener error:', err);
        setBlogPosts([]);
        setLoadingBlog(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Projects Loader
  useEffect(() => {
    if (!user) return;
    const loadProjects = async () => {
      try {
        const fetched = await fetchProjectsFromFirestore();
        setProjects(fetched);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoadingProjects(false);
      }
    };
    loadProjects();
  }, [user]);

  // Actions
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    setSavingProfile(true);
    audioService.playClick();

    try {
      await updateProfile(profile);
      audioService.playSuccess();
      toast.success('Đã lưu thông tin Profile thành công!');
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      audioService.playError();
      toast.error('Lỗi khi lưu profile. Vui lòng thử lại!');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCreateBlog = async (input: CreateBlogInput) => {
    audioService.playClick();
    try {
      await createBlogPost(input);
      audioService.playSuccess();
      toast.success('Đã xuất bản bài viết blog mới!');
    } catch (err) {
      console.error('Error creating blog:', err);
      audioService.playError();
      toast.error('Lỗi khi tạo bài viết blog!');
    }
  };

  const handleUpdateBlog = async (id: string, input: CreateBlogInput) => {
    audioService.playClick();
    try {
      await updateBlogPost(id, input);
      audioService.playSuccess();
      toast.success('Đã cập nhật bài viết blog!');
    } catch (err) {
      console.error('Error updating blog:', err);
      audioService.playError();
      toast.error('Lỗi khi cập nhật bài viết!');
    }
  };

  const handleDeleteBlog = async (id: string) => {
    audioService.playClick();
    try {
      await deleteBlogPostById(id);
      audioService.playSuccess();
      toast.success('Đã xoá bài viết khỏi Firestore!');
    } catch (err) {
      console.error('Error deleting blog:', err);
      audioService.playError();
      toast.error('Lỗi khi xoá bài viết!');
    }
  };

  const handleCreateProject = async (input: CreateProjectInput, techText: string) => {
    audioService.playClick();
    try {
      const techArray = techText
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      await createProjectInFirestore({
        ...input,
        tech: techArray.length > 0 ? techArray : ['React', 'TypeScript'],
      });
      audioService.playSuccess();
      toast.success('Đã thêm dự án mới thành công!');
      const updated = await fetchProjectsFromFirestore();
      setProjects(updated);
    } catch (err) {
      console.error('Error creating project:', err);
      audioService.playError();
      toast.error('Lỗi khi thêm dự án mới!');
    }
  };

  const handleDeleteProject = async (id: string) => {
    audioService.playClick();
    try {
      await deleteProjectInFirestore(id);
      audioService.playSuccess();
      toast.success('Đã xoá dự án khỏi Firestore!');
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
      audioService.playError();
      toast.error('Lỗi khi xoá dự án!');
    }
  };

  const handleLogout = async () => {
    audioService.playClick();
    await logoutUser();
    navigate('/');
  };

  if (loadingAuth) {
    return (
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-sky-400/30 flex items-center justify-center shadow-2xl shadow-sky-500/20">
          <Loader2 size={32} className="text-sky-400 animate-spin" />
        </div>
        <p className="text-xs font-mono text-slate-400">Đang xác thực quyền truy cập hệ thống...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <DashboardAccessDenied
        onNavigatePlayground={() => navigate('/playground')}
        onNavigateHome={() => navigate('/')}
      />
    );
  }

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 md:py-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Desktop Collapsible Glass Sidebar */}
        <DashboardSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          profile={profile}
          isAdmin={isAdmin}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          blogCount={blogPosts.length}
          projectCount={projects.length}
          onNavigateHome={() => navigate('/')}
          onLogout={handleLogout}
        />

        {/* Main Workspace Column */}
        <div className="flex-1 w-full space-y-6 min-w-0">
          {/* Top Header & Breadcrumbs Toolbar */}
          <DashboardHeader
            user={user}
            profile={profile}
            activeTab={activeTab}
            onNavigateHome={() => navigate('/')}
            onLogout={handleLogout}
          />

          {/* Mobile Tab Navigation Segmented Bar */}
          <div className="md:hidden flex bg-slate-900/80 backdrop-blur-xl p-1.5 rounded-2xl border border-white/14 gap-1 overflow-x-auto scrollbar-none shadow-lg">
            <button
              onClick={() => {
                audioService.playClick();
                setActiveTab('profile');
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'bg-white/15 text-sky-400 border border-white/20 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard size={14} />
              Profile
            </button>

            <button
              onClick={() => {
                audioService.playClick();
                setActiveTab('blog');
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'blog'
                  ? 'bg-white/15 text-sky-400 border border-white/20 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen size={14} />
              Blog ({blogPosts.length})
            </button>

            <button
              onClick={() => {
                audioService.playClick();
                setActiveTab('categories');
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'categories'
                  ? 'bg-white/15 text-sky-400 border border-white/20 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tags size={14} />
              Danh Mục
            </button>

            <button
              onClick={() => {
                audioService.playClick();
                setActiveTab('projects');
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'projects'
                  ? 'bg-white/15 text-sky-400 border border-white/20 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FolderKanban size={14} />
              Dự Án ({projects.length})
            </button>

            {isAdmin && (
              <button
                onClick={() => {
                  audioService.playClick();
                  setActiveTab('users');
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'bg-white/15 text-sky-400 border border-white/20 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users size={14} />
                Users
              </button>
            )}
          </div>

          {/* Informative Banner for Non-Admin Users */}
          {!isAdmin && (
            <div className="p-4 rounded-2xl bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-sans flex items-center gap-3 shadow-lg">
              <ShieldAlert size={20} className="text-sky-400 shrink-0" />
              <div>
                <strong className="block text-white font-semibold text-sm">
                  Chế độ Thành Viên (User Mode)
                </strong>
                Tài khoản của bạn có quyền <span className="underline font-bold text-sky-200">User</span>. Bạn có thể Thêm, Sửa và Xoá bài viết, dự án và danh mục do chính bạn tạo ra.
              </div>
            </div>
          )}

          {/* Overview Metrics Cards Bar */}
          <DashboardStats
            blogCount={blogPosts.length}
            projectCount={projects.length}
            isAdmin={isAdmin}
            onSelectTab={setActiveTab}
          />

          {/* Active Workspace Tab Content */}
          <div className="space-y-6 pt-2">
            {activeTab === 'profile' && profile && (
              <ProfileTab
                profile={profile}
                setProfile={setProfile}
                savingProfile={savingProfile}
                profileSuccess={profileSuccess}
                onSaveProfile={handleSaveProfile}
                isAdmin={isAdmin}
              />
            )}

            {activeTab === 'blog' && (
              <BlogTab
                blogPosts={blogPosts}
                loadingBlog={loadingBlog}
                onDeleteBlog={handleDeleteBlog}
                onCreateBlog={handleCreateBlog}
                onUpdateBlog={handleUpdateBlog}
                isAdmin={isAdmin}
              />
            )}

            {activeTab === 'categories' && <CategoriesTab isAdmin={isAdmin} />}

            {activeTab === 'projects' && (
              <ProjectsTab
                projects={projects}
                loadingProjects={loadingProjects}
                onDeleteProject={handleDeleteProject}
                onCreateProject={handleCreateProject}
                isAdmin={isAdmin}
              />
            )}

            {activeTab === 'users' && isAdmin && (
              <UsersTab currentUserId={user.uid} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
