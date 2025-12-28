import { HttpClient } from '../utils/http-client';
import {
  SendWhatsAppRequest,
  SendBulkWhatsAppRequest,
  SendmatorResponse,
} from '../types';

/**
 * WhatsApp Resource
 * Send WhatsApp messages using approved templates
 */
export class WhatsApp {
  constructor(private http: HttpClient) {}

  /**
   * Send a single WhatsApp message
   *
   * @example
   * ```typescript
   * // Using template key
   * await sendmator.whatsapp.send({
   *   template_key: 'order-confirmation',
   *   to: '+1234567890',
   *   variables: {
   *     customer_name: 'John',
   *     order_id: 'ORD-123',
   *     total: '$99.99'
   *   },
   *   conversation_category: 'utility'
   * });
   *
   * // Or using template ID
   * await sendmator.whatsapp.send({
   *   template_id: 'uuid-here',
   *   to: '+1234567890',
   *   variables: { code: '123456' },
   *   conversation_category: 'authentication'
   * });
   * ```
   */
  async send(data: SendWhatsAppRequest): Promise<SendmatorResponse> {
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

    // Validate conversation category
    if (data.conversation_category) {
      const validCategories = ['marketing', 'utility', 'authentication', 'service'];
      if (!validCategories.includes(data.conversation_category)) {
        throw new Error(
          `conversation_category must be one of: ${validCategories.join(', ')}`
        );
      }
    }

    return this.http.post<SendmatorResponse>('/v1/whatsapp/send', data);
  }

  /**
   * Send bulk WhatsApp messages to contacts
   *
   * @example
   * ```typescript
   * // Send to all contacts
   * await sendmator.whatsapp.sendBulk({
   *   template_key: 'announcement',
   *   recipient_type: 'all',
   *   variables: { message: 'New feature available!' },
   *   conversation_category: 'marketing'
   * });
   *
   * // Send to contacts with specific tags
   * await sendmator.whatsapp.sendBulk({
   *   template_key: 'premium-offer',
   *   recipient_type: 'tag',
   *   tags: ['premium', 'active'],
   *   variables: { offer: '50% off' },
   *   conversation_category: 'marketing'
   * });
   *
   * // Send to a specific contact
   * await sendmator.whatsapp.sendBulk({
   *   template_key: 'order-update',
   *   recipient_type: 'contact',
   *   contact_external_id: 'user-123',
   *   variables: { status: 'Shipped' },
   *   conversation_category: 'utility'
   * });
   * ```
   */
  async sendBulk(data: SendBulkWhatsAppRequest): Promise<SendmatorResponse> {
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

    // Validate conversation category
    if (data.conversation_category) {
      const validCategories = ['marketing', 'utility', 'authentication', 'service'];
      if (!validCategories.includes(data.conversation_category)) {
        throw new Error(
          `conversation_category must be one of: ${validCategories.join(', ')}`
        );
      }
    }

    return this.http.post<SendmatorResponse>('/v1/whatsapp/send-bulk', data);
  }

  /**
   * Get WhatsApp execution status
   *
   * @example
   * ```typescript
   * const status = await sendmator.whatsapp.getExecutionStatus('execution-id');
   * console.log(status.data);
   * ```
   */
  async getExecutionStatus(executionId: string): Promise<SendmatorResponse> {
    if (!executionId) {
      throw new Error('execution_id is required');
    }

    return this.http.get<SendmatorResponse>(`/v1/whatsapp/executions/${executionId}`);
  }

  /**
   * List WhatsApp executions
   *
   * @example
   * ```typescript
   * const executions = await sendmator.whatsapp.listExecutions({
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
    const url = `/v1/whatsapp/executions${query ? `?${query}` : ''}`;

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
