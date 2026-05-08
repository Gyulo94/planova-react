import { useEffect } from "react";
import { useLayoutStore } from "@/features/layout/store/use-layout-store";

export function useSetTitle(title: string, description?: string) {
  const { setTitle } = useLayoutStore();

  useEffect(() => {
    setTitle(title, description);

    return () => setTitle("");
  }, [title, description, setTitle]);
}
