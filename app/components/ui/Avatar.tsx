import React from "react";

interface AvatarProps {
    src?: string | null;
    alt?: string;
    fallback: string;
    className?: string;
}

export const Avatar = ({ src, alt, fallback, className = "" }: AvatarProps) => {
    return (
        <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted ${className}`}>
            {src ? (
                <img src={src} alt={alt || "Avatar"} className="aspect-square h-full w-full object-cover" />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground font-medium text-sm">
                    {fallback}
                </div>
            )}
        </div>
    );
};
