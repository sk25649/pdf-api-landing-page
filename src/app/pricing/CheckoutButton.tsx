"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createCheckoutSession } from "./actions";

interface CheckoutButtonProps {
  priceId: string;
  planName: string;
  isLoggedIn: boolean;
}

export function CheckoutButton({ priceId, planName, isLoggedIn }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    const result = await createCheckoutSession(priceId, planName);

    if ("error" in result) {
      toast.error(result.error);
      setIsLoading(false);
      return;
    }

    window.location.href = result.url;
  };

  return (
    <Button className="w-full" onClick={handleCheckout} disabled={isLoading}>
      {isLoading ? "Loading..." : isLoggedIn ? "Subscribe" : "Get Started"}
    </Button>
  );
}
