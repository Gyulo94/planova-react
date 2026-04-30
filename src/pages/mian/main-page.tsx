import { useSocialCallback } from "@/features/auth/hooks/use-social-callback";
import { useSession } from "@/features/user/query";

export default function MainPage() {
  const { data: session } = useSession();
  useSocialCallback();
  console.log(session);

  return (
    <div>MainPage{session ? `Welcome, ${session.name}` : "Welcome, Guest"}</div>
  );
}
