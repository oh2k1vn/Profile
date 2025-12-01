import React from 'react';

interface OverlayContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  containerId: string; // Bắt buộc phải có ID để Portal tìm thấy
}

export const OverlayContainer: React.FC<OverlayContainerProps> = ({
  containerId,
  children,
  className,
  ...props
}) => {
  return (
    <div
      id={containerId}
      className={`relative w-full h-full overflow-hidden ${className || ''}`}
      {...props}
    >
      {children}
      {/* Các Dialog con sẽ được portal vào ngay tại đây */}
    </div>
  );
};
