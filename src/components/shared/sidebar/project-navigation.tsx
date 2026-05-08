import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useFindProjectMembers } from "@/features/project-member/query";
import { useSelectedProject } from "@/features/project/hook";
import { useSession } from "@/features/user/query";
import {
  ClockIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UsersIcon,
  Target,
  MilestoneIcon,
} from "lucide-react";
import { LuListTodo } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";

const routes = [
  {
    label: "대시보드",
    href: "",
    icon: LayoutDashboardIcon,
  },
  {
    label: "타임라인",
    href: "timelines",
    icon: ClockIcon,
  },
  {
    label: "작업",
    href: "tasks",
    icon: LuListTodo,
  },
  {
    label: "에픽",
    href: "epics",
    icon: Target,
  },
  {
    label: "마일스톤",
    href: "milestones",
    icon: MilestoneIcon,
  },
  {
    label: "팀",
    href: "team",
    icon: UsersIcon,
  },
  {
    label: "설정",
    href: "settings",
    icon: SettingsIcon,
  },
];

export default function ProjectNavigation() {
  const { workspaceId, selectedProjectId } = useSelectedProject();
  const { pathname } = useLocation();
  const { data: projectMembers } = useFindProjectMembers(selectedProjectId);
  const { data: session } = useSession();

  if (!workspaceId || !selectedProjectId) {
    return null;
  }

  const myRole = projectMembers?.find(
    (member) => member.userId === session?.id,
  )?.role;
  const visibleRoutes = routes.filter(
    (route) => route.href !== "settings" || myRole === "OWNER",
  );

  return (
    <SidebarGroup>
      <SidebarMenu>
        {visibleRoutes.map((r) => {
          const href =
            r.href === ""
              ? `/workspaces/${workspaceId}/projects/${selectedProjectId}`
              : `/workspaces/${workspaceId}/projects/${selectedProjectId}/${r.href}`;
          const isActive = pathname === href;
          return (
            <SidebarMenuItem
              key={r.label}
              className={`${
                isActive ? "bg-sidebar-accent" : "text-muted-foreground"
              } rounded-md`}
            >
              <SidebarMenuButton asChild className="px-2 py-1.5">
                <Link to={href}>
                  <r.icon className="mr-2 size-4" />
                  {r.label}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
