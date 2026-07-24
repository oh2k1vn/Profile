export interface BlogPost {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: { seconds: number; nanoseconds: number };
  updatedAt: { seconds: number; nanoseconds: number };
  isMock?: boolean;
}

export interface BlogEditorProps {
  onClose: () => void;
  onSaved: () => void;
}
