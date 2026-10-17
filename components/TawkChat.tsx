"use client";

import { useEffect } from "react";

/**
 * Tawk.to Live Chat Widget Component
 * Safely loads the official Tawk.to script once on the client side.
 * Prevents duplicate script tags on route changes and during React Strict Mode.
 * Preserves exact widget URL: https://embed.tawk.to/6ad38843537a8334c9bfbf4d/1k554oigl
 */
export default function TawkChat() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Guard against duplicate script injection across route changes or remounts
    const SCRIPT_ID = "tawk-script-jan-connect";
    if (document.getElementById(SCRIPT_ID)) {
      return;
    }

    try {
      // Initialize Tawk global variables
      const win = window as unknown as { Tawk_API?: Record<string, unknown>; Tawk_LoadStart?: Date };
      win.Tawk_API = win.Tawk_API || {};
      win.Tawk_LoadStart = new Date();

      const s1 = document.createElement("script");
      s1.id = SCRIPT_ID;
      s1.async = true;
      s1.src = "https://embed.tawk.to/6ad38843537a8334c9bfbf4d/1k554oigl";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");

      // Graceful error handling if blocked by adblocker
      s1.onerror = () => {
        console.warn("Tawk.to widget could not be loaded (likely blocked by privacy extension).");
      };

      const s0 = document.getElementsByTagName("script")[0];
      if (s0 && s0.parentNode) {
        s0.parentNode.insertBefore(s1, s0);
      } else {
        document.head.appendChild(s1);
      }
    } catch {
      // Fail silently without breaking the application UI
    }
  }, []);

  return null;
}
