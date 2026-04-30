import { useSession } from "@/features/user/query";

export default function MainPage() {
  const { data: session } = useSession();

  return (
    <div>MainPage{session ? `Welcome, ${session.name}` : "Welcome, Guest"}</div>
  );
}
