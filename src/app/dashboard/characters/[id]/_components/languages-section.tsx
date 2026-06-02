"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { addLanguageAction, removeLanguageAction } from "../actions";

type Props = {
  characterId: string;
  languages: string[];
  onLanguagesChange: (languages: string[]) => void;
  isOwner: boolean;
};

export default function LanguagesSection({ characterId, languages, onLanguagesChange, isOwner }: Props) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleAdd() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    await addLanguageAction(characterId, trimmed);
    onLanguagesChange([...languages, trimmed]);
    setInputValue("");
    inputRef.current?.focus();
  }

  async function handleRemove(language: string) {
    await removeLanguageAction(characterId, language);
    onLanguagesChange(languages.filter((l) => l !== language));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  }

  return (
    <section className="mb-6">
      <h2 className="mb-3 block bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">
        Languages
      </h2>
      {languages.length === 0 && !isOwner ? (
        <p className="text-sm text-muted-foreground">No languages recorded.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <Badge key={lang} variant="secondary" className="flex items-center gap-1 pr-1">
              {lang}
              {isOwner && (
                <button
                  onClick={() => handleRemove(lang)}
                  className="ml-0.5 rounded-sm opacity-70 hover:opacity-100 focus:outline-none"
                  aria-label={`Remove ${lang}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
          {languages.length === 0 && isOwner && (
            <p className="text-sm text-muted-foreground">No languages added.</p>
          )}
        </div>
      )}
      {isOwner && (
        <div className="mt-3 flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add language…"
            className="h-8 max-w-[200px] text-sm"
          />
          <Button size="sm" variant="outline" onClick={handleAdd} className="h-8">
            Add
          </Button>
        </div>
      )}
    </section>
  );
}
