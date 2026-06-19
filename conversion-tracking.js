(() => {
  const getText = (element) => (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 120);

  window.vomTrack = function vomTrack(eventName, details = {}) {
    const payload = {
      event: eventName,
      event_name: eventName,
      page_path: window.location.pathname,
      page_location: window.location.href,
      timestamp: new Date().toISOString(),
      ...details
    };

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);

    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, details);
    }

    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", eventName, details);
    }

    document.dispatchEvent(new CustomEvent("veteransown:tracked", { detail: payload }));
  };

  function trackFormSubmit(form) {
    window.vomTrack("form_submit", {
      form_name: form.getAttribute("name") || form.querySelector("[name='form-name']")?.value || "unknown",
      form_action: form.getAttribute("action") || "",
      form_id: form.id || ""
    });
  }

  function trackLinkClick(link) {
    const href = link.getAttribute("href") || "";
    const label = getText(link);

    if (href.startsWith("tel:")) {
      window.vomTrack("phone_click", { link_url: href, link_text: label });
      return;
    }

    if (href.startsWith("mailto:")) {
      window.vomTrack("email_click", { link_url: href, link_text: label });
      return;
    }

    if (href === "/apply" || href.includes("/apply") || link.classList.contains("nav-cta")) {
      window.vomTrack("apply_click", { link_url: href, link_text: label });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.replace(/\/$/, "") === "/thank-you") {
      window.vomTrack("thank_you_view", { page_type: "lead_confirmation" });
    }

    document.querySelectorAll("form").forEach((form) => {
      form.addEventListener("submit", () => trackFormSubmit(form));
    });

    document.querySelectorAll("a[href]").forEach((link) => {
      link.addEventListener("click", () => trackLinkClick(link));
    });
  });

  document.addEventListener("veteransown:quiz_complete", (event) => {
    window.vomTrack("quiz_complete", event.detail || {});
  });

  document.addEventListener("veteransown:calculator_result", (event) => {
    window.vomTrack("calculator_result", event.detail || {});
  });
})();
