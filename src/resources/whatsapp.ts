import { HttpClient } from '../utils/http-client';
import { SendWhatsAppRequest, SendmatorResponse, WhatsAppConversationCategory } from '../types';

export class WhatsApp {
  constructor(private http: HttpClient) {}

  /**
   * Send WhatsApp message to a phone number directly (no contact required)
   *
   * @param phoneNumber - Phone number with country code (e.g., '+14155552671')
   * @param options - WhatsApp message options
   * @returns Promise with trigger_id and job_id
   *
   * @example
   * ```typescript
   * await sendmator.whatsapp.sendTo('+14155552671', {
   *   template_key: 'order-confirmation',
   *   conversation_category: 'UTILITY',
   *   variables: { orderNumber: '#12345' }
   * });
   * ```
   */
  async sendTo(
    phoneNumber: string,
    options: {
      template_key: string;
      conversation_category: WhatsAppConversationCategory;
      variables?: Record<string, any>;
      whatsapp_identity_id?: string;
      campaign_name?: string;
      metadata?: Record<string, any>;
      trigger_at?: string;
    }
  ): Promise<SendmatorResponse> {
    const payload: any = {
      recipient_type: 'direct_whatsapp',
      direct_whatsapp: phoneNumber,
      template_key: options.template_key,
      conversation_category: options.conversation_category,
    };

    if (options.variables) payload.variables = options.variables;
    if (options.whatsapp_identity_id) payload.whatsapp_identity_id = options.whatsapp_identity_id;
    if (options.campaign_name) payload.campaign_name = options.campaign_name;
    if (options.metadata) payload.metadata = options.metadata;
    if (options.trigger_at) payload.trigger_at = options.trigger_at;

    return this.send(payload);
  }

  /**
   * Send WhatsApp message to an existing contact by their external ID
   *
   * @param externalId - Contact's external ID
   * @param options - WhatsApp message options
   * @returns Promise with trigger_id and job_id
   *
   * @example
   * ```typescript
   * await sendmator.whatsapp.sendToContact('user-123', {
   *   template_key: 'appointment-reminder',
   *   conversation_category: 'UTILITY',
   *   variables: { date: 'Feb 1', time: '2:00 PM' }
   * });
   * ```
   */
  async sendToContact(
    externalId: string,
    options: {
      template_key: string;
      conversation_category: WhatsAppConversationCategory;
      variables?: Record<string, any>;
      whatsapp_identity_id?: string;
      campaign_name?: string;
      metadata?: Record<string, any>;
      trigger_at?: string;
    }
  ): Promise<SendmatorResponse> {
    const payload: any = {
      recipient_type: 'contact',
      contact_external_id: externalId,
      template_key: options.template_key,
      conversation_category: options.conversation_category,
    };

    if (options.variables) payload.variables = options.variables;
    if (options.whatsapp_identity_id) payload.whatsapp_identity_id = options.whatsapp_identity_id;
    if (options.campaign_name) payload.campaign_name = options.campaign_name;
    if (options.metadata) payload.metadata = options.metadata;
    if (options.trigger_at) payload.trigger_at = options.trigger_at;

    return this.send(payload);
  }

  /**
   * Send WhatsApp message to contacts with specific tags
   *
   * @param tags - Array of tag names
   * @param options - WhatsApp message options
   * @returns Promise with trigger_id and job_id
   *
   * @example
   * ```typescript
   * await sendmator.whatsapp.sendToTags(['customer', 'premium'], {
   *   template_key: 'new-feature',
   *   conversation_category: 'MARKETING',
   *   variables: { featureName: 'AI Assistant' }
   * });
   * ```
   */
  async sendToTags(
    tags: string[],
    options: {
      template_key: string;
      conversation_category: WhatsAppConversationCategory;
      variables?: Record<string, any>;
      whatsapp_identity_id?: string;
      campaign_name?: string;
      metadata?: Record<string, any>;
      trigger_at?: string;
    }
  ): Promise<SendmatorResponse> {
    const payload: any = {
      recipient_type: 'tag',
      tags: tags,
      template_key: options.template_key,
      conversation_category: options.conversation_category,
    };

    if (options.variables) payload.variables = options.variables;
    if (options.whatsapp_identity_id) payload.whatsapp_identity_id = options.whatsapp_identity_id;
    if (options.campaign_name) payload.campaign_name = options.campaign_name;
    if (options.metadata) payload.metadata = options.metadata;
    if (options.trigger_at) payload.trigger_at = options.trigger_at;

    return this.send(payload);
  }

  /**
   * Send WhatsApp message to all contacts (broadcast)
   *
   * @param options - WhatsApp message options
   * @returns Promise with trigger_id and job_id
   *
   * @example
   * ```typescript
   * await sendmator.whatsapp.sendToAll({
   *   template_key: 'announcement',
   *   conversation_category: 'MARKETING',
   *   variables: { message: 'New feature available!' }
   * });
   * ```
   */
  async sendToAll(
    options: {
      template_key: string;
      conversation_category: WhatsAppConversationCategory;
      variables?: Record<string, any>;
      whatsapp_identity_id?: string;
      campaign_name?: string;
      metadata?: Record<string, any>;
      trigger_at?: string;
    }
  ): Promise<SendmatorResponse> {
    const payload: any = {
      recipient_type: 'all',
      template_key: options.template_key,
      conversation_category: options.conversation_category,
    };

    if (options.variables) payload.variables = options.variables;
    if (options.whatsapp_identity_id) payload.whatsapp_identity_id = options.whatsapp_identity_id;
    if (options.campaign_name) payload.campaign_name = options.campaign_name;
    if (options.metadata) payload.metadata = options.metadata;
    if (options.trigger_at) payload.trigger_at = options.trigger_at;

    return this.send(payload);
  }

  /**
   * Low-level WhatsApp send method with full control over all parameters
   * Use convenience methods (sendTo, sendToContact, etc.) for simpler use cases
   */
  async send(data: SendWhatsAppRequest): Promise<SendmatorResponse> {
    if (!data.template_key) throw new Error('template_key is required');
    if (!data.recipient_type) throw new Error('recipient_type is required');
    if (!data.conversation_category) throw new Error('conversation_category is required');

    if (data.recipient_type === 'direct_whatsapp' && !data.direct_whatsapp) {
      throw new Error('direct_whatsapp is required when recipient_type is "direct_whatsapp"');
    }
    if (data.recipient_type === 'contact' && !data.contact_external_id) {
      throw new Error('contact_external_id is required when recipient_type is "contact"');
    }
    if (data.recipient_type === 'tag' && (!data.tag || data.tag.length === 0)) {
      throw new Error('tag is required when recipient_type is "tag"');
    }

    return this.http.post<SendmatorResponse>('/v1/whatsapp/send', data);
  }

  async getExecutionStatus(executionId: string): Promise<SendmatorResponse> {
    if (!executionId) throw new Error('execution_id is required');
    return this.http.get<SendmatorResponse>(`/v1/whatsapp/executions/${executionId}`);
  }

  async listExecutions(params?: { page?: number; limit?: number }): Promise<SendmatorResponse> {
    const q = new URLSearchParams();
    if (params?.page) q.append('page', params.page.toString());
    if (params?.limit) q.append('limit', params.limit.toString());
    const query = q.toString();
    return this.http.get<SendmatorResponse>(`/v1/whatsapp/executions${query ? `?${query}` : ''}`);
  }
}
