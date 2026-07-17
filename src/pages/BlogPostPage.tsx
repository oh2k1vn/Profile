import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { ArrowLeft, Clock, Tag, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { db } from '../lib/firebase';
import { audioService } from '../utils/audio';
import type { BlogPost } from './BlogPage';
import { MOCK_POSTS } from '../data/mockPosts';

// Simple markdown renderer (no external dependency)
function renderMarkdown(md: string): string {
  let html = md
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Code blocks ```
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="blog-code-block"><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="blog-inline-code">$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="blog-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="blog-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="blog-h1">$1</h1>')
    // Bold & Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="blog-link">$1</a>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="blog-hr" />')
    // Unordered lists
    .replace(/^[*-] (.+)$/gm, '<li class="blog-li">$1</li>')
    // Line breaks (double newlines = paragraph)
    .replace(/\n\n/g, '</p><p class="blog-p">')
    // Single newlines within paragraphs
    .replace(/\n/g, '<br />');

  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li class="blog-li">.*?<\/li>\s*)+)/g, '<ul class="blog-ul">$1</ul>');

  // Wrap in initial <p>
  if (!html.startsWith('<h') && !html.startsWith('<pre') && !html.startsWith('<ul')) {
    html = '<p class="blog-p">' + html + '</p>';
  }

  return html;
}

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Check mock fallback first
    const mock = MOCK_POSTS.find(p => p.id === id);
    if (mock) {
      setPost(mock);
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'blog_posts', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as BlogPost);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!id || post?.isMock) return;
    setDeleting(true);

    try {
      await deleteDoc(doc(db, 'blog_posts', id));
      audioService.playSuccess();
      navigate('/blog');
    } catch (err) {
      console.error('Error deleting post:', err);
      setDeleting(false);
    }
  };

  const formatDate = (ts: { seconds: number }) => {
    const date = new Date(ts.seconds * 1000);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  // Loading
  if (loading) {
    return (
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-20 flex flex-col items-center space-y-4">
        <Loader2 size={32} className="text-heading-primary animate-spin" />
        <p className="text-sm font-mono text-text-green">Đang tải bài viết...</p>
      </main>
    );
  }

  // Not Found
  if (notFound || !post) {
    return (
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-20 flex flex-col items-center space-y-4">
        <AlertTriangle size={48} className="text-red-400" />
        <p className="text-base font-mono text-text-light">Không tìm thấy bài viết</p>
        <button
          onClick={() => { audioService.playClick(); navigate('/blog'); }}
          className="px-5 py-2.5 border border-light-green/30 rounded-lg text-xs font-mono text-text-light hover:border-light-green/60 transition-all cursor-pointer bg-transparent flex items-center gap-2"
        >
          <ArrowLeft size={14} />
          Quay lại danh sách
        </button>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 md:py-12 space-y-6">

      {/* Navigation & Actions */}
      <div className="flex items-center justify-between border-b border-light-green/10 pb-4">
        <button
          onClick={() => { audioService.playClick(); navigate('/blog'); }}
          className="text-xs font-mono text-heading-accent hover:underline flex items-center gap-1.5 cursor-pointer bg-transparent border-none font-bold"
        >
          <ArrowLeft size={14} />
          Quay lại Kho Bài Viết
        </button>

        {!post.isMock && (
          <button
            onClick={() => { audioService.playClick(); setShowDeleteConfirm(true); }}
            className="px-3 py-1.5 border border-red-500/30 rounded-lg text-[11px] font-mono text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all cursor-pointer bg-transparent flex items-center gap-1.5"
          >
            <Trash2 size={12} />
            Xoá
          </button>
        )}
      </div>

      {/* Post Header */}
      <header className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-extrabold font-mono text-text-light leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-text-green/60">
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag size={12} />
              {post.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-heading-primary/10 border border-heading-primary/20 rounded-full text-heading-accent">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Post Content */}
      <article
        className="blog-content glass-panel border border-light-green/20 rounded-xl p-6 md:p-8"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel border border-red-500/30 rounded-xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle size={20} />
              <h3 className="text-base font-bold font-mono">Xác nhận xoá</h3>
            </div>
            <p className="text-sm font-mono text-text-green">
              Bạn có chắc chắn muốn xoá bài viết <strong className="text-text-light">"{post.title}"</strong>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => { audioService.playClick(); setShowDeleteConfirm(false); }}
                className="px-4 py-2 border border-light-green/25 rounded-lg text-xs font-mono text-text-green hover:text-text-light hover:border-light-green/50 transition-all cursor-pointer bg-transparent"
              >
                Huỷ
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50 border-none"
              >
                <Trash2 size={12} />
                {deleting ? 'Đang xoá...' : 'Xoá vĩnh viễn'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
