'use client';

import { useLogout } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const logoutMutation = useLogout();

  return (
    <Button
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
      className="bg-red-500 hover:bg-red-600 text-white"
    >
      {logoutMutation.isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}
