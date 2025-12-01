import { confirm, OverlayRender, overlayStore } from '@/components/overlay';
import { createFileRoute } from '@tanstack/react-router';
import { AlertCircle, ArrowRight, Layout, Settings, Trash2, User, X } from 'lucide-react';

export const Route = createFileRoute('/')({ component: App });

// --- 1. COMPONENT: SIMPLE SHEET (Trượt từ dưới lên) ---
const DemoSheet = ({ close }: any) => {
  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Settings className="w-5 h-5" /> Cấu hình Mobile
        </h2>
        <button onClick={close} className="p-2 hover:bg-gray-100 rounded-full">
          <X size={20} />
        </button>
      </div>
      <div className="space-y-4 overflow-y-auto flex-1">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold">Setting Item {i}</h3>
            <p className="text-sm text-gray-500">Mô tả cấu hình chi tiết cho mục này...</p>
          </div>
        ))}
      </div>
      <div className="pt-4 border-t mt-4">
        <button onClick={close} className="w-full py-3 bg-black text-white rounded-lg font-medium">
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
};

// --- 2. COMPONENT: SIMPLE DIALOG (Hiện giữa màn hình) ---
const DemoDialog = ({ close, title, message }: any) => {
  return (
    <div className="p-6 text-center">
      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle size={24} />
      </div>
      <h3 className="text-lg font-bold mb-2">{title || 'Thông báo'}</h3>
      <p className="text-gray-500 mb-6">{message || 'Đây là nội dung mặc định của Dialog.'}</p>
      <div className="flex gap-3 justify-center">
        <button onClick={close} className="px-4 py-2 border rounded-md hover:bg-gray-50 transition">
          Đóng
        </button>
        <button
          onClick={close}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Xác nhận
        </button>
      </div>
    </div>
  );
};

// --- 3. COMPONENT: NESTED DRAWER (Case phức tạp) ---
// Đây là component quan trọng để test case lồng nhau
const ComplexDrawer = ({ id, close }: any) => {
  // ID định danh cho vùng chứa bên trong drawer này
  const INTERNAL_CONTAINER_ID = `drawer-inner-container-${id}`;

  const openNestedDialog = () => {
    overlayStore.open(DemoDialog, {
      containerId: INTERNAL_CONTAINER_ID, // <--- MAGIC: Chỉ định render vào trong vùng này
      type: 'dialog',
      title: 'Dialog Lồng Nhau',
      message:
        'Chú ý: Tôi chỉ nằm gọn trong phạm vi của cái Drawer này thôi, không che hết màn hình!',
    });
  };

  const openNestedSheet = () => {
    overlayStore.open(DemoSheet, {
      containerId: INTERNAL_CONTAINER_ID,
      type: 'sheet',
    });
  };

  const handleDeleteClick = async () => {
    await confirm({
      containerId: INTERNAL_CONTAINER_ID,
      title: 'Xóa người dùng?',
      description: `Bạn có chắc muốn xóa vĩnh viễn user? Hành động này không thể hoàn tác.`,
      confirmText: 'Xóa ngay',
      cancelText: 'Thôi, giữ lại',
      type: 'warning', // Hiện màu đỏ cảnh báo
      onConfirm: () => console.log('Xóa người dùng'),
      onCancel: () => console.log('Hủy xóa'),
    });
  };

  return (
    <div id={INTERNAL_CONTAINER_ID} className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-white z-10">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <User className="w-5 h-5" /> User Profile (Drawer)
        </h2>
        <button onClick={close}>
          <X />
        </button>
      </div>

      {/* BODY: Đây là nơi chứa Dialog con */}
      {/* QUAN TRỌNG: Phải có id và position relative */}
      <div className="flex-1 relative overflow-hidden bg-gray-50 p-6 flex flex-col gap-4">
        <div className="bg-white p-4 rounded shadow-sm border">
          <h3 className="font-semibold mb-2">Thông tin cá nhân</h3>
          <p className="text-gray-600 text-sm mb-4">
            Vùng màu xám này chính là <code>containerId</code>. Khi bạn mở Dialog lồng, nó sẽ dùng
            Portal chui vào div này.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={openNestedDialog}
              className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 text-sm flex items-center gap-2"
            >
              <Layout size={16} />
              Mở Nested Dialog
            </button>

            <button
              onClick={openNestedSheet}
              className="px-4 py-2 bg-emerald-600 text-white rounded shadow hover:bg-emerald-700 text-sm flex items-center gap-2"
            >
              <Layout size={16} />
              Mở Nested Sheet
            </button>

            <button
              onClick={handleDeleteClick}
              className="text-red-600 hover:bg-red-50 p-2 rounded"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Dummy Content để test scroll */}
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>

      <div className="p-4 border-t bg-white z-10">
        <button onClick={close} className="w-full py-2 border rounded hover:bg-gray-50">
          Đóng Drawer
        </button>
      </div>
    </div>
  );
};

function App() {
  // Handlers mở overlay thường (Global - Body)
  const openGlobalDialog = () => {
    overlayStore.open(DemoDialog, {
      type: 'dialog',
      title: 'Global Dialog',
      message: 'Tôi là dialog bình thường, đè lên toàn bộ trang web.',
    });
  };

  const openGlobalSheet = () => {
    overlayStore.open(DemoSheet, { type: 'sheet' });
  };

  const openGlobalDrawer = () => {
    overlayStore.open(ComplexDrawer, {
      type: 'drawer',
      width: 'w-[480px]', // Custom width
    });
  };

  const handleDeleteClick = async () => {
    await confirm({
      title: 'Xóa người dùng?',
      description: `Bạn có chắc muốn xóa vĩnh viễn user? Hành động này không thể hoàn tác.`,
      confirmText: 'Xóa ngay',
      cancelText: 'Thôi, giữ lại',
      type: 'warning', // Hiện màu đỏ cảnh báo
      onConfirm: () => console.log('Xóa người dùng'),
      onCancel: () => console.log('Hủy xóa'),
    });
  };
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Overlay System Test Lab</h1>
            <p className="text-gray-500">
              Kiểm thử hệ thống Dialog, Drawer, Sheet và Nested Context
            </p>
          </div>

          <button onClick={handleDeleteClick} className="text-red-600 hover:bg-red-50 p-2 rounded">
            <Trash2 size={18} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Dialog */}
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <AlertCircle size={20} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Standard Dialog</h3>
              <p className="text-sm text-gray-500 mb-4">
                Dialog hiển thị ở giữa màn hình (Fixed center).
              </p>
              <button
                onClick={openGlobalDialog}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Open Dialog
              </button>
            </div>

            {/* Card 2: Sheet */}
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-4">
                <Layout size={20} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Bottom Sheet</h3>
              <p className="text-sm text-gray-500 mb-4">
                Sheet trượt từ dưới lên, dùng cho mobile view.
              </p>
              <button
                onClick={openGlobalSheet}
                className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                Open Sheet
              </button>
            </div>

            {/* Card 3: Drawer (Key Feature) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border ring-2 ring-indigo-50 hover:shadow-md transition relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] px-2 py-1 rounded-bl">
                Focus
              </div>
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <User size={20} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Drawer & Nested</h3>
              <p className="text-sm text-gray-500 mb-4">
                Drawer trượt phải + Test case mở Dialog con bên trong.
              </p>
              <button
                onClick={openGlobalDrawer}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
              >
                Test Nested Case <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <OverlayRender />
    </>
  );
}
