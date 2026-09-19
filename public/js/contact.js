/**
 * CONTACT FORM & INTERACTIVE WIDGETS
 * Form validation • Live Timezone Clock • Copy to Clipboard with Toast
 */

import { api } from './api.js';

export const initContact = () => {
  // 1. Live Timezone Clock (IST UTC+5:30)
  const clockElement = document.querySelector('#live-time-clock');
  if (clockElement) {
    const updateClock = () => {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatter = new Intl.DateTimeFormat([], options);
      clockElement.textContent = `${formatter.format(new Date())} IST (UTC+5:30)`;
    };

    updateClock();
    setInterval(updateClock, 1000);
  }

  // 2. Copy Email to Clipboard with Toast
  const copyBtn = document.querySelector('#copy-email-btn');
  const toast = document.querySelector('#toast-notify');

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3000);
  };

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.dataset.email || 'sabith.developer@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        showToast(`✓ Copied ${email} to clipboard`);
      } catch (err) {
        showToast(`Email: ${email}`);
      }
    });
  }

  // 3. Contact Form Validation & Asynchronous Submission
  const contactForm = document.querySelector('#contact-form');
  const statusMsg = document.querySelector('#form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = contactForm.querySelector('#form-name');
      const emailInput = contactForm.querySelector('#form-email');
      const msgInput = contactForm.querySelector('#form-message');
      const submitBtn = contactForm.querySelector('#form-submit-btn');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = msgInput ? msgInput.value.trim() : '';

      // Reset status
      if (statusMsg) {
        statusMsg.className = 'form-status-message';
        statusMsg.style.display = 'none';
      }

      // Client-side validation
      if (name.length < 2) {
        showFormStatus('Please enter your full name (at least 2 characters).', 'is-error');
        if (nameInput) nameInput.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormStatus('Please enter a valid email address.', 'is-error');
        if (emailInput) emailInput.focus();
        return;
      }

      if (message.length < 10) {
        showFormStatus('Please provide a message with at least 10 characters.', 'is-error');
        if (msgInput) msgInput.focus();
        return;
      }

      // UI Loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending Transmission...';
      }

      try {
        const result = await api.submitContact({ name, email, message });
        if (result.success) {
          showFormStatus(result.message || 'Thank you! Your message has been received.', 'is-success');
          contactForm.reset();
        } else {
          showFormStatus(result.message || 'Submission error. Please try again.', 'is-error');
        }
      } catch (err) {
        showFormStatus('Network error while transmitting message. Please try direct email.', 'is-error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send Message <span class="arrow-shift-hover">→</span>';
        }
      }
    });

    const showFormStatus = (text, typeClass) => {
      if (!statusMsg) return;
      statusMsg.textContent = text;
      statusMsg.className = `form-status-message ${typeClass}`;
      statusMsg.style.display = 'block';
    };
  }
};
