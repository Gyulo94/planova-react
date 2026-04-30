import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { socialLogin } from "../api";

export default function SocialLogin({ provider }: { provider: string }) {
  async function handleSocialLogin() {
    await socialLogin(provider);
  }

  return (
    <Button
      variant="outline"
      className="w-full cursor-pointer"
      onClick={handleSocialLogin}
    >
      {provider === "kakao" ? (
        <p className="flex items-center gap-2">
          <Icon.kakao /> 카카오
        </p>
      ) : (
        <p className="flex items-center gap-2">
          <Icon.google /> 구글
        </p>
      )}
    </Button>
  );
}
