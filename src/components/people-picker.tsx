"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/form";
import { Search, X } from "lucide-react";

type PersonOption = { id: string; name: string; photoUrl: string | null };

export function PeoplePicker({
  name,
  label,
  initial,
  placeholder = "Buscar persona por nombre...",
}: {
  name: string;
  label?: string;
  initial?: PersonOption | null;
  placeholder?: string;
}) {
  const [query, setQuery] = useState(initial?.name ?? "");
  const [selected, setSelected] = useState<PersonOption | null>(initial ?? null);
  const [results, setResults] = useState<PersonOption[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected || query.trim().length < 2) {
      const clear = setTimeout(() => setResults([]), 0);
      return () => clearTimeout(clear);
    }
    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/people/search?q=${encodeURIComponent(query)}`);
      if (res.ok) setResults(await res.json());
    }, 250);
    return () => clearTimeout(timeout);
  }, [query, selected]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {label && <span className="mb-1 block text-sm font-medium text-ink-700">{label}</span>}
      <input type="hidden" name={name} value={selected?.id ?? ""} />
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <Input
          value={query}
          placeholder={placeholder}
          className="pl-9"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null);
            setOpen(true);
          }}
        />
        {selected && (
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setQuery("");
            }}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-ink-400 hover:bg-ink-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-ink-200 bg-white shadow-lg">
          {results.map((r) => (
            <button
              key={r.id}
              type="button"
              className="block w-full px-3 py-2 text-left text-sm hover:bg-brand-50"
              onClick={() => {
                setSelected(r);
                setQuery(r.name);
                setOpen(false);
              }}
            >
              {r.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
