/**
 * Minimal Calendly popup integration (client-side).
 * Loads the official widget assets on demand and opens the scheduling popup
 * prefilled with the lead's name + email. Resolves when the visitor completes
 * a booking (`calendly.event_scheduled`).
 */

const WIDGET_CSS = "https://assets.calendly.com/assets/external/widget.css";
const WIDGET_JS = "https://assets.calendly.com/assets/external/widget.js";

interface CalendlyGlobal {
  initPopupWidget: (opts: {
    url: string;
    prefill?: { name?: string; email?: string };
  }) => void;
  closePopupWidget?: () => void;
}

declare global {
  interface Window {
    Calendly?: CalendlyGlobal;
  }
}

export function calendlyUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_CALENDLY_URL;
  return url && url.trim() ? url.trim() : null;
}

function loadAssets(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve();

    if (!document.querySelector(`link[href="${WIDGET_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = WIDGET_CSS;
      document.head.appendChild(link);
    }

    if (window.Calendly) return resolve();

    const existing = document.querySelector(
      `script[src="${WIDGET_JS}"]`
    ) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = WIDGET_JS;
    script.async = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}

function isCalendlyEvent(e: MessageEvent): boolean {
  return (
    typeof e.data === "object" &&
    e.data !== null &&
    typeof (e.data as { event?: string }).event === "string" &&
    (e.data as { event: string }).event.indexOf("calendly") === 0
  );
}

/**
 * Opens the Calendly popup, prefilled. Resolves `true` once a booking is
 * scheduled, or `false` if the popup is closed without booking.
 */
export async function openCalendlyPopup(opts: {
  name?: string;
  email?: string;
}): Promise<boolean> {
  const url = calendlyUrl();
  if (!url) return false;

  await loadAssets();
  if (!window.Calendly) return false;

  return new Promise<boolean>((resolve) => {
    let booked = false;

    function onMessage(e: MessageEvent) {
      if (!isCalendlyEvent(e)) return;
      const event = (e.data as { event: string }).event;
      if (event === "calendly.event_scheduled") {
        booked = true;
        cleanup();
        resolve(true);
      }
    }

    // Detect popup close (Calendly removes its overlay) to resolve false.
    function onPopupClose(e: Event) {
      const target = e.target as HTMLElement;
      if (
        target.classList?.contains("calendly-popup-close") ||
        target.classList?.contains("calendly-overlay")
      ) {
        // Give the scheduled message a tick to arrive first.
        setTimeout(() => {
          if (!booked) {
            cleanup();
            resolve(false);
          }
        }, 300);
      }
    }

    function cleanup() {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("click", onPopupClose, true);
    }

    window.addEventListener("message", onMessage);
    document.addEventListener("click", onPopupClose, true);

    window.Calendly!.initPopupWidget({
      url,
      prefill: { name: opts.name, email: opts.email },
    });
  });
}
