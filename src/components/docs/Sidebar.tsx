"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Agent Skill", href: "#claude-code-skill" },
  {
    name: "MCP Server",
    href: "#mcp-server",
    children: [
      { name: "Claude Desktop", href: "#mcp-claude-desktop" },
      { name: "Cursor", href: "#mcp-cursor" },
      { name: "Available tools", href: "#mcp-tools" },
    ],
  },
  {
    name: "Node.js SDK",
    href: "#nodejs-sdk",
    children: [
      { name: "npm install", href: "#nodejs-sdk" },
      { name: "Credits monitoring", href: "#nodejs-sdk" },
      { name: "Error handling", href: "#nodejs-sdk" },
    ],
  },
  { name: "Quick Start", href: "#quick-start" },
  { name: "Authentication", href: "#authentication" },
  {
    name: "AI Agent Integration",
    href: "#ai-agents",
    children: [
      { name: "POST /api/register", href: "#ai-agents" },
      { name: "GET /api/topup", href: "#ai-agents" },
      { name: "X-Credits-Remaining", href: "#ai-agents" },
      { name: "USDC payment flow", href: "#ai-agents" },
    ],
  },
  {
    name: "Endpoints",
    href: "#endpoints",
    children: [
      { name: "POST /v1/pdf", href: "#post-v1-pdf" },
      { name: "POST /v1/screenshot", href: "#post-v1-screenshot" },
      { name: "GET /v1/usage", href: "#get-v1-usage" },
    ],
  },
  { name: "Options Reference", href: "#options-reference" },
  { name: "Error Codes", href: "#error-codes" },
  { name: "Code Examples", href: "#code-examples" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navigation.map((item) => (
        <div key={item.name}>
          <Link
            href={item.href}
            className={cn(
              "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
              pathname === item.href
                ? "bg-muted text-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.name}
          </Link>
          {item.children && (
            <div className="ml-4 mt-1 space-y-1">
              {item.children.map((child) => (
                <Link
                  key={child.name}
                  href={child.href}
                  className="block rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
