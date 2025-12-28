import { HttpClient } from './utils/http-client';
import { Email } from './resources/email';
import { OTP } from './resources/otp';
import { Contacts } from './resources/contacts';
import { SMS } from './resources/sms';
import { WhatsApp } from './resources/whatsapp';
import { SendmatorConfig } from './types';

/**
 * Sendmator SDK
 * Official Node.js client for Sendmator API
 *
 * @example
 * ```typescript
 * import Sendmator from '@sendmator/node';
 *
 * const client = new Sendmator({
 *   apiKey: 'sk_test_your-api-key',
 *   teamId: 'your-team-id'
 * });
 *
 * // Send an email
 * await client.email.send({
 *   template_key: 'welcome-email',
 *   to: 'user@example.com',
 *   variables: { name: 'John' }
 * });
 * ```
 */
export class Sendmator {
  /** Email operations */
  public email: Email;

  /** OTP (One-Time Password) operations */
  public otp: OTP;

  /** Contact management */
  public contacts: Contacts;

  /** SMS operations */
  public sms: SMS;

  /** WhatsApp operations */
  public whatsapp: WhatsApp;

  private http: HttpClient;

  /**
   * Initialize the Sendmator SDK
   *
   * @param config - SDK configuration
   * @param config.apiKey - Your Sendmator API key (required, starts with sk_)
   * @param config.teamId - Optional team ID for multi-tenant applications
   * @param config.baseURL - Optional base URL (defaults to https://api.sendmator.com/api)
   * @param config.timeout - Optional request timeout in milliseconds (defaults to 30000)
   */
  constructor(config: SendmatorConfig) {
    this.http = new HttpClient(config);

    this.email = new Email(this.http);
    this.otp = new OTP(this.http);
    this.contacts = new Contacts(this.http);
    this.sms = new SMS(this.http);
    this.whatsapp = new WhatsApp(this.http);
  }

  /**
   * Update the team ID for all subsequent requests
   * Useful for multi-tenant applications
   *
   * @param teamId - Team ID to use for requests
   */
  setTeamId(teamId: string): void {
    this.http.setTeamId(teamId);
  }

  /**
   * Clear the team ID
   */
  clearTeamId(): void {
    this.http.clearTeamId();
  }
}

// Default export
export default Sendmator;

// Named exports for types
export * from './types';
export { SendmatorError } from './types';
