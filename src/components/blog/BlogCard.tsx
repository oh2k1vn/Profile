import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { BlogPost } from '../../types/blog';
import { audioService } from '../../services/audioService';

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const navigate = useNavigate();

  const formatDate = (ts: { seconds: number }) => {
    const date = new Date(ts.seconds * 1000);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  };

  const getSnippet = (content: string, maxLen = 120) => {
    const stripped = content.replace(/[#*`_~>\[\]()!-]/g, '').replace(/\n+/g, ' ').trim();
    return stripped.length > maxLen ? stripped.slice(0, maxLen) + '...' : stripped;
  };

  return (
    <article
      onClick={() => { audioService.playClick(); navigate(`/blog/${post.id}`); }}
      className="liquid-glass-card rounded-3xl p-6 border border-white/15 hover:border-sky-400/40 transition-all duration-300 cursor-pointer group hover:-translate-y-1.5 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-2 text-[11px] font-sans text-slate-400 mb-3">
          <Clock size={12} className="text-sky-400" />
          <span>{formatDate(post.createdAt)}</span>
        </div>

        <h3 className="text-base font-bold font-sans text-white mb-2 group-hover:text-sky-300 transition-colors line-clamp-2 leading-snug">
          {post.title}
        </h3>

        <p className="text-xs text-slate-300 font-sans leading-relaxed mb-5 line-clamp-3">
          {getSnippet(post.content)}
        </p>
      </div>

      <div className="space-y-3">
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="px-2.5 py-0.5 bg-sky-500/15 border border-sky-400/20 rounded-full text-[10px] font-medium text-sky-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1 text-[11px] font-sans text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
          Đọc tiếp
          <ChevronRight size={14} className="animate-pulse" />
        </div>
      </div>
    </article>
  );
};
