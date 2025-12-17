import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold">PDF API</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Transform your documents with ease
      </p>
      <Button className="mt-8" size="lg" asChild>
        <Link href="/login">Get Started</Link>
      </Button>
    </main>
  );
}
