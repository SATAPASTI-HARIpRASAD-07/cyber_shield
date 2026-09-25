/* ============================================================
   CYBER SHIELD X - EMAIL SERVICE ABSTRACTION LAYER
   ============================================================ */

class CyberShieldEmailService {
  constructor() {
    this.STORAGE_KEY_INBOX = 'cybershield_sent_emails_v1';
    
    // Environment Variables Abstraction Configuration
    this.config = {
      provider: 'CyberShield SMTP Gateway (Simulated abstraction)',
      apiKeyEnvVar: 'CYBER_SHIELD_SMTP_KEY',
      senderEmail: 'noreply@cybershield.io',
      senderName: 'Cyber Shield X Security Suite',
      isProductionConfigured: false // Set to true when process.env.CYBER_SHIELD_SMTP_KEY is present
    };
  }

  getSentEmails() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY_INBOX)) || [];
    } catch (e) {
      return [];
    }
  }

  saveEmail(emailObj) {
    const list = this.getSentEmails();
    list.unshift(emailObj); // add to top
    localStorage.setItem(this.STORAGE_KEY_INBOX, JSON.stringify(list));
    
    // Update badge counter in UI if present
    if (window.app && window.app.updateEmailBadge) {
      window.app.updateEmailBadge(list.length);
    }
  }

  /* ------------------------------------------------------------
     1. TRIGGER WELCOME EMAIL
     ------------------------------------------------------------ */
  sendWelcomeEmail(user) {
    const subject = `Welcome to Cyber Shield X, ${user.fullName}! 🛡️ Your Account is Active`;

    const htmlBody = `
      <div style="font-family: 'Inter', sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 2rem; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #38bdf8;">
        
        <!-- Header -->
        <div style="text-align: center; border-bottom: 1px solid rgba(56, 189, 248, 0.3); padding-bottom: 1rem; margin-bottom: 1.5rem;">
          <h1 style="font-size: 1.8rem; margin: 0; color: #00f0ff; letter-spacing: 1px;">🛡️ CYBER SHIELD X</h1>
          <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.3rem; text-transform: uppercase;">Check Before You Trust</p>
        </div>

        <!-- Greeting -->
        <h2 style="font-size: 1.3rem; color: #ffffff;">Welcome to Cyber Shield, ${user.fullName}! 👋</h2>
        
        <p style="font-size: 0.95rem; color: #94a3b8; line-height: 1.6;">
          Your Cyber Shield X security account has been successfully created and configured for active protection.
        </p>

        <!-- Account Details Summary Box -->
        <div style="background: rgba(18, 26, 43, 0.9); border-left: 4px solid #10b981; padding: 1rem; margin: 1.2rem 0; border-radius: 6px;">
          <p style="margin: 0; font-size: 0.85rem; color: #94a3b8;"><strong>Account Name:</strong> ${user.fullName}</p>
          <p style="margin: 0.4rem 0 0 0; font-size: 0.85rem; color: #94a3b8;"><strong>Registered Email:</strong> ${user.email}</p>
          <p style="margin: 0.4rem 0 0 0; font-size: 0.85rem; color: #94a3b8;"><strong>Protection Status:</strong> <span style="color: #10b981; font-weight: bold;">🟢 ACTIVE & PROTECTED</span></p>
          <p style="margin: 0.4rem 0 0 0; font-size: 0.85rem; color: #94a3b8;"><strong>Account ID:</strong> <code>${user.id}</code></p>
        </div>

        <!-- Explanation of Cyber Shield -->
        <h3 style="font-size: 1.05rem; color: #00f0ff; margin-top: 1.5rem;">What is Cyber Shield X?</h3>
        <p style="font-size: 0.9rem; color: #94a3b8; line-height: 1.5;">
          Cyber Shield X is your intelligent 3D cyber threat detection suite. It analyzes incoming web links, scam emails, fake internship offers, QR code links, and suspicious file attachments to protect you from online fraud before you trust.
        </p>

        <!-- 3 Essential Student Security Rules -->
        <div style="background: rgba(13, 20, 36, 0.8); border: 1px solid rgba(56, 189, 248, 0.3); padding: 1rem; border-radius: 8px; margin: 1.2rem 0;">
          <h4 style="margin: 0 0 0.6rem 0; font-size: 0.9rem; color: #f59e0b;">🛡️ 3 GOLDEN CYBER SECURITY RULES:</h4>
          <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.88rem; color: #94a3b8;">
            <li style="margin-bottom: 0.4rem;"><strong>Never Share Your OTP:</strong> Bank agents and university staff will NEVER ask for your One-Time Password.</li>
            <li style="margin-bottom: 0.4rem;"><strong>No Upfront Internship Fees:</strong> Real job offers never demand laptop fees or application deposits.</li>
            <li style="margin-bottom: 0.4rem;"><strong>Inspect Shortened URLs:</strong> Always check destination links in Cyber Shield before logging in.</li>
          </ul>
        </div>

        <!-- Action Button -->
        <div style="text-align: center; margin: 2rem 0 1rem 0;">
          <a href="#" style="background: linear-gradient(135deg, #0284c7 0%, #00f0ff 100%); color: #070a12; padding: 0.8rem 1.8rem; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 0.95rem; display: inline-block;">
            LAUNCH CYBER SHIELD DASHBOARD
          </a>
        </div>

        <!-- Footer Notice & Abstraction Log -->
        <div style="border-top: 1px solid rgba(56, 189, 248, 0.2); padding-top: 1rem; font-size: 0.75rem; color: #64748b; text-align: center;">
          <p style="margin: 0;">Cyber Shield X Security Suite &bull; Automated System Notification</p>
          <p style="margin: 0.3rem 0 0 0;">
            <em>[Email Service Abstraction Layer: Dispatched via ${this.config.provider}. Configured API Key Env Var: <code>${this.config.apiKeyEnvVar}</code>]</em>
          </p>
        </div>

      </div>
    `;

    const emailRecord = {
      id: 'eml_' + Date.now(),
      to: user.email,
      toName: user.fullName,
      subject,
      htmlBody,
      sentAt: new Date().toISOString(),
      type: 'WELCOME_EMAIL',
      providerInfo: `Env Var Required: process.env.${this.config.apiKeyEnvVar}`
    };

    this.saveEmail(emailRecord);
    return emailRecord;
  }

  /* ------------------------------------------------------------
     2. TRIGGER PASSWORD RESET EMAIL
     ------------------------------------------------------------ */
  sendPasswordResetEmail(user, resetToken) {
    const subject = `Cyber Shield X Password Reset Request [Code: ${resetToken}]`;

    const htmlBody = `
      <div style="font-family: 'Inter', sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 2rem; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #ef4444;">
        
        <div style="text-align: center; border-bottom: 1px solid rgba(239, 68, 68, 0.3); padding-bottom: 1rem; margin-bottom: 1.5rem;">
          <h1 style="font-size: 1.8rem; margin: 0; color: #ef4444; letter-spacing: 1px;">🔐 PASSWORD RESET REQUEST</h1>
          <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.3rem;">CYBER SHIELD X SECURITY SYSTEM</p>
        </div>

        <p style="font-size: 0.95rem; color: #94a3b8;">Hello ${user.fullName},</p>
        
        <p style="font-size: 0.95rem; color: #94a3b8; line-height: 1.5;">
          A password reset request was initiated for your Cyber Shield X account (<strong>${user.email}</strong>).
        </p>

        <div style="background: rgba(239, 68, 68, 0.15); border: 2px dashed #ef4444; padding: 1.5rem; text-align: center; border-radius: 10px; margin: 1.5rem 0;">
          <p style="margin: 0; font-size: 0.8rem; color: #94a3b8; text-transform: uppercase;">YOUR SECURE RESET CODE</p>
          <div style="font-size: 2.2rem; font-weight: 800; color: #ffffff; letter-spacing: 4px; font-family: monospace; margin: 0.5rem 0;">
            ${resetToken}
          </div>
          <p style="margin: 0; font-size: 0.75rem; color: #ef4444;">Valid for 15 minutes. Do not share this code.</p>
        </div>

        <p style="font-size: 0.85rem; color: #64748b;">
          If you did not request a password reset, please ignore this email. Your password will remain unchanged.
        </p>
      </div>
    `;

    const emailRecord = {
      id: 'eml_' + Date.now(),
      to: user.email,
      toName: user.fullName,
      subject,
      htmlBody,
      sentAt: new Date().toISOString(),
      type: 'PASSWORD_RESET',
      resetToken
    };

    this.saveEmail(emailRecord);
    return emailRecord;
  }
}

window.CyberShieldEmailService = new CyberShieldEmailService();
