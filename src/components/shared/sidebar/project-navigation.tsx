import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  ClockIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import { LuListTodo } from "react-icons/lu";
import { Link, useLocation, useParams } from "react-router-dom";

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
    label: "스프린트",
    href: "sprints",
    icon: LuListTodo,
  },
  {
    label: "팀",
    href: "teams",
    icon: UsersIcon,
  },
  {
    label: "설정",
    href: "settings",
    icon: SettingsIcon,
  },
];

export default function ProjectNavigation() {
  const { workspaceId, projectId } = useParams();
  const { pathname } = useLocation();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {routes.map((r) => {
          const href =
            r.href === ""
              ? `/workspaces/${workspaceId}/projects/${projectId}`
              : `/workspaces/${workspaceId}/projects/${projectId}/${r.href}`;
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
