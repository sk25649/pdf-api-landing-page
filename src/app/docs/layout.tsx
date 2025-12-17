"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/docs/Sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile menu button */}
      <div className="mb-4 lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <X className="mr-2 h-4 w-4" />
          ) : (
            <Menu className="mr-2 h-4 w-4" />
          )}
          Menu
        </Button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar - hidden on mobile unless open */}
        <aside
          className={`${
            sidebarOpen ? "block" : "hidden"
          } w-full shrink-0 lg:block lg:w-64`}
        >
          <div className="sticky top-20">
            <Sidebar />
          </div>
        </aside>

        {/* Main content */}
        <main className={`min-w-0 flex-1 ${sidebarOpen ? "hidden lg:block" : ""}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
