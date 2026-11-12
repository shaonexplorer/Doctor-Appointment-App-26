'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AssistantWorkspace } from '@/components/ai-assistant/assistant-workspace';

export function AssistantLauncher({ onExpand }: { onExpand: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && (
        <div className="fixed right-4 bottom-[88px] z-40 flex items-center gap-2 lg:bottom-6">
          <span className="border-border bg-card hidden rounded-lg border px-3 py-2 text-xs font-semibold shadow-sm sm:block">
            Ask AI Assistant
          </span>
          <Button
            className="size-12 rounded-full shadow-lg"
            aria-label="Open AI assistant"
            onClick={() => setOpen(true)}
          >
            <MessageCircle className="size-5" />
          </Button>
        </div>
      )}
      {open && (
        <div
          className="bg-foreground/20 fixed inset-0 z-50 sm:bg-transparent"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="MediBook AI Assistant"
            className="border-border bg-card absolute inset-0 flex flex-col overflow-hidden border shadow-2xl sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[min(700px,calc(100svh-48px))] sm:w-[min(440px,calc(100vw-48px))] sm:rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <AssistantWorkspace mode="panel" onClose={() => setOpen(false)} onExpand={onExpand} />
          </section>
        </div>
      )}
    </>
  );
}
