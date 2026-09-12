# 🛡️ Cyber Shield X

> An AI-powered cybersecurity platform designed to help users identify, analyze, and understand potentially harmful digital threats.

Cyber Shield X is a full-stack cybersecurity application that combines **Artificial Intelligence, Machine Learning, Natural Language Processing, threat intelligence, and risk analysis** to provide multiple security-analysis capabilities through a modern web interface.

The project is designed as a centralized security platform where users can analyze suspicious URLs, messages, emails, QR codes, OTP-related scenarios, malware-related risks, fraud indicators, and other potentially dangerous digital activities.

---

## ✨ Key Features

### 🔗 URL Scanner
Analyze URLs and evaluate potential security risks associated with suspicious or malicious links.

### 📧 Email Shield
Analyze email-related security threats and identify potentially suspicious or fraudulent content.

### 🔐 OTP Guardian
Provides security-focused analysis for OTP-related scenarios and helps users understand potentially risky authentication situations.

### 📱 Mobile Guardian
Provides a dedicated security-analysis interface for mobile-related threats and suspicious activities.

### 📷 QR Scanner
Provides QR-code security analysis functionality for identifying potentially unsafe QR-based interactions.

### 🦠 Malware Shield
Provides a dedicated interface for malware-related security analysis.

### 🚨 Fraud Visualization
Presents fraud-related security information through visual analysis components.

### 🎯 Opportunity Checker
Provides analysis for potentially suspicious opportunities and helps evaluate associated security risks.

### 🤖 AI Assistant
Provides an AI-powered assistant interface for cybersecurity-related questions and guidance.

### 🧪 Safety Simulator
Allows users to explore security scenarios and understand potential risks in a controlled environment.

### 🔍 What-If Simulator
Provides scenario-based security analysis for understanding how different actions may affect risk.

### 📊 Security History
Maintains structured security-analysis information so users can review previous security events and results.

### 👨‍💼 Admin Dashboard
Provides administrative functionality for managing and reviewing security-related information.

### 🌍 Language Support
Includes a language-selection interface for improving accessibility.

### 🔊 Text-to-Speech
Includes a TTS interface for presenting security information through audio.
```text
backend/models/rf_model.joblib- Incident management


The project also contains a trained Random Forest model:
- Security analysis
- Administrative operations
- LLM-based services
- Authentication

---
- Threat intelligence
- Risk scoring
- Domain analysis

- Machine Learning analysis
- Natural Language Processing

# 🧠 AI & Security Architecture
                         ┌─────────────────────┐
                         │     User / Client    │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   React Frontend    │
                         │      + Vite         │
                         └──────────┬──────────┘
                                    │
                              REST/API Calls
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Python Backend   │
                         │      Flask API      │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
       │ ML Service  │       │ NLP Service │       │ Risk Engine │
       └─────────────┘       └─────────────┘       └─────────────┘
              │                     │                     │
              └─────────────────────┼─────────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Threat Intelligence │
                         │  & Domain Analysis  │
                         └─────────────────────┘
🛠️ Technology Stack
Frontend
React
TypeScript
Vite
Tailwind CSS
JavaScript/TypeScript components
REST API integration
Backend
Python
Flask
REST APIs
SQL/database integration
Authentication and authorization
Modular service architecture
Artificial Intelligence
Machine Learning
Random Forest model
Natural Language Processing
LLM integration
Risk analysis
Data & Database
SQLite
SQLAlchemy
Structured security/incident data
Development Tools
Git
GitHub
VS Code / modern development environment
npm
Python virtual environment
