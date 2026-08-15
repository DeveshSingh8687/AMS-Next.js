import React from "react";
import { LogIn, LogOut, Loader2 } from "lucide-react";

export default function PunchButton({ type, onClick, disabled, loading, message }) {
  const isPunchIn = type === "in";

  return (
    <div className="text-center">
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className={`w-36 h-36 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center gap-2 transition-all shadow-lg ${
          disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
            : isPunchIn
            ? "bg-gradient-to-br from-[#0F766E] to-[#14B8A6] text-white hover:shadow-xl hover:scale-105 active:scale-95"
            : "bg-gradient-to-br from-red-500 to-red-400 text-white hover:shadow-xl hover:scale-105 active:scale-95"
        }`}
      >
        {loading ? (
          <Loader2 className="w-8 h-8 animate-spin" />
        ) : isPunchIn ? (
          <LogIn className="w-8 h-8" />
        ) : (
          <LogOut className="w-8 h-8" />
        )}
        <span className="text-sm font-semibold">
          {loading ? "Processing..." : isPunchIn ? "Punch In" : "Punch Out"}
        </span>
      </button>
      {message && (
        <p className="text-xs text-gray-500 mt-3 max-w-[200px] mx-auto">
          {message}
        </p>
      )}
    </div>
  );
}