import { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Tag, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { audioService } from '../utils/audio';
import { BlogEditor } from '../components/BlogEditor';
import { MOCK_POSTS } from '../data/mockPosts';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: { seconds: number; nanoseconds: number };
  updatedAt: { seconds: number; nanoseconds: number };
  isMock?: boolean;
}

export default function BlogPage() {
  const navigate = useNavigate();
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
      // Fallback on connection errors / invalid credentials
      setPosts(MOCK_POSTS);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // All unique tags
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags)));

  // Filter logic
  const filteredPosts = posts.filter(p => {
    const matchesSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || p.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Format date
  const formatDate = (ts: { seconds: number }) => {
    const date = new Date(ts.seconds * 1000);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  };

  // Get snippet
  const getSnippet = (content: string, maxLen = 120) => {
    const stripped = content.replace(/[#*`_~>\[\]()!-]/g, '').replace(/\n+/g, ' ').trim();
    return stripped.length > maxLen ? stripped.slice(0, maxLen) + '...' : stripped;
  };

  return (
    <>
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 md:py-12 space-y-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-light-green/10 pb-4">
          <div className="flex items-center space-x-3">
            <BookOpen className="text-heading-primary" size={22} />
            <h1 className="text-xl font-bold font-mono uppercase text-heading-primary tracking-widest">Kho Bài Viết</h1>
          </div>

          <button
            onClick={() => { audioService.playClick(); setShowEditor(true); }}
            className="px-5 py-2.5 bg-heading-primary hover:bg-heading-accent text-dark-green rounded-lg text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] border-none w-full sm:w-auto justify-center"
          >
            <Plus size={14} />
            Viết Bài Mới
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-green/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết..."
              className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-light-green/20 rounded-lg text-sm font-mono text-text-light placeholder:text-text-green/40 focus:outline-none focus:border-heading-primary/60 transition-colors"
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex gap-2 flex-wrap items-center">
              <button
                onClick={() => { audioService.playClick(); setSelectedTag(null); }}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all cursor-pointer border ${
                  !selectedTag
                    ? 'bg-heading-primary/20 border-heading-primary/40 text-heading-accent font-bold'
                    : 'border-light-green/20 text-text-green hover:border-light-green/40'
                }`}
              >
                Tất cả
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => { audioService.playClick(); setSelectedTag(tag === selectedTag ? null : tag); }}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all cursor-pointer border flex items-center gap-1 ${
                    selectedTag === tag
                      ? 'bg-heading-primary/20 border-heading-primary/40 text-heading-accent font-bold'
                      : 'border-light-green/20 text-text-green hover:border-light-green/40'
                  }`}
                >
                  <Tag size={10} />
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 size={32} className="text-heading-primary animate-spin" />
            <p className="text-sm font-mono text-text-green">Đang tải bài viết...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <BookOpen size={48} className="text-light-green/20" />
            <p className="text-sm font-mono text-text-green">
              {posts.length === 0
                ? 'Chưa có bài viết nào. Hãy viết bài đầu tiên!'
                : 'Không tìm thấy bài viết phù hợp.'}
            </p>
            {posts.length === 0 && (
              <button
                onClick={() => { audioService.playClick(); setShowEditor(true); }}
                className="px-5 py-2.5 bg-heading-primary hover:bg-heading-accent text-dark-green rounded-lg text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all duration-200 border-none"
              >
                <Plus size={14} />
                Viết Bài Đầu Tiên
              </button>
            )}
          </div>
        ) : (
          /* Blog Posts Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => { audioService.playClick(); navigate(`/blog/${post.id}`); }}
                className="glass-panel border border-light-green/20 rounded-xl p-5 hover:border-light-green/50 transition-all duration-300 cursor-pointer group hover:-translate-y-1 flex flex-col justify-between"
              >
                {/* Post Meta */}
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-text-green/60 mb-3">
                    <Clock size={10} />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>

                  <h3 className="text-base font-bold font-mono text-text-light mb-2 group-hover:text-heading-primary transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-text-green font-mono leading-relaxed mb-4 line-clamp-3">
                    {getSnippet(post.content)}
                  </p>
                </div>

                {/* Tags & CTA */}
                <div className="space-y-3">
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-heading-primary/10 border border-heading-primary/20 rounded-full text-[9px] font-mono text-heading-accent"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-[10px] font-mono text-heading-primary opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    Đọc tiếp
                    <ChevronRight size={12} className="animate-pulse" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Stats Bar */}
        {!loading && posts.length > 0 && (
          <div className="border-t border-light-green/10 pt-4 text-center">
            <p className="text-[11px] font-mono text-text-green/50">
              Hiển thị {filteredPosts.length} / {posts.length} bài viết
              {selectedTag && <span> · Tag: <span className="text-heading-accent">#{selectedTag}</span></span>}
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
