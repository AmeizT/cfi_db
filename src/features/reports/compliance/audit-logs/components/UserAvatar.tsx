import { getInitials } from "./audit-log-utils";


interface UserAvatarProps {
  email: string;
}

export function UserAvatar({ email }: UserAvatarProps) {
  return (
    <div className="w-6 h-6 rounded-full bg-theme-50 dark:bg-theme-800/50 text-theme-800 dark:text-theme-300 text-[10px] font-medium flex items-center justify-center shrink-0 select-none">
      {getInitials(email)}
    </div>
  );
}
