"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { regenerateApiKey } from "./actions";

interface ApiKeyCardProps {
  initialApiKey: string | null;
}

export function ApiKeyCard({ initialApiKey }: ApiKeyCardProps) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [showKey, setShowKey] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const maskKey = (key: string) => {
    if (key.length <= 14) return key;
    return `${key.slice(0, 10)}...${key.slice(-4)}`;
  };

  const handleCopy = async () => {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    toast.success("API key copied to clipboard");
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    const result = await regenerateApiKey();

    if ("error" in result) {
      toast.error(result.error);
    } else {
      setApiKey(result.key);
      toast.success("New API key generated");
    }

    setIsRegenerating(false);
    setDialogOpen(false);
  };

  return (
    <Card className="flex h-full w-full max-w-md flex-col">
      <CardHeader>
        <CardTitle>API Key</CardTitle>
        <CardDescription>
          Use this key to authenticate your API requests
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-4">
        {apiKey ? (
          <>
            <div className="flex items-center gap-2">
              <code className="min-w-0 flex-1 break-all rounded bg-muted px-3 py-2 font-mono text-sm">
                {showKey ? apiKey : maskKey(apiKey)}
              </code>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowKey(!showKey)}
                title={showKey ? "Hide key" : "Show key"}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                title="Copy key"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-auto w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate API Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Regenerate API Key?</DialogTitle>
                  <DialogDescription>
                    This will invalidate your current key. Any applications using
                    the current key will stop working immediately.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                  >
                    {isRegenerating ? "Regenerating..." : "Continue"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>No API key found</p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4">Generate API Key</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate API Key</DialogTitle>
                  <DialogDescription>
                    Create a new API key to authenticate your requests.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                  >
                    {isRegenerating ? "Generating..." : "Generate"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
