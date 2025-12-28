import { HttpClient } from '../utils/http-client';
import {
  Contact,
  CreateContactRequest,
  UpdateContactRequest,
  ListContactsRequest,
  SendmatorResponse,
  PaginatedResponse,
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
   * Get a contact by email
   *
   * @example
   * ```typescript
   * const contact = await sendmator.contacts.getByEmail('user@example.com');
   * ```
   */
  async getByEmail(email: string): Promise<SendmatorResponse<Contact>> {
    return this.http.get<SendmatorResponse<Contact>>(`/v1/contacts/by-email/${encodeURIComponent(email)}`);
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
    if (params?.tags) params.tags.forEach(tag => queryParams.append('tags[]', tag));

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
    return this.http.put<SendmatorResponse<Contact>>(`/v1/contacts/${id}`, data);
  }

  /**
   * Delete a contact
   *
   * @example
   * ```typescript
   * await sendmator.contacts.delete('contact-id');
   * ```
   */
  async delete(id: string): Promise<SendmatorResponse<void>> {
    return this.http.delete<SendmatorResponse<void>>(`/v1/contacts/${id}`);
  }

  /**
   * Unsubscribe a contact
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
   * Resubscribe a contact
   *
   * @example
   * ```typescript
   * await sendmator.contacts.resubscribe('contact-id');
   * ```
   */
  async resubscribe(id: string): Promise<SendmatorResponse<Contact>> {
    return this.http.post<SendmatorResponse<Contact>>(`/v1/contacts/${id}/resubscribe`);
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
}
