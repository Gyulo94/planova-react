import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLocalStorage } from "@/hooks/use-local-storage";

function normalizeProjectId(value?: string | null): string {
  if (!value || value === "undefined" || value === "null" || value === "none") {
    return "";
  }
  return value;
}

export function useSelectedProject() {
  const { workspaceId, projectId } = useParams();

  const storageKey = workspaceId
    ? `selected-project:${workspaceId}`
    : "selected-project";

  const { value: persistedProjectId, setValue: setPersistedProjectId } =
    useLocalStorage<string>(storageKey, "");

  const normalizedPersistedProjectId = normalizeProjectId(persistedProjectId);
  const selectedProjectId =
    normalizeProjectId(projectId) || normalizedPersistedProjectId;

  useEffect(() => {
    if (!workspaceId) return;

    const normalizedProjectId = normalizeProjectId(projectId);
    if (!normalizedProjectId) {
      return;
    }

    setPersistedProjectId(normalizedProjectId);
  }, [projectId, setPersistedProjectId, workspaceId]);

  return {
    workspaceId,
    selectedProjectId,
  };
}
