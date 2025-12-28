"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Avatar } from "./Avatar";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface MentionAutocompleteProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onSelect: (username: string) => void;
}

export default function MentionAutocomplete({
  textareaRef,
  value,
  onSelect,
}: MentionAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Profile[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [currentMention, setCurrentMention] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detect @mention pattern and search for users
  useEffect(() => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPos);

    // Find the last @ symbol before cursor
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex === -1) {
      setSuggestions([]);
      return;
    }

    // Get text after the @ symbol
    const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);

    // Check if there's a space after @ (which means mention is complete)
    if (textAfterAt.includes(" ") || textAfterAt.includes("\n")) {
      setSuggestions([]);
      return;
    }

    // Minimum 0 characters to show suggestions (shows all users when just @)
    setCurrentMention(textAfterAt);
    searchUsers(textAfterAt);

    // Calculate position for dropdown
    const { top, left } = getCaretCoordinates(textarea, cursorPos);
    setPosition({ top, left });
  }, [value, textareaRef]);

  const searchUsers = async (query: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, full_name, avatar_url")
      .ilike("username", `${query}%`)
      .limit(5);

    if (!error && data) {
      setSuggestions(data as Profile[]);
      setSelectedIndex(0);
    }
  };

  const handleSelect = (username: string) => {
    onSelect(username);
    setSuggestions([]);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case "Enter":
      case "Tab":
        e.preventDefault();
        handleSelect(suggestions[selectedIndex].username);
        break;
      case "Escape":
        e.preventDefault();
        setSuggestions([]);
        break;
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.addEventListener("keydown", handleKeyDown);
    return () => textarea.removeEventListener("keydown", handleKeyDown);
  }, [suggestions, selectedIndex]);

  // Scroll selected item into view
  useEffect(() => {
    if (dropdownRef.current) {
      const selectedElement = dropdownRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (suggestions.length === 0) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute z-50 bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
      style={{
        top: `${position.top + 24}px`,
        left: `${position.left}px`,
        minWidth: "250px",
      }}
    >
      {suggestions.map((profile, index) => (
        <div
          key={profile.id}
          onClick={() => handleSelect(profile.username)}
          className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition ${
            index === selectedIndex
              ? "bg-blue-50 border-l-2 border-primary"
              : "hover:bg-slate-50"
          }`}
        >
          <Avatar
            src={profile.avatar_url ?? undefined}
            fallback={profile.full_name?.[0] ?? profile.username[0] ?? "?"}
            className="size-8"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {profile.full_name || "Unknown User"}
            </p>
            <p className="text-xs text-slate-500">@{profile.username}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper function to get caret coordinates
function getCaretCoordinates(
  element: HTMLTextAreaElement,
  position: number
): { top: number; left: number } {
  const div = document.createElement("div");
  const style = getComputedStyle(element);
  const properties = [
    "boxSizing",
    "width",
    "height",
    "overflowX",
    "overflowY",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "fontStyle",
    "fontVariant",
    "fontWeight",
    "fontStretch",
    "fontSize",
    "fontSizeAdjust",
    "lineHeight",
    "fontFamily",
    "textAlign",
    "textTransform",
    "textIndent",
    "textDecoration",
    "letterSpacing",
    "wordSpacing",
    "tabSize",
  ];

  properties.forEach((prop) => {
    div.style[prop as any] = style[prop as any];
  });

  div.style.position = "absolute";
  div.style.visibility = "hidden";
  div.style.whiteSpace = "pre-wrap";
  div.style.wordWrap = "break-word";

  div.textContent = element.value.substring(0, position);

  const span = document.createElement("span");
  span.textContent = element.value.substring(position) || ".";
  div.appendChild(span);

  document.body.appendChild(div);

  const coordinates = {
    top: span.offsetTop,
    left: span.offsetLeft,
  };

  document.body.removeChild(div);

  return coordinates;
}
