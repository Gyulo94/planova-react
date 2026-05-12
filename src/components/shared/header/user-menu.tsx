import { useSession } from "@/features/user/query";
import { useLogout } from "@/features/auth/query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import CircleAvatar from "@/components/ui/circle-avatar";
import { LogOut, User as UserIcon } from "lucide-react";
import { DEFAULT_AVATAR } from "@/lib/constants";
import { useEditUserProfileDialogStore } from "@/features/user/store";

export function UserMenu() {
  const { data: session } = useSession();
  const { mutate: logout } = useLogout();
  const { onOpen } = useEditUserProfileDialogStore();

  if (!session) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative size-[32px] rounded-full p-0 border-2 border-background shadow-sm hover:shadow-md transition-all"
          >
            <CircleAvatar
              name={session.name || "User"}
              url={session.image || DEFAULT_AVATAR}
              isTooltipEnabled={false}
              className="size-full"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 rounded-lg p-2"
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-bold leading-none">{session.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="opacity-50" />
          <DropdownMenuItem
            className="rounded-lg cursor-pointer py-2.5 focus:bg-accent focus:text-accent-foreground"
            onClick={() => onOpen(session.id)}
          >
            <UserIcon className="mr-2 size-4" />
            <span>프로필 편집</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="rounded-lg cursor-pointer py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
            onClick={() => logout()}
          >
            <LogOut className="mr-2 size-4 text-destructive" />
            <span>로그아웃</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
