import React, { useState } from 'react';
import { Plus, Loader2, Trash2, Save, Tag, Calendar, Eye, Pencil } from 'lucide-react';
import type { BlogPost, CreateBlogInput } from '../../types/blog';
import { audioService } from '../../services/audioService';
import { Drawer } from '../common/Drawer';
import { BlogForm } from './BlogForm';

interface BlogTabProps {
  blogPosts: BlogPost[];
  loadingBlog: boolean;
  onDeleteBlog: (id: string) => void;
  onCreateBlog: (input: CreateBlogInput) => Promise<void>;
  onUpdateBlog: (id: string, input: CreateBlogInput) => Promise<void>;
}

export const BlogTab: React.FC<BlogTabProps> = ({
  blogPosts,
  loadingBlog,
  onDeleteBlog,
  onCreateBlog,
  onUpdateBlog,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const handleOpenCreate = () => {
    audioService.playClick();
    setEditingPost(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    audioService.playClick();
    setEditingPost(post);
    setIsDrawerOpen(true);
  };

  const handleSaveBlog = async (input: CreateBlogInput) => {
    if (editingPost) {
      await onUpdateBlog(editingPost.id, input);
    } else {
      await onCreateBlog(input);
    }
    setIsDrawerOpen(false);
    setEditingPost(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold font-sans text-white">Quản Lý Bài Viết Blog (Firestore)</h2>
          <p className="text-xs font-sans text-slate-400">Danh sách bài viết được lưu trữ và cập nhật thời gian thực từ Firestore.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="liquid-glass-accent-btn px-5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus size={14} />
          Đăng Bài Viết Mới
        </button>
      </div>

      {loadingBlog ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={32} className="text-sky-400 animate-spin" />
        </div>
      ) : blogPosts.length === 0 ? (
        <div className="liquid-glass rounded-3xl p-10 text-center text-slate-400 text-xs">
          Chưa có bài viết nào trên Firestore. Nhấn nút "Đăng Bài Viết Mới" để bắt đầu!
        </div>
      ) : (
        <div className="space-y-3">
          {blogPosts.map((post) => (
            <div key={post.id} className="liquid-glass rounded-2xl p-4 border border-white/12 flex items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-semibold text-sky-400 bg-sky-500/10 border border-sky-400/20 px-2 py-0.5 rounded-full">
                    {post.category || 'Kỹ Thuật'}
                  </span>
                  {post.published === false && (
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                      Draft (Bản Nháp)
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white truncate">{post.title}</h3>

                {post.summary && (
                  <p className="text-xs text-slate-300 line-clamp-1">{post.summary}</p>
                )}

                <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} className="text-sky-400" />
                    {post.readTime || '3 phút đọc'}
                  </span>
                  {post.tags && post.tags.length > 0 && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <Tag size={11} className="text-purple-400" />
                      {post.tags.map(t => `#${t}`).join(' ')}
                    </span>
                  )}
                  {post.views !== undefined && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <Eye size={11} /> {post.views} lượt xem
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEdit(post)}
                  className="p-2 text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 rounded-xl cursor-pointer transition-all"
                  title="Chỉnh sửa bài viết"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => onDeleteBlog(post.id)}
                  className="p-2 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl cursor-pointer transition-all"
                  title="Xoá bài viết khỏi Firestore"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3-LAYOUT DRAWER FOR BLOG */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => { setIsDrawerOpen(false); setEditingPost(null); }}
        title={editingPost ? 'Chỉnh Sửa Bài Viết' : 'Đăng Bài Viết Mới'}
        subtitle={editingPost ? `Đang chỉnh sửa bài viết: ${editingPost.title}` : 'Cấu hình đầy đủ thông tin chuẩn SEO cho bài viết Firestore'}
        footer={
          <>
            <button
              type="button"
              onClick={() => { setIsDrawerOpen(false); setEditingPost(null); }}
              className="liquid-glass-pill px-5 py-2 rounded-2xl text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
            >
              Huỷ
            </button>
            <button
              type="submit"
              form="blog-drawer-form"
              className="liquid-glass-accent-btn px-6 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <Save size={14} />
              {editingPost ? 'Lưu Thay Đổi' : 'Đăng Bài Viết'}
            </button>
          </>
        }
      >
        <BlogForm
          formId="blog-drawer-form"
          initialData={editingPost}
          onSave={handleSaveBlog}
          onCancel={() => { setIsDrawerOpen(false); setEditingPost(null); }}
        />
      </Drawer>
    </div>
  );
};
