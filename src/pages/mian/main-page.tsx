import { Button } from "@/components/ui/button";
import { useSocialCallback } from "@/features/auth/hooks/use-social-callback";
import { useLogout } from "@/features/auth/query";
import { useSession } from "@/features/user/query";

export default function MainPage() {
  const { data: session } = useSession();
  const { mutate: logout } = useLogout();
  useSocialCallback();
  console.log(session);

  return (
    <>
      <div>
        MainPage{session ? `Welcome, ${session.name}` : "Welcome, Guest"}
      </div>
      <Button onClick={() => logout()}>로그아웃</Button>
    </>
  );
}
