import React from 'react';

interface SpinnerProps {
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'medium', className = '' }) => {
    const sizeClass = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12'
    }[size];

    return (
        <div className={`inline-block ${className}`} role="status">
            <div
                className={`${sizeClass} animate-spin rounded-full border-4 border-slate-700 border-t-slate-200 dark:border-slate-600 dark:border-t-slate-300`}
            />
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Spinner;