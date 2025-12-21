import React from "react";

interface AvatarProps {
    src?: string | null;
    alt?: string;
    fallback: string;
    className?: string;
}

export const Avatar = ({ src, alt, fallback, className = "" }: AvatarProps) => {
    return (
        <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-700 ${className}`}>
            {src ? (
                <img src={src} alt={alt || "Avatar"} className="aspect-square h-full w-full object-cover" />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm uppercase">
                    {fallback}
                </div>
            )}
        </div>
    );
};
