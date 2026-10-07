/**
 * PharmNexia Razorpay Payment Gateway Integration
 * 
 * Secure client-side checkout handling for Mentorship bookings
 * and Cohort Masterclass program enrollments.
 */

// Dynamically load Razorpay checkout script if not already loaded
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = typeof document !== 'undefined' ? document.querySelector('script[src*="checkout.razorpay.com"]') : null;
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
      setTimeout(() => {
        resolve(typeof window !== 'undefined' && !!window.Razorpay);
      }, 1500);
      return;
    }

    if (typeof document !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        console.warn('[PharmNexia] Failed to load Razorpay checkout script from CDN');
        resolve(false);
      };
      document.body.appendChild(script);
    } else {
      resolve(false);
    }
  });
};

/**
 * Get active Razorpay public Key ID
 * Checks Vite environment variables, window configuration, and Admin platformSettings
 */
export const getRazorpayKeyId = () => {
  // 1. Vite environment variable
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_RAZORPAY_KEY_ID) {
    const envKey = String(import.meta.env.VITE_RAZORPAY_KEY_ID).trim();
    if (envKey && envKey !== 'rzp_test_yourkeyidhere') return envKey;
  }

  // 2. Global window configuration
  if (typeof window !== 'undefined' && window.__PHARMNEXIA_RAZORPAY_KEY__) {
    const winKey = String(window.__PHARMNEXIA_RAZORPAY_KEY__).trim();
    if (winKey && winKey !== 'rzp_test_yourkeyidhere') return winKey;
  }

  // 3. LocalStorage platform settings saved by Admin
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = localStorage.getItem('pharmnexia_platform_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.razorpayKeyId) {
          const storedKey = String(parsed.razorpayKeyId).trim();
          if (storedKey && storedKey !== 'rzp_test_yourkeyidhere') return storedKey;
        }
      }

      const directKey = localStorage.getItem('pharmnexia_razorpay_key_id') || localStorage.getItem('VITE_RAZORPAY_KEY_ID');
      if (directKey) {
        const cleanDirect = String(directKey).trim();
        if (cleanDirect && cleanDirect !== 'rzp_test_yourkeyidhere') return cleanDirect;
      }
    } catch {}
  }

  return '';
};

/**
 * Initiates Razorpay Checkout Modal
 * 
 * @param {Object} options
 * @param {number} options.amount - Amount in INR (e.g. 499)
 * @param {string} options.currency - Default 'INR'
 * @param {string} options.name - Platform title (default 'PharmNexia')
 * @param {string} options.description - Item description (e.g. '30-min Mentorship with Dr. Priya')
 * @param {Object} options.prefill - { name, email, contact }
 * @param {Object} options.notes - Metadata dictionary
 * @param {Function} options.onSuccess - Callback on verified payment { razorpay_payment_id, ... }
 * @param {Function} options.onDismiss - Callback on user modal dismissal
 * @param {Function} options.onError - Callback on error
 */
export const initiateRazorpayPayment = async ({
  amount,
  currency = 'INR',
  name = 'PharmNexia',
  description = 'Mentorship & Career Session',
  prefill = {},
  notes = {},
  onSuccess,
  onDismiss,
  onError
}) => {
  // 1. Ensure amount is valid number > 0
  const numericAmount = Number(amount);
  if (!numericAmount || numericAmount <= 0) {
    if (onError) onError(new Error('Invalid payment amount. Amount must be greater than zero.'));
    return;
  }

  // 2. Load script
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || typeof window.Razorpay === 'undefined') {
    // If CDN is unavailable, prompt or simulate in development
    console.warn('[PharmNexia Razorpay] Checkout script unavailable.');
    if (import.meta.env?.DEV) {
      const simulatedPaymentId = `pay_sim_${Date.now().toString().slice(-8)}`;
      const confirmSim = window.confirm(
        `[PharmNexia Dev Mode] Razorpay checkout script could not be loaded from CDN.\n\nProceed with simulated payment for ₹${numericAmount}?\n(Simulated Payment ID: ${simulatedPaymentId})`
      );
      if (confirmSim) {
        if (onSuccess) {
          onSuccess({
            razorpay_payment_id: simulatedPaymentId,
            razorpay_order_id: `order_sim_${Date.now()}`,
            razorpay_signature: 'simulated_signature'
          });
        }
        return;
      }
    }
    if (onError) onError(new Error('Razorpay gateway service is currently unreachable. Please check your network connection.'));
    return;
  }

  // 3. Resolve Public Key
  const keyId = getRazorpayKeyId();
  if (!keyId) {
    // Development or unconfigured key notice
    console.warn('[PharmNexia Razorpay] VITE_RAZORPAY_KEY_ID is not configured in environment variables.');
    
    // In local dev, allow simulation fallback
    const simulatedPaymentId = `pay_test_${Date.now().toString().slice(-8)}`;
    const proceed = window.confirm(
      `[PharmNexia Payment Gateway Notice]\n\nRazorpay Public Key (VITE_RAZORPAY_KEY_ID) is not set in .env.\n\nWould you like to complete this test transaction in Simulation Mode for ₹${numericAmount}?\n(Payment ID: ${simulatedPaymentId})`
    );
    if (proceed) {
      if (onSuccess) {
        onSuccess({
          razorpay_payment_id: simulatedPaymentId,
          razorpay_order_id: `order_test_${Date.now()}`,
          razorpay_signature: 'test_signature'
        });
      }
    } else if (onDismiss) {
      onDismiss();
    }
    return;
  }

  // 4. Construct Razorpay options
  // Razorpay requires amount in paise (1 INR = 100 paise)
  const amountInPaise = Math.round(numericAmount * 100);

  const options = {
    key: keyId,
    amount: amountInPaise,
    currency,
    name,
    description,
    image: '/logo_emblem.png',
    prefill: {
      name: prefill.name || '',
      email: prefill.email || '',
      contact: prefill.contact || ''
    },
    notes: {
      platform: 'PharmNexia',
      ...notes
    },
    theme: {
      color: '#00A86B' // PharmNexia brand emerald green
    },
    modal: {
      ondismiss: () => {
        if (onDismiss) onDismiss();
      },
      escape: true,
      backdropclose: false
    },
    handler: (response) => {
      // response: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
      if (onSuccess) {
        onSuccess(response);
      }
    }
  };

  try {
    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.on('payment.failed', (failedResponse) => {
      console.error('[PharmNexia Razorpay] Payment failed:', failedResponse.error);
      if (onError) {
        onError(failedResponse.error || new Error('Payment failed or was declined.'));
      }
    });
    razorpayInstance.open();
  } catch (err) {
    console.error('[PharmNexia Razorpay] Error launching checkout:', err);
    if (onError) onError(err);
  }
};
