"use client";

import { FormEvent, useState, useRef, useEffect } from "react";
import { Avatar } from "@/app/components/ui/Avatar";

interface CreatePostCardProps {
  avatarUrl?: string | null;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent, gifUrl?: string | null) => void;
  loading?: boolean;
}

// Emoji collection organized by category
const POPULAR_EMOJIS = [
  // Smileys & Emotion
  "😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂",
  "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋",
  "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳",
  "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "😣", "😖", "😫",
  "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳",
  "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭",
  "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧",
  "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢",

  // Hand Gestures
  "👋", "🤚", "🖐", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞",
  "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍",
  "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝",
  "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦿", "🦵", "🦶", "👂",

  // Hearts & Symbols
  "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
  "❤️‍🔥", "❤️‍🩹", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟",
  "☮️", "✝️", "☪️", "🕉", "☸️", "✡️", "🔯", "🕎", "☯️", "☦️",

  // Objects & Activities
  "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱",
  "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🥅", "⛳", "🏹", "🎣",
  "🥊", "🥋", "🎯", "⛸", "🛷", "🛼", "🎿", "⛷", "🏂", "🪂",

  // Celebrations & Party
  "🎉", "🎊", "🎈", "🎁", "🎀", "🎂", "🍰", "🧁", "🍾", "🥂",
  "🍻", "🥃", "🍷", "🍹", "🍸", "🍶", "☕", "🍵", "🧃", "🥤",

  // Nature & Weather
  "🌞", "🌝", "🌛", "🌜", "🌚", "🌕", "🌖", "🌗", "🌘", "🌑",
  "🌒", "🌓", "🌔", "🌙", "🌎", "🌍", "🌏", "💫", "⭐", "🌟",
  "✨", "⚡", "☄️", "💥", "🔥", "🌈", "☀️", "🌤", "⛅", "🌥",
  "☁️", "🌦", "🌧", "⛈", "🌩", "🌨", "❄️", "☃️", "⛄", "🌬",

  // Numbers & Math
  "💯", "💢", "💥", "💫", "💦", "💨", "🕳", "💬", "👁️‍🗨️", "🗨",
  "🗯", "💭", "💤", "⭕", "✅", "☑️", "✔️", "❌", "❎", "➕",
  "➖", "➗", "✖️", "♾", "💲", "💱", "™️", "©️", "®️", "〰️",

  // Arrows & Symbols
  "⬆️", "↗️", "➡️", "↘️", "⬇️", "↙️", "⬅️", "↖️", "↕️", "↔️",
  "↩️", "↪️", "⤴️", "⤵️", "🔃", "🔄", "🔙", "🔚", "🔛", "🔜",
  "🔝", "🆕", "🆓", "🆙", "🆗", "🆒", "🆖", "🔞", "🔴", "🟠",
  "🟡", "🟢", "🔵", "🟣", "🟤", "⚫", "⚪", "🟥", "🟧", "🟨"
];

// Trending GIFs (pre-selected popular GIFs from Giphy)
const TRENDING_GIFS = [
  "https://media.giphy.com/media/3o7aCWJavAgtBzLOSs/giphy.gif", // thumbs up
  "https://media.giphy.com/media/g9582DNuQppxC/giphy.gif", // applause
  "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif", // party
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif", // wow
  "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif", // excited
  "https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif", // happy
  "https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif", // celebration
  "https://media.giphy.com/media/kyLYXonQYYfwYDIeZl/giphy.gif", // success
];

export default function CreatePostCard({
  avatarUrl,
  value,
  onChange,
  onSubmit,
  loading = false,
}: CreatePostCardProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [gifSearchQuery, setGifSearchQuery] = useState("");
  const [searchedGifs, setSearchedGifs] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);

  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const gifPickerRef = useRef<HTMLDivElement>(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (gifPickerRef.current && !gifPickerRef.current.contains(event.target as Node)) {
        setShowGifPicker(false);
      }
    };

    if (showEmojiPicker || showGifPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker, showGifPicker]);

  // Handle emoji selection
  const handleEmojiClick = (emoji: string) => {
    onChange(value + emoji);
    setShowEmojiPicker(false);
  };

  // Handle GIF search using Giphy API
  const handleGifSearch = async () => {
    if (!gifSearchQuery.trim()) return;

    setSearching(true);
    try {
      // Using Giphy's public beta API key (for demo purposes only)
      // In production, you should use your own API key stored in environment variables
      const apiKey = "sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh"; // Giphy's public beta key
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(gifSearchQuery)}&limit=12&rating=g`
      );
      const data = await response.json();

      if (data.data) {
        const gifUrls = data.data.map((gif: any) => gif.images.fixed_height.url);
        setSearchedGifs(gifUrls);
      }
    } catch (error) {
      console.error("Error searching GIFs:", error);
    } finally {
      setSearching(false);
    }
  };

  // Handle GIF selection
  const handleGifSelect = (gifUrl: string) => {
    setSelectedGif(gifUrl);
    setShowGifPicker(false);
  };

  // Remove selected GIF
  const removeGif = () => {
    setSelectedGif(null);
  };

  // Handle form submit with GIF
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(e, selectedGif);

    // Reset GIF after posting
    setSelectedGif(null);
    setGifSearchQuery("");
    setSearchedGifs([]);
  };

  // Handle Enter key in GIF search
  const handleGifSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleGifSearch();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <div className="flex gap-4">
        <Avatar
          src={avatarUrl ?? undefined}
          fallback="?"
        />

        <div className="flex-1">
          <textarea
            rows={2}
            placeholder="What's happening in your search?"
            className="w-full bg-transparent resize-none border-none focus:ring-0 text-base placeholder-slate-400 text-slate-900"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />

          {/* GIF Preview */}
          {selectedGif && (
            <div className="relative mt-2 mb-2">
              <img
                src={selectedGif}
                alt="Selected GIF"
                className="rounded-lg max-h-64 w-full object-cover"
              />
              <button
                type="button"
                onClick={removeGif}
                className="absolute top-2 right-2 bg-slate-900/70 text-white rounded-full p-1.5 hover:bg-slate-900 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          )}

          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-1 text-primary relative">
              {/* Image Upload - Coming Soon */}
              <button
                type="button"
                disabled
                className="material-symbols-outlined p-2 rounded-full opacity-50 cursor-not-allowed text-xl"
                title="Image upload coming soon"
              >
                image
              </button>

              {/* GIF Picker */}
              <div className="relative" ref={gifPickerRef}>
                <button
                  type="button"
                  onClick={() => setShowGifPicker(!showGifPicker)}
                  className="material-symbols-outlined p-2 rounded-full hover:bg-blue-50 cursor-pointer text-xl"
                  title="Add GIF"
                >
                  gif_box
                </button>

                {showGifPicker && (
                  <div className="absolute left-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl p-4 w-96 z-50">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Select a GIF</h3>

                    {/* Search Input */}
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Search GIFs..."
                        value={gifSearchQuery}
                        onChange={(e) => setGifSearchQuery(e.target.value)}
                        onKeyDown={handleGifSearchKeyDown}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={handleGifSearch}
                        disabled={searching || !gifSearchQuery.trim()}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        {searching ? "..." : "Search"}
                      </button>
                    </div>

                    {/* GIF Grid */}
                    <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                      {(searchedGifs.length > 0 ? searchedGifs : TRENDING_GIFS).map((gifUrl, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleGifSelect(gifUrl)}
                          className="rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                        >
                          <img
                            src={gifUrl}
                            alt={`GIF ${index + 1}`}
                            className="w-full h-24 object-cover"
                          />
                        </button>
                      ))}
                    </div>

                    {searchedGifs.length === 0 && !searching && (
                      <p className="text-xs text-slate-500 text-center mt-2">
                        {gifSearchQuery ? "No GIFs found" : "Showing trending GIFs"}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowGifPicker(false)}
                      className="w-full mt-3 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>

              {/* Poll - Coming Soon */}
              <button
                type="button"
                disabled
                className="material-symbols-outlined p-2 rounded-full opacity-50 cursor-not-allowed text-xl"
                title="Poll feature coming soon"
              >
                poll
              </button>

              {/* Emoji Picker */}
              <div className="relative" ref={emojiPickerRef}>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="material-symbols-outlined p-2 rounded-full hover:bg-blue-50 cursor-pointer text-xl"
                  title="Add emoji"
                >
                  sentiment_satisfied
                </button>

                {showEmojiPicker && (
                  <div className="absolute left-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl p-4 w-96 z-50">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Select an emoji ({POPULAR_EMOJIS.length} available)</h3>
                    <div className="grid grid-cols-10 gap-1.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                      {POPULAR_EMOJIS.map((emoji, index) => (
                        <button
                          key={`${emoji}-${index}`}
                          type="button"
                          onClick={() => handleEmojiClick(emoji)}
                          className="text-xl hover:bg-slate-100 rounded-lg p-1.5 transition-all duration-150 hover:scale-110 flex items-center justify-center"
                          title={emoji}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(false)}
                      className="w-full mt-3 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white font-bold py-1.5 px-4 rounded-full text-sm disabled:opacity-60 hover:bg-primary/90 transition-colors"
            >
              {loading ? "Posting…" : "Post"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
