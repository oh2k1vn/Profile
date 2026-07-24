import { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Tag, Loader2 } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { audioService } from '../services/audioService';
import type { BlogPost } from '../types/blog';
import { MOCK_POSTS } from '../constants/mockPosts';
import { BlogCard } from '../components/blog/BlogCard';
import { BlogEditor } from '../components/blog/BlogEditor';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Realtime listener
  useEffect(() => {
    const q = query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPosts: BlogPost[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as BlogPost));
      
      if (newPosts.length === 0) {
        setPosts(MOCK_POSTS);
      } else {
        setPosts(newPosts);
      }
      setLoading(false);
    }, (err) => {
      console.error('Firestore listener error:', err);
      setPosts(MOCK_POSTS);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const allTags = Array.from(new Set(posts.flatMap(p => p.tags)));

  const filteredPosts = posts.filter(p => {
    const matchesSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || p.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <>
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 md:py-12 space-y-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400">
              <BookOpen size={20} />
            </div>
            <h1 className="text-xl font-bold font-sans text-white tracking-wide">Kho Bài Viết & Chia Sẻ</h1>
          </div>

          <button
            onClick={() => { audioService.playClick(); setShowEditor(true); }}
            className="liquid-glass-accent-btn px-5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all duration-200 w-full sm:w-auto justify-center"
          >
            <Plus size={14} />
            Viết Bài Mới
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết..."
              className="glass-input w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs font-sans text-white placeholder:text-slate-400"
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex gap-2 flex-wrap items-center">
              <button
                onClick={() => { audioService.playClick(); setSelectedTag(null); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                  !selectedTag
                    ? 'bg-white/20 border-white/30 text-sky-300 font-semibold shadow-sm'
                    : 'liquid-glass-pill border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                Tất cả
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => { audioService.playClick(); setSelectedTag(tag === selectedTag ? null : tag); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border flex items-center gap-1 ${
                    selectedTag === tag
                      ? 'bg-white/20 border-white/30 text-sky-300 font-semibold shadow-sm'
                      : 'liquid-glass-pill border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  <Tag size={11} />
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 size={32} className="text-sky-400 animate-spin" />
            <p className="text-sm font-sans text-slate-400">Đang tải bài viết...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <BookOpen size={48} className="text-slate-600" />
            <p className="text-sm font-sans text-slate-400">
              {posts.length === 0
                ? 'Chưa có bài viết nào. Hãy viết bài đầu tiên!'
                : 'Không tìm thấy bài viết phù hợp.'}
            </p>
            {posts.length === 0 && (
              <button
                onClick={() => { audioService.playClick(); setShowEditor(true); }}
                className="liquid-glass-accent-btn px-5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all duration-200"
              >
                <Plus size={14} />
                Viết Bài Đầu Tiên
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Stats Bar */}
        {!loading && posts.length > 0 && (
          <div className="border-t border-white/10 pt-4 text-center">
            <p className="text-xs font-sans text-slate-400">
              Hiển thị {filteredPosts.length} / {posts.length} bài viết
              {selectedTag && <span> · Tag: <span className="text-sky-300">#{selectedTag}</span></span>}
            </p>
          </div>
        )}
      </main>

      {/* Editor Modal */}
      {showEditor && (
        <BlogEditor
          onClose={() => setShowEditor(false)}
          onSaved={() => {/* realtime listener auto-updates */}}
        />
      )}
    </>
  );
}
