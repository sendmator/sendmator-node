import { HttpClient } from '../utils/http-client';
import {
  SendEmailRequest,
  SendBulkEmailRequest,
  SendmatorResponse,
} from '../types';

/**
 * Email Resource
 * Send transactional and bulk emails
 */
export class Email {
  constructor(private http: HttpClient) {}

  /**
   * Send a single email
   *
   * @example
   * ```typescript
   * // Using template key
   * await sendmator.email.send({
   *   template_key: 'welcome-email',
   *   to: 'user@example.com',
   *   variables: {
   *     first_name: 'John',
   *     verification_url: 'https://app.example.com/verify'
   *   }
   * });
   *
   * // Or using template ID
   * await sendmator.email.send({
   *   template_id: 'uuid-here',
   *   to: 'user@example.com',
   *   variables: { name: 'John' }
   * });
   * ```
   */
  async send(data: SendEmailRequest): Promise<SendmatorResponse> {
    // Validate required fields
    if (!data.template_key && !data.template_id) {
      throw new Error('Either template_key or template_id is required');
    }

    if (!data.to) {
      throw new Error('Recipient email (to) is required');
    }

    return this.http.post<SendmatorResponse>('/v1/email/send', data);
  }

  /**
   * Send bulk emails to contacts
   *
   * @example
   * ```typescript
   * // Send to all contacts
   * await sendmator.email.sendBulk({
   *   template_key: 'newsletter',
   *   recipient_type: 'all',
   *   variables: { month: 'December' }
   * });
   *
   * // Send to contacts with specific tags
   * await sendmator.email.sendBulk({
   *   template_key: 'promotion',
   *   recipient_type: 'tag',
   *   tags: ['premium', 'active'],
   *   variables: { discount: '20%' }
   * });
   *
   * // Send to a specific contact by external ID
   * await sendmator.email.sendBulk({
   *   template_key: 'order-confirmation',
   *   recipient_type: 'contact',
   *   contact_external_id: 'user-123',
   *   variables: { order_id: 'ORD-456' }
   * });
   * ```
   */
  async sendBulk(data: SendBulkEmailRequest): Promise<SendmatorResponse> {
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

    return this.http.post<SendmatorResponse>('/v1/email/send-bulk', data);
  }

  /**
   * Get email execution status
   *
   * @example
   * ```typescript
   * const status = await sendmator.email.getExecutionStatus('execution-id');
   * ```
   */
  async getExecutionStatus(executionId: string): Promise<SendmatorResponse> {
    return this.http.get<SendmatorResponse>(`/v1/email/executions/${executionId}`);
  }

  /**
   * List email executions
   *
   * @example
   * ```typescript
   * const executions = await sendmator.email.listExecutions({
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
    const url = `/v1/email/executions${query ? `?${query}` : ''}`;

    return this.http.get<SendmatorResponse>(url);
  }
}
