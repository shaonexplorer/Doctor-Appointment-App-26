'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentProps, KeyboardEvent } from 'react';
import {
  Activity,
  ArrowUp,
  Clock3,
  FilePlus2,
  History,
  LoaderCircle,
  Maximize2,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GenUIRenderer } from '@/components/ai-assistant/gen-ui/GenUIRenderer';
import {
  createMockConfirmation,
  createReview,
  demoDoctors,
  respondToPatient,
} from '@/lib/agent/mock-agent';
import { validateGenUIBlocks } from '@/lib/agent/validate-gen-ui';
import type {
  AgentStatus,
  AssistantMessage,
  ConversationSummary,
  GenUIBlock,
} from '@doctor-appointment-app/shared';

const suggestions = [
  'Find me a cardiologist',
  'What appointments do I have this week?',
  'I need to reschedule my appointment',
  'What should I bring to my visit?',
];
const starter: AssistantMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Hello! I can help you explore doctors, understand appointment options, and navigate your patient portal. What would you like help with today?',
  createdAt: 'Now',
};

export function AssistantWorkspace({
  mode = 'workspace',
  onClose,
  onExpand,
}: {
  mode?: 'workspace' | 'panel';
  onClose?: () => void;
  onExpand?: () => void;
}) {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<AgentStatus>('idle');
  const [query, setQuery] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [threadId, setThreadId] = useState('thread-demo-1');
  const [conversations, setConversations] = useState<ConversationSummary[]>([
    { id: 'thread-demo-1', title: 'Find a cardiologist', updatedAt: 'Today' },
    { id: 'thread-demo-2', title: 'Upcoming appointments', updatedAt: 'Yesterday' },
    { id: 'thread-demo-3', title: 'Preparing for a visit', updatedAt: 'Sep 18' },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPanel = mode === 'panel';
  const filteredConversations = useMemo(
    () => conversations.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())),
    [conversations, query]
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, status]);

  const appendMessage = (message: AssistantMessage) =>
    setMessages((current) => [...current, message]);
  const addAssistant = (
    content: string,
    ui?: GenUIBlock[],
    nextStatus: AgentStatus = 'completed'
  ) => {
    appendMessage({
      id: crypto.randomUUID(),
      role: 'assistant',
      content,
      createdAt: 'Now',
      ui,
      status: nextStatus,
    });
  };

  const sendMessage = async (value = input) => {
    const trimmed = value.trim();
    if (!trimmed || status === 'thinking' || status === 'tool_running') return;
    const userMessage: AssistantMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      createdAt: 'Now',
    };
    appendMessage(userMessage);
    setInput('');
    setStatus('thinking');
    setConversations((items) =>
      items.map((item) =>
        item.id === threadId && item.title.startsWith('New conversation')
          ? { ...item, title: trimmed.slice(0, 34) }
          : item
      )
    );
    try {
      const response = await respondToPatient({
        threadId,
        message: trimmed,
        uiContext: { currentPage: 'patient-assistant' },
      });
      setThreadId(response.threadId);
      setStatus(
        response.status === 'awaiting_confirmation' ? 'awaiting_confirmation' : 'completed'
      );
      addAssistant(
        response.message ?? "I'm here to help with your appointment journey.",
        validateGenUIBlocks(response.ui),
        response.status
      );
    } catch {
      setStatus('error');
      addAssistant("I couldn't complete that demo request. Please try again.", undefined, 'error');
    }
  };

  const handleSelectDoctor = async (doctor: string) => {
    appendMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content: `I'd like to learn more about ${doctor}.`,
      createdAt: 'Now',
    });
    setStatus('tool_running');
    const response = await respondToPatient({ threadId, message: `book with ${doctor}` });
    setStatus('completed');
    addAssistant(response.message ?? 'Here are the details.', validateGenUIBlocks(response.ui));
  };

  const handleSelectSlot = (doctor: string, time: string) => {
    appendMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content: `I'd like ${time}.`,
      createdAt: 'Now',
    });
    addAssistant(
      'Please review the details before confirming. This is a demonstration only.',
      [createReview(doctor, time)],
      'awaiting_confirmation'
    );
    setStatus('awaiting_confirmation');
  };

  const handleConfirmBooking = (review: Extract<GenUIBlock, { type: 'appointment_review' }>) => {
    addAssistant(
      'This demo shows the confirmation state only; it has not created a real booking.',
      [createMockConfirmation(review)],
      'completed'
    );
    setStatus('completed');
  };

  const handleConfirmCancellation = () => {
    addAssistant(
      'Demo cancellation acknowledged. Your real appointment has not been changed.',
      undefined,
      'completed'
    );
    setStatus('completed');
  };

  const startNewConversation = () => {
    const id = crypto.randomUUID();
    setThreadId(id);
    setMessages([]);
    setStatus('idle');
    setConversations((items) => [{ id, title: 'New conversation', updatedAt: 'Now' }, ...items]);
    setHistoryOpen(false);
  };

  const selectConversation = (conversation: ConversationSummary) => {
    setThreadId(conversation.id);
    setMessages(
      conversation.id === 'thread-demo-1'
        ? [
            starter,
            {
              id: 'demo-history-1',
              role: 'user',
              content: 'Find me a cardiologist',
              createdAt: 'Today',
            },
            {
              id: 'demo-history-2',
              role: 'assistant',
              content: 'Here are cardiology providers from the demo directory.',
              createdAt: 'Today',
              ui: [
                {
                  type: 'doctor_results',
                  data: demoDoctors.filter((doctor) => doctor.specialty === 'Cardiology'),
                },
              ],
            },
          ]
        : [
            starter,
            {
              id: `${conversation.id}-intro`,
              role: 'assistant',
              content: `This is a demo preview of "${conversation.title}". Ask a follow-up to continue.`,
              createdAt: conversation.updatedAt,
            },
          ]
    );
    setStatus('idle');
    setHistoryOpen(false);
  };

  const deleteConversation = (id: string) => {
    setConversations((items) => items.filter((item) => item.id !== id));
    if (id === threadId) {
      setThreadId(crypto.randomUUID());
      setMessages([]);
      setStatus('idle');
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      if (event.nativeEvent.isComposing || event.keyCode === 229) return;
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <div
      className={`border-border bg-card flex min-h-0 overflow-hidden border shadow-sm ${isPanel ? 'h-full rounded-none border-0' : 'h-[calc(100svh-76px)] min-h-[620px] rounded-2xl'}`}
    >
      {!isPanel && (
        <aside className="border-border bg-background/70 hidden w-[250px] shrink-0 flex-col border-r p-4 lg:flex">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">Conversations</h2>
            <Button
              variant="ghost"
              size="icon"
              aria-label="New conversation"
              onClick={startNewConversation}
            >
              <FilePlus2 />
            </Button>
          </div>
          <Button className="mt-3 w-full" variant="outline" onClick={startNewConversation}>
            <FilePlus2 data-icon="inline-start" />
            New conversation
          </Button>
          <div className="relative mt-4">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search conversations"
              aria-label="Search conversations"
              className="border-border bg-background focus-visible:ring-ring h-9 w-full rounded-lg border pr-3 pl-9 text-xs outline-none focus-visible:ring-2"
            />
          </div>
          <div className="mt-4 flex flex-col gap-1">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                selected={conversation.id === threadId}
                onSelect={selectConversation}
                onDelete={deleteConversation}
              />
            ))}
          </div>
          <div className="border-border bg-card mt-auto rounded-xl border p-3">
            <div className="flex items-center gap-2 text-xs font-bold">
              <ShieldCheck className="text-primary size-4" />
              Privacy first
            </div>
            <p className="text-muted-foreground mt-2 text-[11px] leading-relaxed">
              Demo conversations stay in this page session and are not saved.
            </p>
          </div>
        </aside>
      )}

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="border-border flex h-[68px] shrink-0 items-center justify-between border-b px-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="bg-primary text-primary-foreground grid size-10 shrink-0 place-items-center rounded-xl">
              <Sparkles className="size-5" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold">MediBook Assistant</h2>
              <p className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                <span className="size-1.5 rounded-full bg-[#36ae8a]" />
                Available · appointment navigation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {!isPanel && (
              <Button
                className="lg:hidden"
                variant="ghost"
                size="icon"
                aria-label="Conversation history"
                onClick={() => setHistoryOpen(true)}
              >
                <History />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Start a new conversation"
              onClick={startNewConversation}
            >
              <FilePlus2 />
            </Button>
            {isPanel && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Expand assistant"
                  onClick={onExpand}
                >
                  <Maximize2 />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Close assistant" onClick={onClose}>
                  <X />
                </Button>
              </>
            )}
          </div>
        </header>
        <div className="flex min-h-0 flex-1">
          <div
            ref={scrollRef}
            className="flex min-w-0 flex-1 flex-col overflow-y-auto scroll-smooth px-3 py-4 sm:px-6 sm:py-6"
            aria-live="polite"
          >
            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5">
              {messages.length === 0 && <Welcome onPrompt={(prompt) => void sendMessage(prompt)} />}
              {messages.map((message) => (
                <MessageView
                  key={message.id}
                  message={message}
                  onSelectDoctor={handleSelectDoctor}
                  onSelectSlot={handleSelectSlot}
                  onConfirmBooking={handleConfirmBooking}
                  onConfirmCancellation={handleConfirmCancellation}
                  onDismissAction={() => {
                    setStatus('idle');
                    addAssistant('No changes were made. Let me know if you need anything else.');
                  }}
                />
              ))}
              {(status === 'thinking' || status === 'tool_running') && (
                <div className="border-border bg-background text-muted-foreground flex items-center gap-2 self-start rounded-xl border px-3 py-2 text-xs">
                  <LoaderCircle className="text-primary size-4 animate-spin" />
                  {status === 'thinking'
                    ? 'Thinking through your request...'
                    : 'Checking demo appointment information...'}
                </div>
              )}
            </div>
          </div>
          {!isPanel && (
            <aside className="border-border bg-background/70 hidden w-[250px] shrink-0 flex-col gap-3 border-l p-4 xl:flex">
              <div className="flex items-center gap-2">
                <Activity className="text-primary size-4" />
                <h3 className="text-sm font-bold">Your context</h3>
              </div>
              <div className="border-border bg-card rounded-xl border p-3">
                <p className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase">
                  Next appointment
                </p>
                <p className="mt-2 text-xs font-bold">Dr. Michael Anderson</p>
                <p className="text-muted-foreground mt-1 text-[11px]">
                  Cardiology · Sep 24 at 10:30 AM
                </p>
              </div>
              <div className="border-border bg-card rounded-xl border p-3">
                <p className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase">
                  Booking progress
                </p>
                <p className="mt-2 text-xs font-semibold">
                  {status === 'awaiting_confirmation'
                    ? 'Review required'
                    : status === 'completed'
                      ? 'Ready for your next question'
                      : 'No active booking'}
                </p>
              </div>
              <p className="text-muted-foreground px-1 text-[10px] leading-relaxed">
                Context is illustrative. The assistant does not access live account or clinic
                records.
              </p>
            </aside>
          )}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void sendMessage();
          }}
          className="border-border bg-card shrink-0 border-t px-3 py-3 sm:px-5 sm:py-4"
        >
          <div className="mx-auto max-w-3xl">
            <div className="border-border bg-background focus-within:border-primary/40 focus-within:ring-primary/10 rounded-2xl border p-2 shadow-sm focus-within:ring-2">
              <label htmlFor="assistant-composer" className="sr-only">
                Message the MediBook Assistant
              </label>
              <textarea
                id="assistant-composer"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about doctors or appointments..."
                rows={2}
                className="placeholder:text-muted-foreground max-h-32 min-h-12 w-full resize-y bg-transparent px-2 py-1 text-sm outline-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground hidden text-[10px] sm:block">
                  Enter to send · Shift+Enter for a new line
                </p>
                <Button
                  type="submit"
                  className="ml-auto"
                  size="icon"
                  disabled={!input.trim() || status === 'thinking' || status === 'tool_running'}
                  aria-label="Send message"
                >
                  <ArrowUp />
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground mt-2 text-center text-[10px]">
              For emergencies, contact local emergency services. This assistant does not provide
              medical advice.
            </p>
          </div>
        </form>
      </section>

      {!isPanel && historyOpen && (
        <div
          className="bg-foreground/20 fixed inset-0 z-50 lg:hidden"
          role="presentation"
          onClick={() => setHistoryOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-title"
            className="border-border bg-card absolute inset-y-0 left-0 flex w-[min(86vw,320px)] flex-col border-r p-4 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 id="history-title" className="font-bold">
                Conversations
              </h2>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close conversation history"
                onClick={() => setHistoryOpen(false)}
              >
                <X />
              </Button>
            </div>
            <Button className="mt-3 w-full" variant="outline" onClick={startNewConversation}>
              <FilePlus2 data-icon="inline-start" />
              New conversation
            </Button>
            <div className="relative mt-4">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search conversations"
                aria-label="Search conversations"
                className="border-border bg-background focus-visible:ring-ring h-9 w-full rounded-lg border pr-3 pl-9 text-xs outline-none focus-visible:ring-2"
              />
            </div>
            <div className="mt-4 flex flex-col gap-1">
              {filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  selected={conversation.id === threadId}
                  onSelect={selectConversation}
                  onDelete={deleteConversation}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function ConversationItem({
  conversation,
  selected,
  onSelect,
  onDelete,
}: {
  conversation: ConversationSummary;
  selected: boolean;
  onSelect: (conversation: ConversationSummary) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className={`group flex items-center rounded-xl transition ${selected ? 'bg-primary/10' : 'hover:bg-secondary'}`}
    >
      <button
        onClick={() => onSelect(conversation)}
        className={`min-w-0 flex-1 p-3 text-left ${selected ? 'text-primary' : 'text-foreground'}`}
      >
        <span className="block truncate text-xs font-semibold">{conversation.title}</span>
        <span className="text-muted-foreground mt-1 block text-[10px]">
          {conversation.updatedAt}
        </span>
      </button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="mr-1 opacity-70 sm:opacity-0 sm:group-hover:opacity-100"
        aria-label={`Delete ${conversation.title}`}
        onClick={() => onDelete(conversation.id)}
      >
        <Trash2 />
      </Button>
    </div>
  );
}

function Welcome({ onPrompt }: { onPrompt: (prompt: string) => void }) {
  return (
    <div className="my-auto flex flex-col items-center py-8 text-center">
      <div className="bg-primary/10 text-primary grid size-14 place-items-center rounded-2xl">
        <Sparkles className="size-7" />
      </div>
      <h3 className="mt-4 text-lg font-black">How can I help today?</h3>
      <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
        Find a doctor, understand your appointment options, or get help preparing for a visit.
      </p>
      <div className="mt-6 grid w-full max-w-xl gap-2 sm:grid-cols-2">
        {suggestions.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onPrompt(prompt)}
            className="border-border bg-card hover:border-primary/30 hover:bg-primary/[0.03] rounded-xl border px-3 py-3 text-left text-xs font-semibold transition"
          >
            {prompt}
          </button>
        ))}
      </div>
      <p className="text-muted-foreground mt-6 flex items-center gap-1.5 text-[10px]">
        <ShieldCheck className="size-3.5" />
        Demo assistant · no live booking or medical advice
      </p>
    </div>
  );
}

function MessageView({
  message,
  ...rendererProps
}: { message: AssistantMessage } & Omit<ComponentProps<typeof GenUIRenderer>, 'blocks'>) {
  const isUser = message.role === 'user';
  return (
    <article className={`flex w-full gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[92%] sm:max-w-[86%] ${isUser ? 'flex flex-col items-end' : 'flex min-w-0 flex-col items-start'}`}
      >
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}
        >
          {message.content}
        </div>
        <div
          className={`text-muted-foreground mt-1 flex items-center gap-1 text-[10px] ${isUser ? 'justify-end' : ''}`}
        >
          <Clock3 className="size-3" />
          {message.createdAt}
          {message.status === 'awaiting_confirmation' && (
            <span className="text-primary ml-1 font-semibold">· confirmation needed</span>
          )}
        </div>
        {message.ui && <GenUIRenderer blocks={message.ui} {...rendererProps} />}
      </div>
    </article>
  );
}
