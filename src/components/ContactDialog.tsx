import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";
import type { ReactNode } from "react";

export function ContactDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Text us for a quote</DialogTitle>
          <DialogDescription>Fastest way to reach BrightLine. Pick either owner.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 pt-2">
          <a
            href="sms:6162787392"
            className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-accent hover:shadow-md hover:-translate-y-0.5"
          >
            <div>
              <div className="font-semibold text-foreground">Text Aram</div>
              <div className="text-sm text-muted-foreground">616-278-7392</div>
            </div>
            <MessageSquare className="h-5 w-5 text-navy transition-transform group-hover:scale-110" />
          </a>
          <a
            href="sms:6163870268"
            className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-accent hover:shadow-md hover:-translate-y-0.5"
          >
            <div>
              <div className="font-semibold text-foreground">Text Ethan</div>
              <div className="text-sm text-muted-foreground">616-387-0268</div>
            </div>
            <MessageSquare className="h-5 w-5 text-navy transition-transform group-hover:scale-110" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
