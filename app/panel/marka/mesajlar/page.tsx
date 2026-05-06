"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";

type Thread = {
  id: string;
  from: string;
  preview: string;
  lastAt: string;
  unread: boolean;
};

type Message = {
  id: string;
  body: string;
  createdAt: string;
  senderRole: "BRAND" | "INFLUENCER" | "ADMIN";
  senderName: string;
};

function timeAgo(value: string) {
  const d = new Date(value);
  const diff = Date.now() - d.getTime();
  const hour = 1000 * 60 * 60;
  if (diff < hour) return "Az once";
  if (diff < hour * 24) return `${Math.max(1, Math.round(diff / hour))} saat once`;
  return `${Math.max(1, Math.round(diff / (hour * 24)))} gun once`;
}

async function markThreadRead(threadId: string) {
  await fetch("/api/messages", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ threadId }),
  });
}

export default function MesajlarPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState("");

  async function load(threadId?: string) {
    const qs = threadId ? `?threadId=${threadId}` : "";
    const res = await fetch(`/api/messages${qs}`, { credentials: "include", cache: "no-store" });
    const data = await res.json();
    if (!res.ok) {
      setInfo(data?.error ?? "Mesajlar alinamadi");
      return;
    }
    if (!data?.ok) return;
    setThreads(data.threads ?? []);
    setActiveThread(data.activeThread ?? null);
    setMessages(data.messages ?? []);
    const tid = threadId ?? data.activeThread;
    if (tid) void markThreadRead(tid);
  }

  useEffect(() => {
    void load();
  }, []);

  const selected = useMemo(() => threads.find((t) => t.id === activeThread) ?? null, [threads, activeThread]);

  async function send() {
    if (!activeThread || !text.trim()) return;
    try {
      setBusy(true);
      setInfo("");
      const res = await fetch("/api/messages", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId: activeThread, text }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Mesaj gonderilemedi");
      setText("");
      await load(activeThread);
    } catch (error) {
      setInfo(error instanceof Error ? error.message : "Mesaj gonderilemedi");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-[900px] flex-col gap-4 md:flex-row md:gap-6">
      <div className="w-full shrink-0 space-y-2 md:w-72">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Gelen kutusu</p>
        <ul className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          {threads.length ? (
            threads.map((t) => (
              <li
                key={t.id}
                onClick={() => void load(t.id)}
                className={`cursor-pointer border-b border-gray-100 px-4 py-3 last:border-0 ${
                  t.id === activeThread ? "bg-pink-100/60" : t.unread ? "bg-pink-50/50" : ""
                }`}
              >
                <p className="text-sm font-semibold text-gray-900">{t.from}</p>
                <p className="line-clamp-1 text-xs text-gray-600">{t.preview}</p>
                <p className="mt-1 text-[10px] text-gray-400">{timeAgo(t.lastAt)}</p>
              </li>
            ))
          ) : (
            <li className="px-4 py-4 text-xs text-gray-500">Henuz mesaj yok.</li>
          )}
        </ul>
      </div>
      <div className="flex min-h-[320px] flex-1 flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">
          {selected ? `${selected.from} ile konusma` : "Konusma secin veya influencer profilinden mesaj baslatin."}
        </p>
        <div className="mt-4 flex-1 space-y-2 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50 p-3">
          {messages.length ? (
            messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  m.senderRole === "BRAND" ? "ml-auto bg-pink-600 text-white" : "bg-white text-gray-800"
                }`}
              >
                <p className="text-[10px] opacity-70">{m.senderName}</p>
                <p>{m.body}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500">Bu konusmada mesaj yok.</p>
          )}
        </div>
        {info ? <p className="mt-2 text-xs text-rose-600">{info}</p> : null}
        <div className="mt-auto flex gap-2 border-t border-gray-100 pt-4">
          <input
            type="text"
            placeholder="Mesaj yazin..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-900 outline-none focus:border-pink-400"
          />
          <button
            type="button"
            disabled={busy || !activeThread}
            onClick={() => void send()}
            className="rounded-full bg-pink-600 px-5 py-2 text-xs font-semibold text-white disabled:opacity-60"
          >
            Gonder
          </button>
        </div>
      </div>
    </div>
  );
}
