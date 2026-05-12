import { Route, Routes } from "react-router-dom";
import {
  EmailFormPage,
  JoinWorkspacePage,
  LoginPage,
  MainPage,
  NotFoundPage,
  ProjectDashboardPage,
  RegisterPage,
  ResetPasswordPage,
  WorkspaceDashboardPage,
  WorkspacePage,
  RegisterVerifyMailPage,
  WorkspaceTeamPage,
  WorkspaceSettingPage,
  ProjectTeamPage,
  ProjectTasksPage,
  TaskDetailPage,
  ProjectTimelinePage,
  ProjectSettingPage,
  ProjectEpicPage,
  ProjectMilestonePage,
} from "./pages";
import {
  AuthRoute,
  PrivateRoute,
  ProjectRoute,
  WorkspaceOwnerRoute,
  WorkspaceRoute,
} from "./routes";
import RootLayout from "./components/shared/layout/root-layout";

function App() {
  return (
    <Routes>
      <Route element={<AuthRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/:token" element={<RegisterVerifyMailPage />} />
        <Route path="/reset-password" element={<EmailFormPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      {/* 인증된 유저만 접근 가능한 라우트 설정 */}
      <Route element={<PrivateRoute />}>
        <Route path="/workspaces/new" element={<WorkspacePage />} />
        <Route
          path="/workspaces/:workspaceId/join/:inviteCode"
          element={<JoinWorkspacePage />}
        />
        <Route element={<RootLayout />}>
          {/* 워크스페이스 권한이 있는 유저만 접근 가능하도록 라우트 설정 */}
          <Route element={<WorkspaceRoute />}>
            <Route
              path="/workspaces/:workspaceId"
              element={<WorkspaceDashboardPage />}
            />
            <Route
              path="/workspaces/:workspaceId/team"
              element={<WorkspaceTeamPage />}
            />

            {/* 워크스페이스 소유자만 접근 가능하도록 라우트 설정 */}
            <Route element={<WorkspaceOwnerRoute />}>
              <Route
                path="/workspaces/:workspaceId/settings"
                element={<WorkspaceSettingPage />}
              />
              <Route
                path="/workspaces/:workspaceId/projects/:projectId/settings"
                element={<ProjectSettingPage />}
              />
            </Route>

            {/* 프로젝트 권한이 있는 유저만 접근 가능하도록 라우트 설정 */}
            <Route element={<ProjectRoute />}>
              <Route
                path="/workspaces/:workspaceId/projects/:projectId"
                element={<ProjectDashboardPage />}
              />
              <Route
                path="/workspaces/:workspaceId/projects/:projectId/tasks"
                element={<ProjectTasksPage />}
              />
              <Route
                path="/workspaces/:workspaceId/projects/:projectId/timelines"
                element={<ProjectTimelinePage />}
              />
              <Route
                path="/workspaces/:workspaceId/projects/:projectId/tasks/:taskId"
                element={<TaskDetailPage />}
              />
              <Route
                path="/workspaces/:workspaceId/projects/:projectId/epics"
                element={<ProjectEpicPage />}
              />
              <Route
                path="/workspaces/:workspaceId/projects/:projectId/milestones"
                element={<ProjectMilestonePage />}
              />
              <Route
                path="/workspaces/:workspaceId/projects/:projectId/team"
                element={<ProjectTeamPage />}
              />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<MainPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
