export type ThreatLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ScanType = 'url' | 'qr' | 'message' | 'opportunity' | 'file' | 'otp';

export interface DomainInfo {
  hostname: string;
  is_https: boolean;
  url_length: number;
  contains_ip: number;
  subdomain_count: number;
  domain_age_days: number;
  registration_date: string;
  is_new_domain: boolean;
}

export interface NlpInfo {
  urgency_score: number;
  has_urgency: boolean;
  has_scam_keywords: boolean;
  has_credential_request: boolean;
  has_payment_request: boolean;
  matches: string[];
}

export interface MlInfo {
  model_name: string;
  threat_probability: number;
}

export interface ThreatIntelInfo {
  status: string;
  provider: string;
  positives: number;
  total: number;
  details: string;
}

export interface TechnicalDetails {
  domain?: DomainInfo;
  nlp?: NlpInfo;
  ml?: MlInfo;
  threat_intelligence?: ThreatIntelInfo;
}

export interface ScanResult {
  id?: number;
  scan_type: ScanType;
  target_input: string;
  risk_score: number;
  threat_level: ThreatLevel;
  confidence: number;
  reasons: string[];
  recommendations: string[];
  technical_details?: TechnicalDetails;
  ai_explanation?: string;
  created_at?: string;
  sha256?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'student' | 'admin';
}

export interface DemoPreset {
  id: string;
  label: string;
  type: ScanType;
  input: string;
  context?: Record<string, string>;
  result: ScanResult;
}
