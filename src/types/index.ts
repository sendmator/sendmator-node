/**
 * Sendmator SDK Configuration
 */
export interface SendmatorConfig {
  /** Your Sendmator API key (starts with sk_) */
  apiKey: string;
  /** Optional: Override base URL (defaults to https://api.sendmator.com/api) */
  baseURL?: string;
  /** Optional: Request timeout in milliseconds (defaults to 30000) */
  timeout?: number;
  /** Optional: Team ID for team-scoped requests */
  teamId?: string;
}

/**
 * Recipient Types
 */
export type RecipientType = 'contact' | 'tag' | 'segment' | 'all' | 'direct_email' | 'direct_sms' | 'direct_whatsapp';

/**
 * Message Channel
 */
export type MessageChannel = 'email' | 'sms' | 'whatsapp';

/**
 * WhatsApp Conversation Category
 */
export type WhatsAppConversationCategory = 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';

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
  fcm_token?: string;
  apns_token?: string;
}

export interface ContactPreferences {
  email?: ChannelPreferences;
  sms?: ChannelPreferences;
  whatsapp?: ChannelPreferences;
  push?: ChannelPreferences;
}

export interface ChannelPreferences {
  transactional?: boolean;
  promotional?: boolean;
  utility?: boolean;
  conversational?: boolean;
  marketing?: boolean;
  service?: boolean;
  system?: boolean;
}

export interface CreateContactRequest {
  external_id?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  tags?: string[];
  is_active?: boolean;
  custom_fields?: Record<string, any>;
  metadata?: Record<string, any>;
  preferences?: ContactPreferences;
}

export interface UpdateContactRequest {
  external_id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  tags?: string[];
  is_active?: boolean;
  custom_fields?: Record<string, any>;
  metadata?: Record<string, any>;
  preferences?: ContactPreferences;
}

export interface BulkCreateContactsRequest {
  contacts: CreateContactRequest[];
}

export interface BulkCreateResult {
  created: Contact[];
  skipped: {
    email: string;
    external_id?: string;
    reason: string;
  }[];
  errors: {
    email: string;
    error: string;
  }[];
  user_id: string;
  total_processed: number;
  summary: {
    created_count: number;
    skipped_count: number;
    error_count: number;
  };
}

export interface ListContactsRequest {
  page?: number;
  limit?: number;
  tags?: string[];
  search?: string;
  email?: string;
  is_active?: boolean;
  is_unsubscribed?: boolean;
  sort_by?: 'created_at' | 'updated_at' | 'email' | 'first_name' | 'last_name';
  sort_order?: 'ASC' | 'DESC';
}

/**
 * Preference Types
 */
export type PreferenceChannel = 'email' | 'sms' | 'whatsapp' | 'push';
export type PreferenceCategory = 'transactional' | 'promotional' | 'utility' | 'conversational' | 'marketing' | 'service' | 'system';

export interface PreferenceSummary {
  preferences: ContactPreferences;
  totalPreferences: number;
  subscribedCount: number;
  unsubscribedCount: number;
  subscriptionRate: number;
}

export interface SetSinglePreferenceRequest {
  subscribed: boolean;
}

export interface SetPreferencesRequest {
  preferences: {
    channel: PreferenceChannel;
    category: PreferenceCategory;
    subscribed: boolean;
  }[];
}

/**
 * Email Types
 */
export interface SendEmailRequest {
  /** Template key (e.g., 'welcome-email') - required unless using subject/content */
  template_key?: string;
  /** Message channels - defaults to ['email'] */
  channel?: MessageChannel[];
  /** How to select recipients */
  recipient_type: RecipientType;
  /** Contact external_id (required when recipient_type = 'contact') */
  contact_external_id?: string;
  /** Direct email address (for recipient_type = 'direct_email') */
  direct_email?: string;
  /** Direct recipient first name (optional, for direct_email) */
  direct_first_name?: string;
  /** Direct recipient last name (optional, for direct_email) */
  direct_last_name?: string;
  /** Tag names (required when recipient_type = 'tag') */
  tag?: string[];
  /** Tags array for bulk tag targeting (alternative to tag) */
  tags?: string[];
  /** Segment ID (required when recipient_type = 'segment') */
  segment_id?: string;
  /** Email subject (required if not using template_key) */
  subject?: string;
  /** Email HTML content (required if not using template_key) */
  content?: string;
  /** Email plain text content */
  plain_text_content?: string;
  /** Optional: Override sender email */
  from?: string;
  /** Optional: Override sender email (alternative field name) */
  from_email?: string;
  /** Optional: Override sender name */
  from_name?: string;
  /** Template variables */
  variables?: Record<string, any>;
  /** Optional: Reply-to email */
  reply_to?: string;
  /** Optional: Custom metadata */
  metadata?: Record<string, any>;
  /** Optional: UTC timestamp for scheduled execution (ISO 8601) */
  triggerAt?: string;
  /** Optional: UTC timestamp for scheduled execution (alternative field name) */
  trigger_at?: string;
}

/**
 * SMS Types
 */
export interface SendSMSRequest {
  /** Template key (e.g., 'otp-sms') */
  template_key: string;
  /** Message channels - defaults to ['sms'] */
  channel?: MessageChannel[];
  /** How to select recipients */
  recipient_type: RecipientType;
  /** Contact external_id (required when recipient_type = 'contact') */
  contact_external_id?: string;
  /** Direct phone number (for recipient_type = 'direct_sms') */
  direct_sms?: string;
  /** Tag names (required when recipient_type = 'tag') */
  tag?: string[];
  /** Tags array for bulk tag targeting (alternative to tag) */
  tags?: string[];
  /** Template variables */
  variables?: Record<string, any>;
  /** Optional: Custom metadata */
  metadata?: Record<string, any>;
  /** Optional: UTC timestamp for scheduled execution (ISO 8601) */
  triggerAt?: string;
  /** Optional: UTC timestamp for scheduled execution (alternative field name) */
  trigger_at?: string;
  /** Optional: SMS identity to use */
  sms_identity_id?: string;
}

/**
 * WhatsApp Types
 */
export interface SendWhatsAppRequest {
  /** Template key (e.g., 'order-confirmation') */
  template_key: string;
  /** Message channels - defaults to ['whatsapp'] */
  channel?: MessageChannel[];
  /** How to select recipients */
  recipient_type: RecipientType;
  /** Contact external_id (required when recipient_type = 'contact') */
  contact_external_id?: string;
  /** Direct WhatsApp number (for recipient_type = 'direct_whatsapp') */
  direct_whatsapp?: string;
  /** Tag names (required when recipient_type = 'tag') */
  tag?: string[];
  /** Tags array for bulk tag targeting (alternative to tag) */
  tags?: string[];
  /** Template variables */
  variables?: Record<string, any>;
  /** WhatsApp conversation category */
  conversation_category: WhatsAppConversationCategory;
  /** Optional: Custom metadata */
  metadata?: Record<string, any>;
  /** Optional: UTC timestamp for scheduled execution (ISO 8601) */
  triggerAt?: string;
  /** Optional: UTC timestamp for scheduled execution (alternative field name) */
  trigger_at?: string;
  /** Optional: WhatsApp identity to use */
  whatsapp_identity_id?: string;
  /** Optional: Campaign name for tracking */
  campaign_name?: string;
}

/**
 * OTP Types
 */
export interface SendOTPRequest {
  /** Channels to send OTP on */
  channels: ('email' | 'sms' | 'whatsapp')[];
  /** Recipients for each channel */
  recipients: {
    email?: string;
    sms?: string;
    whatsapp?: string;
  };
  /** Optional: Custom metadata */
  metadata?: Record<string, any>;
  /** Optional: Whether to add verified contacts to contacts table */
  add_contact?: boolean;
  /** Optional: Sandbox mode - returns OTPs in response */
  sandbox_mode?: boolean;
}

export interface VerifyOTPRequest {
  /** Session token from send response */
  session_token: string;
  /** OTPs for each channel to verify */
  otps: {
    email?: string;
    sms?: string;
    whatsapp?: string;
  };
}

export interface ResendOTPRequest {
  /** Session token to resend OTP for */
  session_token: string;
}

export interface SendOTPResponse {
  success: boolean;
  data: {
    session_id: string;
    expires_at: string;
    channels: string[];
    recipients: Record<string, string>;
    /** Only present in sandbox mode */
    otps?: Record<string, string>;
  };
}

export interface VerifyOTPResponse {
  success: boolean;
  data: {
    verified: boolean;
    verification_results: {
      email?: { success: boolean; message?: string };
      sms?: { success: boolean; message?: string };
      whatsapp?: { success: boolean; message?: string };
    };
  };
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
