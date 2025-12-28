/**
 * Sendmator SDK Configuration
 */
export interface SendmatorConfig {
  /** Your Sendmator API key (starts with sk_) */
  apiKey: string;
  /** Optional: Override base URL (defaults to https://api.sendmator.com) */
  baseURL?: string;
  /** Optional: Request timeout in milliseconds (defaults to 30000) */
  timeout?: number;
  /** Optional: Team ID for team-scoped requests */
  teamId?: string;
}

/**
 * Contact Types
 */
export interface Contact {
  id?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
  preferences?: ContactPreferences;
}

export interface ContactPreferences {
  email?: ChannelPreferences;
  sms?: ChannelPreferences;
  whatsapp?: ChannelPreferences;
}

export interface ChannelPreferences {
  transactional?: boolean;
  promotional?: boolean;
  utility?: boolean;
  marketing?: boolean;
}

export interface CreateContactRequest {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
}

export interface UpdateContactRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
  preferences?: ContactPreferences;
}

export interface ListContactsRequest {
  page?: number;
  limit?: number;
  tags?: string[];
  search?: string;
}

/**
 * Email Types
 */
export interface SendEmailRequest {
  /** Template key (e.g., 'welcome-email') */
  template_key?: string;
  /** Or template UUID */
  template_id?: string;
  /** Recipient email */
  to: string;
  /** Optional: Override sender email */
  from?: string;
  /** Optional: Override sender name */
  from_name?: string;
  /** Template variables */
  variables?: Record<string, any>;
  /** Optional: Override subject */
  subject?: string;
  /** Optional: Reply-to email */
  reply_to?: string;
  /** Optional: Custom metadata */
  metadata?: Record<string, any>;
}

export interface SendBulkEmailRequest {
  template_key?: string;
  template_id?: string;
  recipient_type: 'all' | 'tag' | 'contact';
  tags?: string[];
  contact_external_id?: string;
  from?: string;
  from_name?: string;
  variables?: Record<string, any>;
  subject?: string;
  metadata?: Record<string, any>;
}

/**
 * SMS Types
 */
export interface SendSMSRequest {
  template_key?: string;
  template_id?: string;
  to: string;
  variables?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface SendBulkSMSRequest {
  template_key?: string;
  template_id?: string;
  recipient_type: 'all' | 'tag' | 'contact';
  tags?: string[];
  contact_external_id?: string;
  variables?: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * WhatsApp Types
 */
export interface SendWhatsAppRequest {
  template_key?: string;
  template_id?: string;
  to: string;
  variables?: Record<string, any>;
  conversation_category?: 'marketing' | 'utility' | 'authentication' | 'service';
  metadata?: Record<string, any>;
}

export interface SendBulkWhatsAppRequest {
  template_key?: string;
  template_id?: string;
  recipient_type: 'all' | 'tag' | 'contact';
  tags?: string[];
  contact_external_id?: string;
  variables?: Record<string, any>;
  conversation_category?: 'marketing' | 'utility' | 'authentication' | 'service';
  metadata?: Record<string, any>;
}

/**
 * OTP Types
 */
export interface SendOTPRequest {
  /** Email, phone, or whatsapp */
  channel: 'email' | 'sms' | 'whatsapp';
  /** Recipient identifier (email or phone) */
  identifier: string;
  /** Optional: OTP length (default: 6) */
  length?: number;
  /** Optional: Expiry in seconds (default: 300) */
  expiry_seconds?: number;
  /** Optional: Custom metadata */
  metadata?: Record<string, any>;
}

export interface VerifyOTPRequest {
  /** Session ID from send response */
  session_id: string;
  /** OTP code to verify */
  code: string;
}

export interface SendOTPResponse {
  success: boolean;
  session_id: string;
  expires_at: string;
  channel: string;
  identifier: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  valid: boolean;
  session_id: string;
  message: string;
}

/**
 * API Response Types
 */
export interface SendmatorResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Error Types
 */
export class SendmatorError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'SendmatorError';
    Object.setPrototypeOf(this, SendmatorError.prototype);
  }
}
