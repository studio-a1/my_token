
import React, { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity"
            onClick={onClose}
        >
            <div 
                className="aurora-border p-8 max-w-sm w-full text-center"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};
