import { HttpClient } from '../utils/http-client';
import {
  Contact,
  CreateContactRequest,
  UpdateContactRequest,
  ListContactsRequest,
  BulkCreateContactsRequest,
  BulkCreateResult,
  SendmatorResponse,
  PaginatedResponse,
  PreferenceSummary,
  SetSinglePreferenceRequest,
  SetPreferencesRequest,
  PreferenceChannel,
  PreferenceCategory,
} from '../types';

/**
 * Contacts Resource
 * Manage your contacts and mailing lists
 */
export class Contacts {
  constructor(private http: HttpClient) {}

  /**
   * Create a new contact
   *
   * @example
   * ```typescript
   * const contact = await sendmator.contacts.create({
   *   email: 'user@example.com',
   *   first_name: 'John',
   *   last_name: 'Doe',
   *   tags: ['customer', 'premium'],
   *   custom_fields: { plan: 'pro' }
   * });
   * ```
   */
  async create(data: CreateContactRequest): Promise<SendmatorResponse<Contact>> {
    return this.http.post<SendmatorResponse<Contact>>('/v1/contacts', data);
  }

  /**
   * Get a contact by ID
   *
   * @example
   * ```typescript
   * const contact = await sendmator.contacts.get('contact-id');
   * ```
   */
  async get(id: string): Promise<SendmatorResponse<Contact>> {
    return this.http.get<SendmatorResponse<Contact>>(`/v1/contacts/${id}`);
  }

  /**
   * Get a contact by external ID
   *
   * @example
   * ```typescript
   * const contact = await sendmator.contacts.getByExternalId('CRM-001');
   * ```
   */
  async getByExternalId(externalId: string): Promise<SendmatorResponse<Contact>> {
    return this.http.get<SendmatorResponse<Contact>>(`/v1/contacts/external/${encodeURIComponent(externalId)}`);
  }

  /**
   * List contacts with pagination
   *
   * @example
   * ```typescript
   * const contacts = await sendmator.contacts.list({
   *   page: 1,
   *   limit: 20,
   *   tags: ['premium'],
   *   search: 'john'
   * });
   * ```
   */
  async list(params?: ListContactsRequest): Promise<PaginatedResponse<Contact>> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.email) queryParams.append('email', params.email);
    if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
    if (params?.is_unsubscribed !== undefined) queryParams.append('is_unsubscribed', params.is_unsubscribed.toString());
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);
    if (params?.tags && params.tags.length > 0) {
      queryParams.append('tags', params.tags.join(','));
    }

    const query = queryParams.toString();
    const url = `/v1/contacts${query ? `?${query}` : ''}`;

    return this.http.get<PaginatedResponse<Contact>>(url);
  }

  /**
   * Update a contact
   *
   * @example
   * ```typescript
   * const contact = await sendmator.contacts.update('contact-id', {
   *   first_name: 'Jane',
   *   tags: ['premium', 'vip']
   * });
   * ```
   */
  async update(id: string, data: UpdateContactRequest): Promise<SendmatorResponse<Contact>> {
    return this.http.patch<SendmatorResponse<Contact>>(`/v1/contacts/${id}`, data);
  }

  /**
   * Bulk create contacts
   *
   * @example
   * ```typescript
   * const result = await sendmator.contacts.bulkCreate({
   *   contacts: [
   *     { email: 'user1@example.com', first_name: 'User', last_name: 'One' },
   *     { email: 'user2@example.com', first_name: 'User', last_name: 'Two' }
   *   ]
   * });
   * ```
   */
  async bulkCreate(data: BulkCreateContactsRequest): Promise<BulkCreateResult> {
    return this.http.post<BulkCreateResult>('/v1/contacts/bulk', data);
  }

  /**
   * Delete a contact (soft delete by default, sets is_active=false)
   *
   * @param id - Contact ID
   * @param hard - If true, permanently deletes the contact (cannot be undone)
   *
   * @example
   * ```typescript
   * // Soft delete (default) - marks as inactive but keeps in database
   * await sendmator.contacts.delete('contact-id');
   *
   * // Hard delete - permanently removes from database
   * await sendmator.contacts.delete('contact-id', true);
   * ```
   */
  async delete(id: string, hard: boolean = false): Promise<SendmatorResponse<void>> {
    const url = hard ? `/v1/contacts/${id}?hard=true` : `/v1/contacts/${id}`;
    return this.http.delete<SendmatorResponse<void>>(url);
  }

  /**
   * Unsubscribe a contact (marks as unsubscribed)
   *
   * @example
   * ```typescript
   * await sendmator.contacts.unsubscribe('contact-id');
   * ```
   */
  async unsubscribe(id: string): Promise<SendmatorResponse<Contact>> {
    return this.http.post<SendmatorResponse<Contact>>(`/v1/contacts/${id}/unsubscribe`);
  }

  /**
   * Add tags to a contact
   *
   * @example
   * ```typescript
   * await sendmator.contacts.addTags('contact-id', ['premium', 'early-adopter']);
   * ```
   */
  async addTags(id: string, tags: string[]): Promise<SendmatorResponse<Contact>> {
    return this.http.post<SendmatorResponse<Contact>>(`/v1/contacts/${id}/tags`, { tags });
  }

  /**
   * Remove tags from a contact
   *
   * @example
   * ```typescript
   * await sendmator.contacts.removeTags('contact-id', ['trial']);
   * ```
   */
  async removeTags(id: string, tags: string[]): Promise<SendmatorResponse<Contact>> {
    return this.http.delete<SendmatorResponse<Contact>>(`/v1/contacts/${id}/tags`, {
      data: { tags }
    });
  }

  /**
   * Get contact preferences with summary
   *
   * @example
   * ```typescript
   * const preferences = await sendmator.contacts.getPreferences('contact-id');
   * ```
   */
  async getPreferences(id: string): Promise<PreferenceSummary> {
    return this.http.get<PreferenceSummary>(`/v1/contacts/${id}/preferences`);
  }

  /**
   * Update multiple contact preferences
   *
   * @example
   * ```typescript
   * await sendmator.contacts.updatePreferences('contact-id', {
   *   preferences: [
   *     { channel: 'email', category: 'promotional', subscribed: false },
   *     { channel: 'sms', category: 'marketing', subscribed: true }
   *   ]
   * });
   * ```
   */
  async updatePreferences(id: string, data: SetPreferencesRequest): Promise<SendmatorResponse<Contact>> {
    return this.http.patch<SendmatorResponse<Contact>>(`/v1/contacts/${id}/preferences`, data);
  }

  /**
   * Update a single preference for a contact
   *
   * @example
   * ```typescript
   * await sendmator.contacts.updateSinglePreference(
   *   'contact-id',
   *   'email',
   *   'promotional',
   *   { subscribed: false }
   * );
   * ```
   */
  async updateSinglePreference(
    id: string,
    channel: PreferenceChannel,
    category: PreferenceCategory,
    data: SetSinglePreferenceRequest
  ): Promise<SendmatorResponse<Contact>> {
    return this.http.patch<SendmatorResponse<Contact>>(
      `/v1/contacts/${id}/preferences/${channel}/${category}`,
      data
    );
  }

  /**
   * Unsubscribe contact from all channels and categories
   *
   * @example
   * ```typescript
   * await sendmator.contacts.unsubscribeAll('contact-id');
   * ```
   */
  async unsubscribeAll(id: string): Promise<SendmatorResponse<Contact>> {
    return this.http.delete<SendmatorResponse<Contact>>(`/v1/contacts/${id}/preferences`);
  }

  /**
   * Unsubscribe contact from specific channel
   *
   * @example
   * ```typescript
   * await sendmator.contacts.unsubscribeChannel('contact-id', 'email');
   * ```
   */
  async unsubscribeChannel(id: string, channel: PreferenceChannel): Promise<SendmatorResponse<Contact>> {
    return this.http.delete<SendmatorResponse<Contact>>(`/v1/contacts/${id}/preferences/${channel}`);
  }

  /**
   * Subscribe contact to all channels and categories
   *
   * @example
   * ```typescript
   * await sendmator.contacts.subscribeAll('contact-id');
   * ```
   */
  async subscribeAll(id: string): Promise<SendmatorResponse<Contact>> {
    return this.http.post<SendmatorResponse<Contact>>(`/v1/contacts/${id}/preferences/subscribe-all`);
  }

  /**
   * Update device token for push notifications
   *
   * @param externalId - Contact's external ID (the ID you use in your app)
   * @param fcmToken - Firebase Cloud Messaging token (optional)
   * @param apnsToken - Apple Push Notification Service token (optional)
   *
   * @example
   * ```typescript
   * // Update FCM token
   * await sendmator.contacts.updateDeviceToken('user-123', {
   *   fcm_token: 'firebase-token-here'
   * });
   *
   * // Update both FCM and APNS tokens
   * await sendmator.contacts.updateDeviceToken('user-123', {
   *   fcm_token: 'firebase-token',
   *   apns_token: 'apple-token'
   * });
   * ```
   */
  async updateDeviceToken(
    externalId: string,
    data: { fcm_token?: string; apns_token?: string }
  ): Promise<SendmatorResponse<Contact>> {
    return this.http.patch<SendmatorResponse<Contact>>(
      `/v1/contacts/external/${encodeURIComponent(externalId)}/device-token`,
      data
    );
  }
}
