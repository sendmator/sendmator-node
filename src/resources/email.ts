import { HttpClient } from '../utils/http-client';
import { SendEmailRequest, SendmatorResponse } from '../types';

/**
 * Email resource for sending emails via Sendmator
 */
export class Email {
  constructor(private http: HttpClient) {}

  /**
   * Send email to a specific email address (direct send)
   *
   * This is the simplest way to send an email to a single recipient.
   * Use this when you want to send to an email address directly without
   * needing a contact record in your database.
   *
   * @example
   * ```typescript
   * // Send with template
   * await sendmator.email.sendTo('user@example.com', {
   *   template_key: 'welcome-email',
   *   variables: { name: 'John' }
   * });
   *
   * // Send with custom content
   * await sendmator.email.sendTo('user@example.com', {
   *   subject: 'Welcome!',
   *   html: '<h1>Hello!</h1>',
   *   from_email: 'hello@company.com',
   *   from_name: 'Company Name'
   * });
   *
   * // Send with additional recipient details
   * await sendmator.email.sendTo('user@example.com', {
   *   template_key: 'welcome',
   *   first_name: 'John',
   *   last_name: 'Doe',
   *   variables: { company: 'Acme Corp' }
   * });
   * ```
   *
   * @param email - Recipient email address
   * @param options - Email content and configuration
   * @returns Promise resolving to send response with trigger_id and job_id
   */
  async sendTo(
    email: string,
    options: {
      /** Template key to use (e.g., 'welcome-email') */
      template_key?: string;
      /** Email subject (required if not using template_key) */
      subject?: string;
      /** Email HTML content (required if not using template_key) */
      html?: string;
      /** Email plain text content */
      text?: string;
      /** Recipient first name (optional, for personalization) */
      first_name?: string;
      /** Recipient last name (optional, for personalization) */
      last_name?: string;
      /** Template variables for dynamic content */
      variables?: Record<string, any>;
      /** Override sender email address */
      from_email?: string;
      /** Override sender name */
      from_name?: string;
      /** Reply-to email address */
      reply_to?: string;
      /** Custom metadata for tracking */
      metadata?: Record<string, any>;
    }
  ): Promise<SendmatorResponse> {
    const payload: any = {
      recipient_type: 'direct_email',
      direct_email: email,
    };

    if (options.first_name) payload.direct_first_name = options.first_name;
    if (options.last_name) payload.direct_last_name = options.last_name;
    if (options.template_key) payload.template_key = options.template_key;
    if (options.subject) payload.subject = options.subject;
    if (options.html) payload.content = options.html;
    if (options.text) payload.plain_text_content = options.text;
    if (options.variables) payload.variables = options.variables;
    if (options.from_email) payload.from_email = options.from_email;
    if (options.from_name) payload.from_name = options.from_name;
    if (options.reply_to) payload.reply_to = options.reply_to;
    if (options.metadata) payload.metadata = options.metadata;

    return this.send(payload);
  }

  /**
   * Send email to an existing contact by external ID
   *
   * Use this when you want to send to a contact that exists in your
   * Sendmator contact database. The contact's information will be used
   * for personalization.
   *
   * @example
   * ```typescript
   * await sendmator.email.sendToContact('user-123', {
   *   template_key: 'order-confirmation',
   *   variables: { order_id: 'ORD-456' }
   * });
   *
   * // With custom sender
   * await sendmator.email.sendToContact('user-123', {
   *   template_key: 'welcome',
   *   variables: { company: 'Acme' },
   *   from_email: 'hello@acme.com',
   *   from_name: 'Acme Team'
   * });
   * ```
   *
   * @param externalId - Contact's external ID from your system
   * @param options - Email configuration
   * @returns Promise resolving to send response
   */
  async sendToContact(
    externalId: string,
    options: {
      /** Template key to use */
      template_key: string;
      /** Template variables */
      variables?: Record<string, any>;
      /** Override sender email */
      from_email?: string;
      /** Override sender name */
      from_name?: string;
      /** Reply-to email */
      reply_to?: string;
      /** Custom metadata */
      metadata?: Record<string, any>;
    }
  ): Promise<SendmatorResponse> {
    return this.send({
      recipient_type: 'contact',
      contact_external_id: externalId,
      template_key: options.template_key,
      variables: options.variables,
      from_email: options.from_email,
      from_name: options.from_name,
      reply_to: options.reply_to,
      metadata: options.metadata,
    } as any);
  }

  /**
   * Send email to all contacts in your database
   *
   * Use this for broadcast messages like newsletters, announcements,
   * or product updates. Only active, subscribed contacts will receive
   * the email.
   *
   * @example
   * ```typescript
   * await sendmator.email.sendToAll({
   *   template_key: 'newsletter',
   *   variables: { month: 'March', year: 2025 }
   * });
   *
   * // Scheduled send
   * await sendmator.email.sendToAll({
   *   template_key: 'announcement',
   *   variables: { feature: 'Dark Mode' },
   *   trigger_at: '2025-03-15T10:00:00Z'
   * });
   * ```
   *
   * @param options - Email configuration
   * @returns Promise resolving to send response
   */
  async sendToAll(options: {
    /** Template key to use */
    template_key: string;
    /** Template variables */
    variables?: Record<string, any>;
    /** Override sender email */
    from_email?: string;
    /** Override sender name */
    from_name?: string;
    /** Reply-to email */
    reply_to?: string;
    /** Custom metadata */
    metadata?: Record<string, any>;
    /** Schedule send for future (ISO 8601 UTC timestamp) */
    trigger_at?: string;
  }): Promise<SendmatorResponse> {
    return this.send({
      recipient_type: 'all',
      template_key: options.template_key,
      variables: options.variables,
      from_email: options.from_email,
      from_name: options.from_name,
      reply_to: options.reply_to,
      metadata: options.metadata,
      trigger_at: options.trigger_at,
    } as any);
  }

  /**
   * Send email to contacts with specific tags
   *
   * Use this to target specific segments of your audience based on
   * tags you've assigned to your contacts (e.g., 'premium', 'beta',
   * 'active-subscriber').
   *
   * @example
   * ```typescript
   * // Send to single tag
   * await sendmator.email.sendToTags(['premium'], {
   *   template_key: 'exclusive-offer',
   *   variables: { discount: '20%' }
   * });
   *
   * // Send to multiple tags
   * await sendmator.email.sendToTags(['premium', 'active'], {
   *   template_key: 'feature-announcement',
   *   variables: { feature: 'Advanced Analytics' }
   * });
   *
   * // Scheduled send with custom sender
   * await sendmator.email.sendToTags(['beta'], {
   *   template_key: 'beta-update',
   *   variables: { version: '2.0' },
   *   from_email: 'beta@company.com',
   *   from_name: 'Beta Team',
   *   trigger_at: '2025-03-10T09:00:00Z'
   * });
   * ```
   *
   * @param tags - Array of tag names to target
   * @param options - Email configuration
   * @returns Promise resolving to send response
   */
  async sendToTags(
    tags: string[],
    options: {
      /** Template key to use */
      template_key: string;
      /** Template variables */
      variables?: Record<string, any>;
      /** Override sender email */
      from_email?: string;
      /** Override sender name */
      from_name?: string;
      /** Reply-to email */
      reply_to?: string;
      /** Custom metadata */
      metadata?: Record<string, any>;
      /** Schedule send for future (ISO 8601 UTC timestamp) */
      trigger_at?: string;
    }
  ): Promise<SendmatorResponse> {
    return this.send({
      recipient_type: 'tag',
      tags: tags,
      template_key: options.template_key,
      variables: options.variables,
      from_email: options.from_email,
      from_name: options.from_name,
      reply_to: options.reply_to,
      metadata: options.metadata,
      trigger_at: options.trigger_at,
    } as any);
  }

  /**
   * Send email to a segment
   *
   * Use this to send to contacts in a specific segment you've created
   * in Sendmator. Segments allow you to dynamically filter contacts
   * based on properties, behavior, or custom fields.
   *
   * @example
   * ```typescript
   * await sendmator.email.sendToSegment('segment-id-here', {
   *   template_key: 'targeted-campaign',
   *   variables: { campaign: 'Q1 2025' }
   * });
   * ```
   *
   * @param segmentId - Segment ID from Sendmator dashboard
   * @param options - Email configuration
   * @returns Promise resolving to send response
   */
  async sendToSegment(
    segmentId: string,
    options: {
      /** Template key to use */
      template_key: string;
      /** Template variables */
      variables?: Record<string, any>;
      /** Override sender email */
      from_email?: string;
      /** Override sender name */
      from_name?: string;
      /** Reply-to email */
      reply_to?: string;
      /** Custom metadata */
      metadata?: Record<string, any>;
      /** Schedule send for future (ISO 8601 UTC timestamp) */
      trigger_at?: string;
    }
  ): Promise<SendmatorResponse> {
    return this.send({
      recipient_type: 'segment',
      segment_id: segmentId,
      template_key: options.template_key,
      variables: options.variables,
      from_email: options.from_email,
      from_name: options.from_name,
      reply_to: options.reply_to,
      metadata: options.metadata,
      trigger_at: options.trigger_at,
    } as any);
  }

  /**
   * Advanced: Send email with full control over all parameters
   *
   * Use this method when you need full control over the send request
   * or when using features not covered by the convenience methods above.
   *
   * For most use cases, prefer the convenience methods:
   * - sendTo() - Direct email to an address
   * - sendToContact() - Email to existing contact
   * - sendToAll() - Broadcast to all contacts
   * - sendToTags() - Target specific tags
   * - sendToSegment() - Target a segment
   *
   * @example
   * ```typescript
   * // Direct email with full options
   * await sendmator.email.send({
   *   recipient_type: 'direct_email',
   *   direct_email: 'user@example.com',
   *   template_key: 'welcome',
   *   variables: { name: 'John' },
   *   from_email: 'hello@company.com',
   *   from_name: 'Company',
   *   reply_to: 'support@company.com',
   *   metadata: { user_id: '123' }
   * });
   *
   * // Tag-based send
   * await sendmator.email.send({
   *   recipient_type: 'tag',
   *   tags: ['premium', 'active'],
   *   template_key: 'promotion',
   *   variables: { discount: '20%' }
   * });
   * ```
   *
   * @param data - Full send email request
   * @returns Promise resolving to send response
   */
  async send(data: SendEmailRequest): Promise<SendmatorResponse> {
    if (!data.recipient_type) {
      throw new Error('recipient_type is required');
    }

    if (data.recipient_type === 'direct_email' && !data.direct_email) {
      throw new Error('direct_email is required when recipient_type is "direct_email"');
    }

    if (data.recipient_type === 'contact' && !data.contact_external_id) {
      throw new Error('contact_external_id is required when recipient_type is "contact"');
    }

    if (data.recipient_type === 'tag' && (!data.tag || data.tag.length === 0)) {
      throw new Error('tag is required when recipient_type is "tag"');
    }

    if (data.recipient_type === 'segment' && !data.segment_id) {
      throw new Error('segment_id is required when recipient_type is "segment"');
    }

    if (!data.template_key && !(data.subject && data.content)) {
      throw new Error('Either template_key OR both subject and content must be provided');
    }

    return this.http.post<SendmatorResponse>('/v1/messages/send', data);
  }

  /**
   * Get execution status for a previously sent email
   *
   * @example
   * ```typescript
   * const status = await sendmator.email.getExecutionStatus('trigger-id');
   * console.log(status.data);
   * ```
   *
   * @param executionId - Trigger ID or execution ID returned from send
   * @returns Promise resolving to execution status
   */
  async getExecutionStatus(executionId: string): Promise<SendmatorResponse> {
    if (!executionId) throw new Error('execution_id is required');
    return this.http.get<SendmatorResponse>(`/v1/messages/executions/${executionId}`);
  }

  /**
   * List all email executions
   *
   * @example
   * ```typescript
   * const executions = await sendmator.email.listExecutions({ page: 1, limit: 20 });
   * ```
   *
   * @param params - Pagination parameters
   * @returns Promise resolving to list of executions
   */
  async listExecutions(params?: { page?: number; limit?: number }): Promise<SendmatorResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    const query = queryParams.toString();
    return this.http.get<SendmatorResponse>(`/v1/messages${query ? `?${query}` : ''}`);
  }
}
