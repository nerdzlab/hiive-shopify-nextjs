import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const Redirect = ({ to }: { to: string }) => {
  const router = useRouter();

  useEffect(() => {
    router.replace(to);
  }, [to, router]);

  return null;
};
