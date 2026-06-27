import LoginForm from "@/components/auth/LoginForm";
import SiteShell from "@/components/layout/SiteShell";

export default function LoginPage() {
  return (
    <SiteShell contentClassName="container flex items-center justify-center py-12">
      <LoginForm />
    </SiteShell>
  );
}
