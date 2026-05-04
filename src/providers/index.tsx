import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "./query-provider";
import { BrowserRouter } from "react-router-dom";
import ModalProvider from "./modal-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <BrowserRouter>
        <TooltipProvider>
          {children}
          <ModalProvider />
          <Toaster />
        </TooltipProvider>
      </BrowserRouter>
    </QueryProvider>
  );
}
