// Type
import type { InitialAvatarProps } from "@/types/pagelayout";

export function InitialAvatar({ name, avatarUrl, sizeClassName, textClassName, wrapperClassName = "" }: InitialAvatarProps) {
  // Get the first letter of username to make initial avatar
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  
  return (
    <div className={`avatar-ring ${wrapperClassName}`.trim()}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className={`${sizeClassName} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${sizeClassName} ${textClassName} rounded-full bg-linear-to-br from-gray-700 to-gray-800 flex items-center justify-center font-bold`}
        >
          {initial}
        </div>
      )}
    </div>
  );
}
