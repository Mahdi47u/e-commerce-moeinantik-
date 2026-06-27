import RegisterForm from "@/components/auth/RegisterForm";
import SiteShell from "@/components/layout/SiteShell";

export default function RegisterPage() {
  return (
    <SiteShell contentClassName="container flex items-center justify-center py-12">
      <RegisterForm />
    </SiteShell>
  );
}
