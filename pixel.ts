// ============================================================
// تتبع أحداث Meta Pixel (Facebook Pixel)
// الأحداث: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase
// ============================================================

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type StandardEvent =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "Purchase"
  | "Lead";

export function trackEvent(event: StandardEvent, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;
  try {
    window.fbq("track", event, data);
  } catch {
    // تجاهل أي خطأ في التتبع حتى لا يوقف تجربة المستخدم
  }
}
