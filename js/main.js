/* Interactive Logic for FacePie Landing Page */

document.addEventListener('DOMContentLoaded', () => {
  initModals();
  initPhoneTabs();
  initBeforeAfterSlider();
  initPalettePicker();
  initNailSelector();
  initFAQAccordion();
  initSmoothScroll();
});

/* --- MODAL CONTROLLER (App Store Coming Soon, Privacy Policy, Terms, Support) --- */
function initModals() {
  const iosModal = document.getElementById('ios-modal');
  const privacyModal = document.getElementById('privacy-modal');
  const termsModal = document.getElementById('terms-modal');
  const supportModal = document.getElementById('support-modal');

  // Trigger buttons for App Store Coming Soon
  const appStoreBtns = document.querySelectorAll('.app-store-trigger');
  appStoreBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(iosModal);
    });
  });

  // Privacy Policy Links
  const privacyLinks = document.querySelectorAll('.privacy-link-trigger');
  privacyLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(privacyModal);
    });
  });

  // Terms Links
  const termsLinks = document.querySelectorAll('.terms-link-trigger');
  termsLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(termsModal);
    });
  });

  // Support Links
  const supportLinks = document.querySelectorAll('.support-link-trigger');
  supportLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(supportModal);
    });
  });

  // Close Buttons
  const closeBtns = document.querySelectorAll('.modal-close-icon, .modal-action-close, .modal-overlay');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target === btn || e.target.classList.contains('modal-close-icon') || e.target.classList.contains('modal-action-close')) {
        closeAllModals();
      }
    });
  });

  // Waitlist Form Submission (Sends real email to facepie.ai@gmail.com via FormSubmit AJAX + LocalStorage)
  const iosForm = document.getElementById('ios-waitlist-form');
  if (iosForm) {
    iosForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = iosForm.querySelector('input[type="email"]');
      const submitBtn = iosForm.querySelector('button[type="submit"]');

      if (emailInput && emailInput.value) {
        const userEmail = emailInput.value.trim();
        const origBtnContent = submitBtn.innerHTML;

        // UI Loading State
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Submitting... ⏳';

        // 1. Save locally in LocalStorage
        saveWaitlistEmailLocally(userEmail);

        try {
          // 2. Background AJAX call to FormSubmit API -> facepie.ai@gmail.com
          const response = await fetch('https://formsubmit.co/ajax/facepie.ai@gmail.com', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              email: userEmail,
              _subject: '🎉 New FacePie iOS Waitlist Subscriber!',
              _captcha: 'false',
              _template: 'table',
              subscriber_email: userEmail,
              timestamp: new Date().toLocaleString()
            })
          });

          if (response.ok) {
            showToast(`🎉 Success! ${userEmail} has been added to the iOS waitlist.`);
          } else {
            showToast(`🎉 You're on the list! Registered ${userEmail}.`);
          }
        } catch (err) {
          console.log('Waitlist subscriber saved:', userEmail);
          showToast(`🎉 You're on the list! Registered ${userEmail}.`);
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origBtnContent;
          emailInput.value = '';
          closeAllModals();
        }
      }
    });
  }
}

// Helper to save waitlist email in LocalStorage
function saveWaitlistEmailLocally(email) {
  try {
    let list = JSON.parse(localStorage.getItem('facepie_ios_waitlist') || '[]');
    const exists = list.some(item => (typeof item === 'string' ? item : item.email) === email);
    if (!exists) {
      list.push({ email: email, date: new Date().toLocaleString() });
      localStorage.setItem('facepie_ios_waitlist', JSON.stringify(list));
    }
  } catch (e) {
    console.error('LocalStorage save error:', e);
  }
}



function openModal(modal) {
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
  document.body.style.overflow = '';
}

/* --- INTERACTIVE PHONE MOCKUP TABS (Hero Media) --- */
function initPhoneTabs() {
  const tabs = document.querySelectorAll('.phone-tab-btn');
  const metricCards = document.querySelectorAll('.floating-metric-card');
  const screenContent = document.getElementById('phone-screen-content');

  const screenViews = {
    symmetry: {
      tag1: { label: 'Symmetry Score', val: '94.2%', icon: '👤' },
      tag2: { label: 'Bone Harmony', val: 'Golden 1:1.618', icon: '✨' },
      laser: true
    },
    color: {
      tag1: { label: 'Undertone', val: 'Warm Autumn 🍂', icon: '🎨' },
      tag2: { label: 'Best Lip Tint', val: 'Terracotta #D47A6A', icon: '💄' },
      laser: false
    },
    nails: {
      tag1: { label: 'Hand Geometry', val: 'Slender Fingers', icon: '💅' },
      tag2: { label: 'Ideal Nail Shape', val: 'Almond (98% Match)', icon: '✨' },
      laser: false
    },
    glowup: {
      tag1: { label: 'Daily Routine', val: '4/4 Completed', icon: '✨' },
      tag2: { label: 'Skin Luminosity', val: '9.4 / 10', icon: '🌟' },
      laser: false
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const viewKey = tab.dataset.view;
      const data = screenViews[viewKey];
      if (!data) return;

      // Update Floating Tags
      if (metricCards[0]) {
        metricCards[0].querySelector('.metric-label').textContent = data.tag1.label;
        metricCards[0].querySelector('.metric-value').textContent = data.tag1.val;
        metricCards[0].querySelector('.metric-icon').textContent = data.tag1.icon;
      }
      if (metricCards[1]) {
        metricCards[1].querySelector('.metric-label').textContent = data.tag2.label;
        metricCards[1].querySelector('.metric-value').textContent = data.tag2.val;
        metricCards[1].querySelector('.metric-icon').textContent = data.tag2.icon;
      }

      // Laser toggle
      const laser = document.querySelector('.laser-scanner');
      if (laser) {
        laser.style.display = data.laser ? 'block' : 'none';
      }
    });
  });
}

/* --- BEFORE & AFTER INTERACTIVE SLIDER --- */
function initBeforeAfterSlider() {
  const container = document.getElementById('before-after-slider');
  if (!container) return;

  const afterImg = container.querySelector('.slider-img.after');
  const handle = container.querySelector('.slider-handle');

  let isDragging = false;

  const updateSlider = (x) => {
    const rect = container.getBoundingClientRect();
    let offsetX = x - rect.left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;

    const percentage = (offsetX / rect.width) * 100;
    afterImg.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  };

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch support
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateSlider(e.touches[0].clientX);
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updateSlider(e.touches[0].clientX);
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

/* --- CORE FEATURE: PERSONAL COLOR PALETTE PICKER --- */
function initPalettePicker() {
  const paletteBtns = document.querySelectorAll('.palette-btn');
  const swatchContainer = document.getElementById('swatch-display-area');

  const palettes = {
    spring: [
      { color: '#F7B2AD', name: 'Soft Peach' },
      { color: '#FFD97D', name: 'Warm Cream' },
      { color: '#60D394', name: 'Fresh Mint' },
      { color: '#EE6055', name: 'Coral Rose' }
    ],
    summer: [
      { color: '#C9E4CA', name: 'Sage Green' },
      { color: '#87BBA2', name: 'Dusty Lavender' },
      { color: '#55828B', name: 'Ocean Blue' },
      { color: '#3B60E4', name: 'Soft Berry' }
    ],
    autumn: [
      { color: '#E29578', name: 'Warm Terracotta' },
      { color: '#DDA15E', name: 'Golden Mustard' },
      { color: '#BC6C25', name: 'Chestnut' },
      { color: '#283618', name: 'Olive Green' }
    ],
    winter: [
      { color: '#2B2D42', name: 'Midnight Navy' },
      { color: '#8D99AE', name: 'Icy Silver' },
      { color: '#D80032', name: 'Pure Crimson' },
      { color: '#FFFFFF', name: 'Crisp White' }
    ]
  };

  paletteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      paletteBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const paletteKey = btn.dataset.season;
      const colors = palettes[paletteKey];
      if (!colors || !swatchContainer) return;

      swatchContainer.innerHTML = colors.map(c => `
        <div class="swatch-circle" style="background-color: ${c.color};" title="${c.name}"></div>
      `).join('');
    });
  });
}

/* --- CORE FEATURE: NAIL SHAPE SELECTOR --- */
function initNailSelector() {
  const nailItems = document.querySelectorAll('.nail-item');
  const nailScoreDisplay = document.getElementById('nail-score-value');

  const nailScores = {
    almond: '98% Match (Best for your finger geometry)',
    coffin: '85% Match',
    oval: '92% Match',
    square: '74% Match'
  };

  nailItems.forEach(item => {
    item.addEventListener('click', () => {
      nailItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      const shape = item.dataset.shape;
      if (nailScoreDisplay && nailScores[shape]) {
        nailScoreDisplay.textContent = nailScores[shape];
      }
    });
  });
}



/* --- FAQ ACCORDION --- */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other accordion items
      faqItems.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --- SMOOTH SCROLL --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* --- TOAST NOTIFICATION HELPER --- */
function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: #121316;
      color: #FFFFFF;
      padding: 14px 28px;
      border-radius: 999px;
      font-weight: 600;
      font-size: 0.92rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 3000;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid rgba(255,255,255,0.2);
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.transform = 'translateX(-50%) translateY(0)';

  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
  }, 4000);
}
