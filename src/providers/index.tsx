import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "./query-provider";
import { BrowserRouter } from "react-router-dom";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <BrowserRouter>
        {children}
        <Toaster />
      </BrowserRouter>
    </QueryProvider>
  );
}
