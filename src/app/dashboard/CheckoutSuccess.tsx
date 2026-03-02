"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { getCurrentPlan } from "./actions";

export function CheckoutSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isCheckoutSuccess = searchParams.get("checkout") === "success";
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isCheckoutSuccess) return;

    toast.success("Payment successful! Activating your plan...");
    router.replace("/dashboard");

    let attempts = 0;
    const maxAttempts = 8;

    const poll = async () => {
      attempts++;
      const plan = await getCurrentPlan();

      if (plan && plan !== "free") {
        router.refresh();
        return;
      }

      if (attempts < maxAttempts) {
        timerRef.current = setTimeout(poll, 1500);
      } else {
        // Webhook took too long — refresh anyway
        router.refresh();
      }
    };

    timerRef.current = setTimeout(poll, 1500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isCheckoutSuccess, router]);

  return null;
}
