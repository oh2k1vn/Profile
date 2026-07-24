import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { LayoutDashboard, BookOpen, FolderKanban, Tags, Loader2 } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { logoutUser } from '../services/authService';
import { fetchUserProfileData, updateUserProfileData } from '../services/profileService';
import type { UserProfileData } from '../services/profileService';
import { createBlogPost, updateBlogPost, deleteBlogPostById } from '../services/blogService';
import { fetchProjectsFromFirestore, createProjectInFirestore, deleteProjectInFirestore } from '../services/projectService';
import type { CreateProjectInput } from '../services/projectService';
import { audioService } from '../services/audioService';
import { useSEO } from '../hooks/useSEO';
import type { BlogPost, CreateBlogInput } from '../types/blog';
import type { Project } from '../types/project';

import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { DashboardAccessDenied } from '../components/dashboard/DashboardAccessDenied';
import { ProfileTab } from '../components/dashboard/ProfileTab';
import { BlogTab } from '../components/dashboard/BlogTab';
import { CategoriesTab } from '../components/dashboard/CategoriesTab';
import { ProjectsTab } from '../components/dashboard/ProjectsTab';

type DashboardTab = 'profile' | 'blog' | 'categories' | 'projects';

export default function DashboardPage() {
  useSEO({
    title: 'Quản Trị Hệ Thống & Cấu Hình',
    description: 'Trang quản trị hệ thống cá nhân, quản lý thông tin profile, bài viết blog, danh mục và danh sách dự án.',
  });

  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<DashboardTab>('profile');

  // Profile Form State
  const [profile, setProfile] = useState<UserProfileData>({
    uid: '',
    displayName: '',
    jobTitle: 'Middle Frontend & Mobile Developer',
    bio: '',
    email: '',
    phone: '',
    location: 'TP. Hồ Chí Minh',
    avatarUrl: '/images/avatar.webp',
    githubUrl: 'https://github.com/oh2k1vn',
    linkedinUrl: '',
    skillsText: 'React, TypeScript, Flutter, Zalo Mini App, Tailwind CSS, Vite, Firebase',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Blog State
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingBlog, setLoadingBlog] = useState(true);

  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);

      if (currentUser) {
        try {
          const fetchedProfile = await fetchUserProfileData(currentUser.uid);
          if (fetchedProfile) {
            setProfile(prev => ({
              ...prev,
              ...fetchedProfile,
              uid: currentUser.uid,
              email: currentUser.email || prev.email,
              displayName: fetchedProfile.displayName || currentUser.displayName || prev.displayName,
            }));
          } else {
            setProfile(prev => ({
              ...prev,
              uid: currentUser.uid,
              email: currentUser.email || prev.email,
              displayName: currentUser.displayName || prev.displayName,
            }));
          }
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Realtime Blog Listener (100% Firestore)
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts: BlogPost[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as BlogPost));

      setBlogPosts(posts);
      setLoadingBlog(false);
    }, (err) => {
      console.error('Firestore blog listener error:', err);
      setBlogPosts([]);
      setLoadingBlog(false);
    });

    return () => unsubscribe();
  }, [user]);

  // 3. Projects Loader
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
    if (!user) return;
    setSavingProfile(true);
    audioService.playClick();

    try {
      await updateUserProfileData(user.uid, profile);
      audioService.playSuccess();
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      audioService.playError();
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCreateBlog = async (input: CreateBlogInput) => {
    audioService.playClick();
    await createBlogPost(input);
    audioService.playSuccess();
  };

  const handleUpdateBlog = async (id: string, input: CreateBlogInput) => {
    audioService.playClick();
    await updateBlogPost(id, input);
    audioService.playSuccess();
  };

  const handleDeleteBlog = async (id: string) => {
    audioService.playClick();
    await deleteBlogPostById(id);
    audioService.playSuccess();
  };

  const handleCreateProject = async (input: CreateProjectInput, techText: string) => {
    audioService.playClick();
    const techArray = techText.split(',').map(t => t.trim()).filter(t => t.length > 0);
    await createProjectInFirestore({
      ...input,
      tech: techArray.length > 0 ? techArray : ['React', 'TypeScript'],
    });
    audioService.playSuccess();
    const updated = await fetchProjectsFromFirestore();
    setProjects(updated);
  };

  const handleDeleteProject = async (id: string) => {
    audioService.playClick();
    await deleteProjectInFirestore(id);
    audioService.playSuccess();
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleLogout = async () => {
    audioService.playClick();
    await logoutUser();
    navigate('/');
  };

  if (loadingAuth) {
    return (
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 size={36} className="text-sky-400 animate-spin" />
        <p className="text-sm font-sans text-slate-400">Đang xác thực quyền truy cập...</p>
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
    <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-10 space-y-8">
      {/* Top Header */}
      <DashboardHeader
        user={user}
        profile={profile}
        onNavigateHome={() => navigate('/')}
        onLogout={handleLogout}
      />

      {/* Tab Segmented Control */}
      <div className="flex bg-slate-900/60 backdrop-blur-xl p-1.5 rounded-2xl border border-white/12 gap-1.5 max-w-2xl overflow-x-auto scrollbar-none">
        <button
          onClick={() => { audioService.playClick(); setActiveTab('profile'); }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-white/15 text-sky-400 border border-white/20 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard size={14} />
          Thông Tin Profile
        </button>

        <button
          onClick={() => { audioService.playClick(); setActiveTab('blog'); }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'blog'
              ? 'bg-white/15 text-sky-400 border border-white/20 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen size={14} />
          Quản Lý Blog
        </button>

        <button
          onClick={() => { audioService.playClick(); setActiveTab('categories'); }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'categories'
              ? 'bg-white/15 text-sky-400 border border-white/20 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tags size={14} />
          Quản Lý Danh Mục
        </button>

        <button
          onClick={() => { audioService.playClick(); setActiveTab('projects'); }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'projects'
              ? 'bg-white/15 text-sky-400 border border-white/20 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderKanban size={14} />
          Quản Lý Dự Án
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <ProfileTab
          profile={profile}
          setProfile={setProfile}
          savingProfile={savingProfile}
          profileSuccess={profileSuccess}
          onSaveProfile={handleSaveProfile}
        />
      )}

      {activeTab === 'blog' && (
        <BlogTab
          blogPosts={blogPosts}
          loadingBlog={loadingBlog}
          onDeleteBlog={handleDeleteBlog}
          onCreateBlog={handleCreateBlog}
          onUpdateBlog={handleUpdateBlog}
        />
      )}

      {activeTab === 'categories' && (
        <CategoriesTab />
      )}

      {activeTab === 'projects' && (
        <ProjectsTab
          projects={projects}
          loadingProjects={loadingProjects}
          onDeleteProject={handleDeleteProject}
          onCreateProject={handleCreateProject}
        />
      )}
    </main>
  );
}
