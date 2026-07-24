import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import type { BlogPost } from '../types/blog';
import { fetchBlogPostById, deleteBlogPostById } from '../services/blogService';
import { audioService } from '../services/audioService';
import { useSEO } from '../hooks/useSEO';
import { useProfile } from '../contexts/ProfileContext';
import { canManageResource } from '../utils/authUtils';

function renderMarkdown(md: string): string {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="blog-code-block"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="blog-inline-code">$1</code>')
    .replace(/^### (.+)$/gm, '<h3 class="blog-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="blog-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="blog-h1">$1</h1>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="blog-link">$1</a>')
    .replace(/^---$/gm, '<hr class="blog-hr" />')
    .replace(/^[*-] (.+)$/gm, '<li class="blog-li">$1</li>')
    .replace(/\n\n/g, '</p><p class="blog-p">')
    .replace(/\n/g, '<br />');

  html = html.replace(/((?:<li class="blog-li">.*?<\/li>\s*)+)/g, '<ul class="blog-ul">$1</ul>');

  if (!html.startsWith('<h') && !html.startsWith('<pre') && !html.startsWith('<ul')) {
    html = '<p class="blog-p">' + html + '</p>';
  }

  return html;
}

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useProfile();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);


  useSEO({
    title: post?.title || 'Bài Viết',
    description: post ? post.content.slice(0, 160).replace(/[#*`]/g, '') : 'Đọc bài viết kỹ thuật của Nguyễn Minh Hiếu.',
    keywords: post?.tags.join(', ') || 'Blog, Software Engineering, Nguyễn Minh Hiếu',
  });

  useEffect(() => {
    if (!id) return;

    const loadPost = async () => {
      try {
        const fetched = await fetchBlogPostById(id);
        if (fetched) {
          setPost(fetched);
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

    loadPost();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);

    try {
      await deleteBlogPostById(id);
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

  if (loading) {
    return (
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-20 flex flex-col items-center space-y-4">
        <Loader2 size={32} className="text-sky-400 animate-spin" />
        <p className="text-sm font-sans text-slate-400">Đang tải bài viết...</p>
      </main>
    );
  }

  if (notFound || !post) {
    return (
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-20 flex flex-col items-center space-y-4">
        <AlertTriangle size={48} className="text-rose-400" />
        <p className="text-base font-sans text-white">Không tìm thấy bài viết</p>
        <button
          onClick={() => { audioService.playClick(); navigate('/blog'); }}
          className="liquid-glass-pill px-5 py-2.5 rounded-2xl text-xs font-medium text-white flex items-center gap-2"
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
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <button
          onClick={() => { audioService.playClick(); navigate('/blog'); }}
          className="liquid-glass-pill px-4 py-2 rounded-full text-xs font-semibold text-sky-400 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft size={14} />
          Quay lại Kho Bài Viết
        </button>

        {/* Show Delete button only to Admin or Post Author */}
        {canManageResource(user, isAdmin, post.authorId) && (
          <button
            onClick={() => { audioService.playClick(); setShowDeleteConfirm(true); }}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 size={12} />
            Xoá
          </button>
        )}

      </div>

      {/* Post Header */}
      <header className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-extrabold font-sans text-white leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-sky-400" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-purple-400" />
              {post.tags.map(tag => (
                <span key={tag} className="px-2.5 py-0.5 bg-sky-500/15 border border-sky-400/20 rounded-full text-sky-300 font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Post Content */}
      <article
        className="blog-content liquid-glass rounded-3xl p-6 sm:p-10 border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="liquid-glass border border-rose-500/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle size={22} />
              <h3 className="text-base font-bold font-sans">Xác nhận xoá</h3>
            </div>
            <p className="text-xs font-sans text-slate-300">
              Bạn có chắc chắn muốn xoá bài viết <strong className="text-white">"{post.title}"</strong>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => { audioService.playClick(); setShowDeleteConfirm(false); }}
                className="liquid-glass-pill px-4 py-2 rounded-2xl text-xs font-medium text-slate-300 hover:text-white"
              >
                Huỷ
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50 border-none shadow-lg shadow-rose-500/30"
              >
                <Trash2 size={13} />
                {deleting ? 'Đang xoá...' : 'Xoá vĩnh viễn'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
