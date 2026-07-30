(() => {
  const toggle = document.querySelector('[data-site-menu-toggle]');
  const drawer = document.querySelector('[data-site-menu-drawer]');
  const closeButton = document.querySelector('[data-site-menu-close]');
  const backdrop = document.querySelector('[data-site-menu-backdrop]');

  if (!toggle || !drawer || !backdrop) return;
  let lastFocused = null;
  drawer.setAttribute('inert', '');

  function getFocusableItems() {
    return Array.from(drawer.querySelectorAll('a[href], button:not([disabled])'))
      .filter((item) => item.getClientRects().length > 0);
  }

  function openMenu() {
    lastFocused = document.activeElement;
    drawer.removeAttribute('inert');
    toggle.classList.add('open');
    drawer.classList.add('open');
    backdrop.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => (closeButton || getFocusableItems()[0])?.focus());
  }

  function closeMenu(returnFocus = true) {
    toggle.classList.remove('open');
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.setAttribute('inert', '');
    document.body.style.overflow = '';
    if (returnFocus && lastFocused instanceof HTMLElement) lastFocused.focus();
  }

  toggle.addEventListener('click', () => {
    if (toggle.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeButton) closeButton.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);
  drawer.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (!drawer.classList.contains('open')) return;
    if (event.key === 'Escape') {
      closeMenu();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusableItems = getFocusableItems();
    if (!focusableItems.length) return;
    const firstItem = focusableItems[0];
    const lastItem = focusableItems[focusableItems.length - 1];

    if (event.shiftKey && document.activeElement === firstItem) {
      event.preventDefault();
      lastItem.focus();
    } else if (!event.shiftKey && document.activeElement === lastItem) {
      event.preventDefault();
      firstItem.focus();
    }
  });
})();
