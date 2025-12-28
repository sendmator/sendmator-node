import { HttpClient } from '../utils/http-client';
import {
  SendSMSRequest,
  SendBulkSMSRequest,
  SendmatorResponse,
} from '../types';

/**
 * SMS Resource
 * Send transactional and bulk SMS messages
 */
export class SMS {
  constructor(private http: HttpClient) {}

  /**
   * Send a single SMS message
   *
   * @example
   * ```typescript
   * // Using template key
   * await sendmator.sms.send({
   *   template_key: 'otp-sms',
   *   to: '+1234567890',
   *   variables: {
   *     code: '123456',
   *     app_name: 'MyApp'
   *   }
   * });
   *
   * // Or using template ID
   * await sendmator.sms.send({
   *   template_id: 'uuid-here',
   *   to: '+1234567890',
   *   variables: { code: '123456' }
   * });
   * ```
   */
  async send(data: SendSMSRequest): Promise<SendmatorResponse> {
    // Validate required fields
    if (!data.template_key && !data.template_id) {
      throw new Error('Either template_key or template_id is required');
    }

    if (!data.to) {
      throw new Error('Recipient phone number (to) is required');
    }

    // Validate phone format
    if (!this.isValidPhone(data.to)) {
      throw new Error('Invalid phone number. Must start with + and include country code');
    }

    return this.http.post<SendmatorResponse>('/v1/sms/send', data);
  }

  /**
   * Send bulk SMS to contacts
   *
   * @example
   * ```typescript
   * // Send to all contacts
   * await sendmator.sms.sendBulk({
   *   template_key: 'promotion-sms',
   *   recipient_type: 'all',
   *   variables: { discount: '20%' }
   * });
   *
   * // Send to contacts with specific tags
   * await sendmator.sms.sendBulk({
   *   template_key: 'alert-sms',
   *   recipient_type: 'tag',
   *   tags: ['premium', 'active'],
   *   variables: { message: 'Important update' }
   * });
   *
   * // Send to a specific contact by external ID
   * await sendmator.sms.sendBulk({
   *   template_key: 'order-update',
   *   recipient_type: 'contact',
   *   contact_external_id: 'user-123',
   *   variables: { order_id: 'ORD-456' }
   * });
   * ```
   */
  async sendBulk(data: SendBulkSMSRequest): Promise<SendmatorResponse> {
    // Validate required fields
    if (!data.template_key && !data.template_id) {
      throw new Error('Either template_key or template_id is required');
    }

    if (!data.recipient_type) {
      throw new Error('recipient_type is required (all, tag, or contact)');
    }

    if (data.recipient_type === 'tag' && (!data.tags || data.tags.length === 0)) {
      throw new Error('tags are required when recipient_type is "tag"');
    }

    if (data.recipient_type === 'contact' && !data.contact_external_id) {
      throw new Error('contact_external_id is required when recipient_type is "contact"');
    }

    return this.http.post<SendmatorResponse>('/v1/sms/send-bulk', data);
  }

  /**
   * Get SMS execution status
   *
   * @example
   * ```typescript
   * const status = await sendmator.sms.getExecutionStatus('execution-id');
   * console.log(status.data);
   * ```
   */
  async getExecutionStatus(executionId: string): Promise<SendmatorResponse> {
    if (!executionId) {
      throw new Error('execution_id is required');
    }

    return this.http.get<SendmatorResponse>(`/v1/sms/executions/${executionId}`);
  }

  /**
   * List SMS executions
   *
   * @example
   * ```typescript
   * const executions = await sendmator.sms.listExecutions({
   *   page: 1,
   *   limit: 20
   * });
   * ```
   */
  async listExecutions(params?: { page?: number; limit?: number }): Promise<SendmatorResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    const url = `/v1/sms/executions${query ? `?${query}` : ''}`;

    return this.http.get<SendmatorResponse>(url);
  }

  /**
   * Validate phone format (must start with +)
   */
  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }
}
