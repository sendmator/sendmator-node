import { HttpClient } from '../utils/http-client';
import {
  SendOTPRequest,
  VerifyOTPRequest,
  SendOTPResponse,
  VerifyOTPResponse,
  SendmatorResponse,
} from '../types';

/**
 * OTP Resource
 * Send and verify One-Time Passwords for authentication
 */
export class OTP {
  constructor(private http: HttpClient) {}

  /**
   * Send an OTP code
   *
   * @example
   * ```typescript
   * // Send OTP via email
   * const response = await sendmator.otp.send({
   *   channel: 'email',
   *   identifier: 'user@example.com',
   *   length: 6,
   *   expiry_seconds: 300
   * });
   *
   * console.log('Session ID:', response.data.session_id);
   *
   * // Send OTP via SMS
   * await sendmator.otp.send({
   *   channel: 'sms',
   *   identifier: '+1234567890',
   *   length: 4
   * });
   *
   * // Send OTP via WhatsApp
   * await sendmator.otp.send({
   *   channel: 'whatsapp',
   *   identifier: '+1234567890'
   * });
   * ```
   */
  async send(data: SendOTPRequest): Promise<SendmatorResponse<SendOTPResponse>> {
    // Validate required fields
    if (!data.channel) {
      throw new Error('channel is required (email, sms, or whatsapp)');
    }

    if (!['email', 'sms', 'whatsapp'].includes(data.channel)) {
      throw new Error('channel must be one of: email, sms, whatsapp');
    }

    if (!data.identifier) {
      throw new Error('identifier is required (email or phone number)');
    }

    // Validate identifier format based on channel
    if (data.channel === 'email' && !this.isValidEmail(data.identifier)) {
      throw new Error('Invalid email address');
    }

    if ((data.channel === 'sms' || data.channel === 'whatsapp') && !this.isValidPhone(data.identifier)) {
      throw new Error('Invalid phone number. Must start with +');
    }

    // Validate OTP length
    if (data.length && (data.length < 4 || data.length > 10)) {
      throw new Error('OTP length must be between 4 and 10');
    }

    // Validate expiry
    if (data.expiry_seconds && (data.expiry_seconds < 60 || data.expiry_seconds > 3600)) {
      throw new Error('Expiry must be between 60 and 3600 seconds');
    }

    return this.http.post<SendmatorResponse<SendOTPResponse>>('/v1/otp/send', data);
  }

  /**
   * Verify an OTP code
   *
   * @example
   * ```typescript
   * const result = await sendmator.otp.verify({
   *   session_id: 'session-id-from-send-response',
   *   code: '123456'
   * });
   *
   * if (result.data.valid) {
   *   console.log('OTP verified successfully!');
   * } else {
   *   console.log('Invalid OTP');
   * }
   * ```
   */
  async verify(data: VerifyOTPRequest): Promise<SendmatorResponse<VerifyOTPResponse>> {
    // Validate required fields
    if (!data.session_id) {
      throw new Error('session_id is required');
    }

    if (!data.code) {
      throw new Error('code is required');
    }

    // Validate code format (should be numeric)
    if (!/^\d+$/.test(data.code)) {
      throw new Error('OTP code must contain only digits');
    }

    return this.http.post<SendmatorResponse<VerifyOTPResponse>>('/v1/otp/verify', data);
  }

  /**
   * Resend an OTP code for an existing session
   *
   * @example
   * ```typescript
   * await sendmator.otp.resend('session-id');
   * ```
   */
  async resend(sessionId: string): Promise<SendmatorResponse<SendOTPResponse>> {
    if (!sessionId) {
      throw new Error('session_id is required');
    }

    return this.http.post<SendmatorResponse<SendOTPResponse>>('/v1/otp/resend', { session_id: sessionId });
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone format (must start with +)
   */
  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }
}
