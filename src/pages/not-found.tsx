import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full p-6 flex flex-col gap-4 items-center">
        <AlertTriangle className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground text-center">
          404: 해당 페이지를 찾을 수 없습니다.
        </p>
        <Button
          variant={"secondary"}
          size={"sm"}
          onClick={() => (window.location.href = "/")}
        >
          홈으로
        </Button>
      </div>
    </div>
  );
}
