import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "./query-provider";
import { BrowserRouter } from "react-router-dom";
import ModalProvider from "./modal-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <BrowserRouter>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <ModalProvider />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryProvider>
  );
}
