"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function AuthStatus() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <span className="text-sm text-muted-foreground">در حال بررسی...</span>;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost">
          <Link href="/login">ورود</Link>
        </Button>
        <Button asChild>
          <Link href="/register">ثبت نام</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/account" className="text-sm font-medium text-foreground hover:text-primary">
        {user.username}
      </Link>
      <Button type="button" variant="secondary" onClick={logout}>
        خروج
      </Button>
    </div>
  );
}
