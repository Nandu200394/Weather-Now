
import React, { useState } from "react";

export default function SearchBar({ onSearch, loading }) {
  const [q, setQ] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    onSearch(q.trim());
  };

  return (
    <form
      onSubmit={submit}
      className="relative flex items-center w-full"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-3 w-5 h-5 text-slate-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
        />
      </svg>

      <input
        type="text"
        placeholder="Search for a city..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-full text-slate-800 bg-white/40 backdrop-blur-md placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
        aria-label="Search city"
      />

      <button
        type="submit"
        disabled={loading}
        className="absolute right-2 px-3 py-1.5 rounded-full text-sm bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "..." : "Go"}
      </button>
    </form>
  );
}
