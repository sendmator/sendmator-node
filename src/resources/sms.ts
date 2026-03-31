import { HttpClient } from '../utils/http-client';
import { SendSMSRequest, SendmatorResponse } from '../types';

export class SMS {
  constructor(private http: HttpClient) {}

  /**
   * Send SMS to a phone number directly (no contact required)
   *
   * @param phoneNumber - Phone number with country code (e.g., '+14155552671')
   * @param options - SMS options
   * @returns Promise with trigger_id and job_id
   *
   * @example
   * ```typescript
   * await sendmator.sms.sendTo('+14155552671', {
   *   template_key: 'otp-sms',
   *   variables: { code: '123456' }
   * });
   * ```
   */
  async sendTo(
    phoneNumber: string,
    options: {
      template_key: string;
      variables?: Record<string, any>;
      sms_identity_id?: string;
      metadata?: Record<string, any>;
      trigger_at?: string;
    }
  ): Promise<SendmatorResponse> {
    const payload: any = {
      recipient_type: 'direct_sms',
      direct_sms: phoneNumber,
      template_key: options.template_key,
    };

    if (options.variables) payload.variables = options.variables;
    if (options.sms_identity_id) payload.sms_identity_id = options.sms_identity_id;
    if (options.metadata) payload.metadata = options.metadata;
    if (options.trigger_at) payload.trigger_at = options.trigger_at;

    return this.send(payload);
  }

  /**
   * Send SMS to an existing contact by their external ID
   *
   * @param externalId - Contact's external ID
   * @param options - SMS options
   * @returns Promise with trigger_id and job_id
   *
   * @example
   * ```typescript
   * await sendmator.sms.sendToContact('user-123', {
   *   template_key: 'order-shipped',
   *   variables: { orderNumber: '#12345' }
   * });
   * ```
   */
  async sendToContact(
    externalId: string,
    options: {
      template_key: string;
      variables?: Record<string, any>;
      sms_identity_id?: string;
      metadata?: Record<string, any>;
      trigger_at?: string;
    }
  ): Promise<SendmatorResponse> {
    const payload: any = {
      recipient_type: 'contact',
      contact_external_id: externalId,
      template_key: options.template_key,
    };

    if (options.variables) payload.variables = options.variables;
    if (options.sms_identity_id) payload.sms_identity_id = options.sms_identity_id;
    if (options.metadata) payload.metadata = options.metadata;
    if (options.trigger_at) payload.trigger_at = options.trigger_at;

    return this.send(payload);
  }

  /**
   * Send SMS to contacts with specific tags
   *
   * @param tags - Array of tag names
   * @param options - SMS options
   * @returns Promise with trigger_id and job_id
   *
   * @example
   * ```typescript
   * await sendmator.sms.sendToTags(['customer', 'vip'], {
   *   template_key: 'flash-sale',
   *   variables: { discount: '50%' }
   * });
   * ```
   */
  async sendToTags(
    tags: string[],
    options: {
      template_key: string;
      variables?: Record<string, any>;
      sms_identity_id?: string;
      metadata?: Record<string, any>;
      trigger_at?: string;
    }
  ): Promise<SendmatorResponse> {
    const payload: any = {
      recipient_type: 'tag',
      tags: tags,
      template_key: options.template_key,
    };

    if (options.variables) payload.variables = options.variables;
    if (options.sms_identity_id) payload.sms_identity_id = options.sms_identity_id;
    if (options.metadata) payload.metadata = options.metadata;
    if (options.trigger_at) payload.trigger_at = options.trigger_at;

    return this.send(payload);
  }

  /**
   * Send SMS to all contacts (broadcast)
   *
   * @param options - SMS options
   * @returns Promise with trigger_id and job_id
   *
   * @example
   * ```typescript
   * await sendmator.sms.sendToAll({
   *   template_key: 'announcement',
   *   variables: { message: 'New feature available!' }
   * });
   * ```
   */
  async sendToAll(
    options: {
      template_key: string;
      variables?: Record<string, any>;
      sms_identity_id?: string;
      metadata?: Record<string, any>;
      trigger_at?: string;
    }
  ): Promise<SendmatorResponse> {
    const payload: any = {
      recipient_type: 'all',
      template_key: options.template_key,
    };

    if (options.variables) payload.variables = options.variables;
    if (options.sms_identity_id) payload.sms_identity_id = options.sms_identity_id;
    if (options.metadata) payload.metadata = options.metadata;
    if (options.trigger_at) payload.trigger_at = options.trigger_at;

    return this.send(payload);
  }

  /**
   * Low-level SMS send method with full control over all parameters
   * Use convenience methods (sendTo, sendToContact, etc.) for simpler use cases
   */
  async send(data: SendSMSRequest): Promise<SendmatorResponse> {
    if (!data.template_key) throw new Error('template_key is required');
    if (!data.recipient_type) throw new Error('recipient_type is required');

    if (data.recipient_type === 'direct_sms' && !data.direct_sms) {
      throw new Error('direct_sms is required when recipient_type is "direct_sms"');
    }
    if (data.recipient_type === 'contact' && !data.contact_external_id) {
      throw new Error('contact_external_id is required when recipient_type is "contact"');
    }
    if (data.recipient_type === 'tag' && (!data.tag || data.tag.length === 0)) {
      throw new Error('tag is required when recipient_type is "tag"');
    }

    return this.http.post<SendmatorResponse>('/v1/sms/send', data);
  }

  async getExecutionStatus(executionId: string): Promise<SendmatorResponse> {
    if (!executionId) throw new Error('execution_id is required');
    return this.http.get<SendmatorResponse>(`/v1/sms/executions/${executionId}`);
  }

  async listExecutions(params?: { page?: number; limit?: number }): Promise<SendmatorResponse> {
    const q = new URLSearchParams();
    if (params?.page) q.append('page', params.page.toString());
    if (params?.limit) q.append('limit', params.limit.toString());
    const query = q.toString();
    return this.http.get<SendmatorResponse>(`/v1/sms/executions${query ? `?${query}` : ''}`);
  }
}
