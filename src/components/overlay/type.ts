
// Định nghĩa các loại Overlay
export type OverlayType = 'dialog' | 'drawer' | 'sheet';

export interface OverlayOptions {
  id?: string;
  type?: OverlayType;
  containerId?: string; // ID của element cha nếu muốn render lồng (nested)
  title?: string;
  [key: string]: any; // Các props khác truyền vào component
}

export interface OverlayItem {
  id: string;
  Component: React.ComponentType<any>;
  options: OverlayOptions;
  resolve?: (value: any) => void; // Dùng nếu muốn await kết quả đóng dialog
}
