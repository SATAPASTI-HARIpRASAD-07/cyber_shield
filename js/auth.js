/* ============================================================
   CYBER SHIELD X - ACTIVE SESSION AUTHENTICATION HELPER
   ============================================================ */

class CyberShieldAuth {
  constructor() {
    this.defaultUser = {
      id: 'usr_demo_101',
      fullName: 'NEELAPU MOHAN SAI',
      email: 'demo@cybershield.io',
      createdAt: '2026-08-29T00:00:00Z',
      lastLogin: new Date().toISOString(),
      status: 'PROTECTED'
    };
  }

  isAuthenticated() {
    return true;
  }

  getCurrentUser() {
    return this.defaultUser;
  }

  async resendWelcomeEmail(email) {
    const targetEmail = email || this.defaultUser.email;
    const res = await fetch('http://localhost:5000/api/resend-welcome-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: targetEmail })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to dispatch welcome email.');
    }
    return data;
  }

  evaluatePasswordStrength(password) {
    if (!password) return { score: 0, label: 'Empty', color: '#64748b' };
    if (password.length < 6) return { score: 25, label: 'Weak', color: '#ef4444' };
    if (password.length < 10) return { score: 60, label: 'Medium', color: '#f59e0b' };
    return { score: 100, label: 'Cyber Shield Secure 🛡️', color: '#10b981' };
  }
}

window.CyberShieldAuth = CyberShieldAuth;
