import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboardIcon, SettingsIcon, UsersIcon } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

const routes = [
  {
    label: "대시보드",
    href: "",
    icon: LayoutDashboardIcon,
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

export default function WorkspaceNavigation() {
  const { workspaceId } = useParams();
  const { pathname } = useLocation();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {routes.map((r) => {
          const href =
            r.href === ""
              ? `/workspaces/${workspaceId}`
              : `/workspaces/${workspaceId}/${r.href}`;
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
