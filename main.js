/* ======================================================
   VIDYALAYAA — Main JavaScript
   Interactions, Animations, and Functionality
   ====================================================== */

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

function handleNavScroll() {
  const scrollY = window.scrollY;
  if (scrollY > 50) {
    navbar.classList.add('navbar--scrolled');
  } else {
    navbar.classList.remove('navbar--scrolled');
  }
  lastScrollY = scrollY;
}

window.addEventListener('scroll', handleNavScroll, { passive: true });

// ---- Mobile menu toggle ----
const navToggle = document.getElementById('nav-toggle');
const navMobile = document.getElementById('nav-mobile');

if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMobile.classList.toggle('active');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.navbar__mobile-links a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMobile.classList.remove('active');
    });
  });
}

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
});

// ---- Pricing toggle ----
const pricingSwitch = document.getElementById('pricing-switch');
const monthlyLabel = document.querySelector('[data-period="monthly"]');
const yearlyLabel = document.querySelector('[data-period="yearly"]');
let isYearly = false;

pricingSwitch.addEventListener('click', () => {
  isYearly = !isYearly;
  pricingSwitch.classList.toggle('active', isYearly);
  monthlyLabel.classList.toggle('pricing__toggle-label--active', !isYearly);
  yearlyLabel.classList.toggle('pricing__toggle-label--active', isYearly);

  document.querySelectorAll('.pricing-card__amount[data-monthly]').forEach(el => {
    const value = isYearly ? el.dataset.yearly : el.dataset.monthly;
    el.textContent = Number(value).toLocaleString('en-IN');
  });
});

// ---- FAQ accordion ----
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq__item');
    const isActive = item.classList.contains('active');

    // Close all FAQ items
    document.querySelectorAll('.faq__item').forEach(faq => {
      faq.classList.remove('active');
      faq.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked if it wasn't active
    if (!isActive) {
      item.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ---- Stats counter animation ----
function animateCounter(element, target, suffix = '') {
  const duration = 2000;
  const start = 0;
  const startTime = performance.now();
  const isFloat = target % 1 !== 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (target - start) * eased;

    if (isFloat) {
      element.textContent = current.toFixed(1) + suffix;
    } else if (target >= 1000) {
      element.textContent = Math.round(current).toLocaleString('en-IN') + suffix;
    } else {
      element.textContent = Math.round(current) + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ---- Scroll reveal animation ----
const revealElements = document.querySelectorAll(
  '.feature-card, .step, .testimonial-card, .faq__item, .showcase__inner, .stat'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation delay
        setTimeout(() => {
          entry.target.classList.add('revealed');

          // Trigger stat counter if it's a stat element
          if (entry.target.classList.contains('stat')) {
            const numEl = entry.target.querySelector('.stat__number');
            if (numEl && !numEl.dataset.animated) {
              numEl.dataset.animated = 'true';
              const target = parseFloat(numEl.dataset.target);
              const suffix = numEl.dataset.suffix || '';
              animateCounter(numEl, target, suffix);
            }
          }
        }, index * 100);

        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));

// ---- Demo form handling ----
const demoForm = document.getElementById('demo-form');

demoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const submitBtn = document.getElementById('demo-submit');
  const originalText = submitBtn.innerHTML;

  submitBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
      <path d="M21 12a9 9 0 11-6.219-8.56"/>
    </svg>
    Sending...
  `;
  submitBtn.disabled = true;

  // Simulate form submission
  setTimeout(() => {
    submitBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 6L9 17L4 12"/>
      </svg>
      Demo Requested!
    `;
    submitBtn.style.background = 'var(--color-primary)';

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      submitBtn.style.background = '';
      demoForm.reset();
    }, 3000);
  }, 1500);
});

// ---- Active navbar link highlighting ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar__link');

function highlightNav() {
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('navbar__link--active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('navbar__link--active');
        }
      });
    }
  });
}

window.addEventListener('scroll', highlightNav, { passive: true });

// ---- Add spin animation CSS dynamically ----
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .spin {
    animation: spin 1s linear infinite;
  }
  .navbar__link--active {
    color: var(--color-black) !important;
  }
  .navbar__link--active::after {
    width: 100% !important;
  }
`;
document.head.appendChild(style);



// ---- NFC Tap Simulator Interactivity ----
const nfcCard = document.getElementById('nfc-student-card');
const nfcReader = document.getElementById('nfc-reader-device');
const nfcStatusText = document.getElementById('nfc-status-text');
const nfcNotificationsList = document.getElementById('nfc-notifications-list');
const nfcPhoneTime = document.getElementById('nfc-phone-time');

let tapCount = 0;

function handleNfcTap() {
  if (nfcReader.classList.contains('active-scan')) return;

  tapCount++;
  nfcCard.classList.add('tapping');
  nfcReader.classList.add('active-scan');
  nfcStatusText.textContent = 'Card Verified • Aarav Sharma (9-B)';

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (nfcPhoneTime) nfcPhoneTime.textContent = timeStr;

  const eventType = tapCount % 2 === 1 ? 'arrived at school' : 'safely departed';
  const gateName = tapCount % 2 === 1 ? 'Main Entrance' : 'Gate 02';

  // Create new notification element
  const notifItem = document.createElement('div');
  notifItem.className = 'nfc-notification-item';
  notifItem.innerHTML = `
    <div class="nfc-notification__icon">🟢</div>
    <div class="nfc-notification__text">
      <strong>Just now (${timeStr})</strong>: Aarav ${eventType} via ${gateName}. Attendance recorded.
    </div>
  `;

  if (nfcNotificationsList) {
    nfcNotificationsList.insertBefore(notifItem, nfcNotificationsList.firstChild);
    // Keep max 3 items
    while (nfcNotificationsList.children.length > 3) {
      nfcNotificationsList.removeChild(nfcNotificationsList.lastChild);
    }
  }

  setTimeout(() => {
    nfcCard.classList.remove('tapping');
  }, 600);

  setTimeout(() => {
    nfcReader.classList.remove('active-scan');
    nfcStatusText.textContent = 'Ready for Next Tap';
  }, 2400);
}

if (nfcCard) {
  nfcCard.addEventListener('click', handleNfcTap);
  nfcCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNfcTap();
    }
  });
}

// ---- Sign In Modal Interactivity ----
const loginModal = document.getElementById('login-modal');
const modalClose = document.getElementById('modal-close');
const navLoginButtons = document.querySelectorAll('#nav-login, .navbar__mobile-actions a:first-child');
const loginEmailInput = document.getElementById('login-email');
const loginLabelUser = document.getElementById('login-label-user');
const loginForm = document.getElementById('login-form');
const loginSubmitBtn = document.getElementById('login-submit-btn');
const modalToDemo = document.getElementById('modal-to-demo');

function openLoginModal(e) {
  if (e) e.preventDefault();
  loginModal.classList.add('active');
  loginModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
  loginModal.classList.remove('active');
  loginModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

navLoginButtons.forEach(btn => {
  btn.addEventListener('click', openLoginModal);
});

if (modalClose) {
  modalClose.addEventListener('click', closeLoginModal);
}

if (loginModal) {
  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      closeLoginModal();
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && loginModal && loginModal.classList.contains('active')) {
    closeLoginModal();
  }
});

if (modalToDemo) {
  modalToDemo.addEventListener('click', () => {
    closeLoginModal();
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const origText = loginSubmitBtn.innerHTML;
    loginSubmitBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
        <path d="M21 12a9 9 0 11-6.219-8.56"/>
      </svg>
      Authenticating...
    `;
    loginSubmitBtn.disabled = true;

    setTimeout(() => {
      loginSubmitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 6L9 17L4 12"/>
        </svg>
        Signed In Successfully!
      `;
      loginSubmitBtn.style.background = 'var(--color-primary)';

      setTimeout(() => {
        loginSubmitBtn.innerHTML = origText;
        loginSubmitBtn.disabled = false;
        loginSubmitBtn.style.background = '';
        closeLoginModal();
        loginForm.reset();
      }, 1500);
    }, 1200);
  });
}

// ---- Initialize ----
handleNavScroll();
highlightNav();

