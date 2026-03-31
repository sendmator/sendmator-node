# @sendmator/node

Official Node.js SDK for [Sendmator](https://sendmator.com) - A powerful multi-channel messaging API for Email, SMS, WhatsApp, and OTP.

[![npm version](https://badge.fury.io/js/%40sendmator%2Fnode.svg)](https://www.npmjs.com/package/@sendmator/node)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 📧 **Email** - Send transactional and bulk emails
- 📱 **SMS** - Send SMS messages worldwide
- 💬 **WhatsApp** - Send WhatsApp Business messages
- 🔐 **OTP** - One-Time Password authentication
- 👥 **Contacts** - Manage your contact lists
- 🚀 **TypeScript** - Full TypeScript support with type definitions
- 🔒 **Secure** - API key authentication with team isolation
- ⚡ **Promise-based** - Modern async/await API

## Installation

```bash
npm install @sendmator/node
```

or with yarn:

```bash
yarn add @sendmator/node
```

## Quick Start

```typescript
// ESM / TypeScript (named import recommended)
import { Sendmator } from '@sendmator/node';

// CommonJS
// const { Sendmator } = require('@sendmator/node');

// Initialize the SDK
const sendmator = new Sendmator({
  apiKey: 'sk_test_your-api-key'
});

// Send an email - it's this simple!
await sendmator.email.sendTo('user@example.com', {
  template_key: 'welcome-email',
  variables: { name: 'John' }
});
```

## Authentication

Get your API key from the [Sendmator Dashboard](https://app.sendmator.com/settings/api-keys).

```typescript
const sendmator = new Sendmator({
  apiKey: 'sk_test_...',  // Required: Your API key
  teamId: 'team-id',      // Optional: Team ID for multi-tenant apps
  baseURL: 'https://api.sendmator.com/api', // Optional: Custom API URL
  timeout: 30000           // Optional: Request timeout in ms (default: 30000)
});
```

## Email Examples

### Send to Email Address (Simplest Method)

```typescript
// Using a template
await sendmator.email.sendTo('user@example.com', {
  template_key: 'welcome-email',
  variables: { name: 'John' }
});

// With custom content
await sendmator.email.sendTo('user@example.com', {
  subject: 'Welcome!',
  html: '<h1>Hello John!</h1>',
  text: 'Hello John!' // Optional plain text version
});

// With custom sender
await sendmator.email.sendTo('user@example.com', {
  template_key: 'verify-api-otp',
  first_name: 'John',
  last_name: 'Doe',
  variables: {
    company: 'Acme Corp',
    OTP_CODE: 123456
  },
  from_email: 'hello@acme.com',
  from_name: 'Acme Team'
});
```

### Send to Existing Contact

```typescript
await sendmator.email.sendToContact('user-123', {
  template_key: 'order-confirmation',
  variables: {
    order_id: 'ORD-456',
    total: '$99.99'
  }
});
```

### Send to All Contacts (Broadcast)

```typescript
// Simple broadcast
await sendmator.email.sendToAll({
  template_key: 'newsletter',
  variables: {
    month: 'March',
    year: 2025
  }
});

// Scheduled broadcast
await sendmator.email.sendToAll({
  template_key: 'announcement',
  variables: { feature: 'Dark Mode' },
  trigger_at: '2025-03-15T10:00:00Z', // ISO 8601 UTC timestamp
  from_email: 'news@company.com',
  from_name: 'Company News'
});
```

### Send to Contacts with Tags

```typescript
// Single tag
await sendmator.email.sendToTags(['premium'], {
  template_key: 'exclusive-offer',
  variables: { discount: '20%' }
});

// Multiple tags
await sendmator.email.sendToTags(['premium', 'active'], {
  template_key: 'feature-announcement',
  variables: { feature: 'Advanced Analytics' }
});

// With scheduling
await sendmator.email.sendToTags(['beta'], {
  template_key: 'beta-update',
  variables: { version: '2.0' },
  from_email: 'beta@company.com',
  from_name: 'Beta Team',
  trigger_at: '2025-03-10T09:00:00Z'
});
```

### Send to Segment

```typescript
await sendmator.email.sendToSegment('segment-id-here', {
  template_key: 'targeted-campaign',
  variables: { campaign: 'Q1 2025' },
  from_email: 'marketing@company.com'
});
```

### Advanced: Full Control with send()

For advanced use cases, use the `send()` method with full control:

```typescript
await sendmator.email.send({
  recipient_type: 'direct_email',
  direct_email: 'user@example.com',
  direct_first_name: 'John',
  direct_last_name: 'Doe',
  template_key: 'welcome',
  variables: { company: 'Acme' },
  from_email: 'hello@company.com',
  from_name: 'Company',
  reply_to: 'support@company.com',
  metadata: { user_id: '123', source: 'signup' },
  trigger_at: '2025-03-10T10:00:00Z'
});
```

### Get Execution Status

```typescript
const response = await sendmator.email.sendTo('user@example.com', {
  template_key: 'welcome'
});

// Check status later
const status = await sendmator.email.getExecutionStatus(response.data.trigger_id);
console.log(status.data);
```

### List Executions

```typescript
const executions = await sendmator.email.listExecutions({
  page: 1,
  limit: 20
});

executions.data.forEach(execution => {
  console.log(`${execution.id}: ${execution.status}`);
});
```

## SMS

### Send Single SMS

```typescript
await sendmator.sms.send({
  recipient_type: 'direct_sms',
  direct_sms: '+1234567890',
  template_key: 'otp-sms',
  variables: {
    code: '123456',
    app_name: 'MyApp'
  }
});
```

### Send Bulk SMS

```typescript
await sendmator.sms.send({
  recipient_type: 'tag',
  tags: ['premium'],
  template_key: 'promotion-sms',
  variables: { discount: '20%' }
});
```

## WhatsApp

### Send WhatsApp Message

```typescript
await sendmator.whatsapp.send({
  recipient_type: 'direct_whatsapp',
  direct_whatsapp: '+1234567890',
  template_key: 'order-confirmation',
  variables: {
    customer_name: 'John',
    order_id: 'ORD-123',
    total: '$99.99'
  },
  conversation_category: 'UTILITY' // MARKETING, UTILITY, AUTHENTICATION
});
```

### Send Bulk WhatsApp

```typescript
await sendmator.whatsapp.send({
  recipient_type: 'all',
  template_key: 'announcement',
  variables: { message: 'New feature available!' },
  conversation_category: 'MARKETING'
});
```

## OTP (One-Time Password)

### Send OTP

```typescript
// Send via email
const response = await sendmator.otp.send({
  channels: ['email'],
  recipients: {
    email: 'user@example.com'
  }
});

console.log('Session ID:', response.data.session_id);

// Send via SMS
await sendmator.otp.send({
  channels: ['sms'],
  recipients: {
    sms: '+1234567890'
  }
});

// Send via multiple channels
await sendmator.otp.send({
  channels: ['email', 'sms'],
  recipients: {
    email: 'user@example.com',
    sms: '+1234567890'
  }
});
```

### Verify OTP

```typescript
const result = await sendmator.otp.verify({
  session_token: 'session-id-from-send-response',
  otps: {
    email: '123456'
  }
});

if (result.data.verified) {
  console.log('OTP verified successfully!');
  // Proceed with user authentication
} else {
  console.log('Invalid OTP');
}
```

### Resend OTP

```typescript
await sendmator.otp.resend({
  session_token: 'session-id'
});
```

## Contacts

### Create Contact

```typescript
const contact = await sendmator.contacts.create({
  email: 'user@example.com',
  first_name: 'John',
  last_name: 'Doe',
  phone: '+1234567890',
  tags: ['customer', 'premium'],
  custom_fields: {
    plan: 'pro',
    signup_date: '2025-01-01'
  }
});
```

### Get Contact

```typescript
// By ID
const contact = await sendmator.contacts.get('contact-id');

// By email
const contact = await sendmator.contacts.getByEmail('user@example.com');
```

### List Contacts

```typescript
const contacts = await sendmator.contacts.list({
  page: 1,
  limit: 20,
  tags: ['premium'],
  search: 'john'
});

console.log(contacts.data);           // Array of contacts
console.log(contacts.pagination);     // Pagination info
```

### Update Contact

```typescript
await sendmator.contacts.update('contact-id', {
  first_name: 'Jane',
  tags: ['premium', 'vip'],
  custom_fields: { plan: 'enterprise' }
});
```

### Delete Contact

```typescript
await sendmator.contacts.delete('contact-id');
```

### Manage Subscriptions

```typescript
// Unsubscribe
await sendmator.contacts.unsubscribe('contact-id');

// Resubscribe
await sendmator.contacts.resubscribe('contact-id');
```

### Manage Tags

```typescript
// Add tags
await sendmator.contacts.addTags('contact-id', ['premium', 'early-adopter']);

// Remove tags
await sendmator.contacts.removeTags('contact-id', ['trial']);
```

## Multi-Tenant Applications

For multi-tenant applications, you can set the team ID dynamically:

```typescript
const sendmator = new Sendmator({ apiKey: 'sk_test_...' });

// Set team ID for a specific tenant
sendmator.setTeamId('team-123');
await sendmator.email.sendTo('user@example.com', {
  template_key: 'welcome'
});

// Switch to a different tenant
sendmator.setTeamId('team-456');
await sendmator.email.sendTo('user@example.com', {
  template_key: 'welcome'
});

// Clear team ID
sendmator.clearTeamId();
```

## Error Handling

The SDK throws `SendmatorError` for API errors:

```typescript
import Sendmator, { SendmatorError } from '@sendmator/node';

try {
  await sendmator.email.sendTo('user@example.com', {
    template_key: 'welcome'
  });
} catch (error) {
  if (error instanceof SendmatorError) {
    console.log('Status code:', error.statusCode);
    console.log('Error code:', error.code);
    console.log('Message:', error.message);
    console.log('Details:', error.details);
  }
}
```

## TypeScript Support

The SDK is written in TypeScript and includes full type definitions:

```typescript
import Sendmator, {
  SendEmailRequest,
  SendOTPRequest,
  Contact,
  SendmatorResponse
} from '@sendmator/node';

// Type-safe email send
const request: SendEmailRequest = {
  recipient_type: 'direct_email',
  direct_email: 'user@example.com',
  template_key: 'welcome',
  variables: { name: 'John' }
};

const response: SendmatorResponse = await sendmator.email.send(request);
```

## API Method Reference

### Email Methods

| Method | Description | Use Case |
|--------|-------------|----------|
| `sendTo(email, options)` | Send to email address | Quick, single recipient sends |
| `sendToContact(externalId, options)` | Send to existing contact | Personalized emails to registered users |
| `sendToAll(options)` | Broadcast to all contacts | Newsletters, announcements |
| `sendToTags(tags, options)` | Send to tagged contacts | Targeted campaigns |
| `sendToSegment(segmentId, options)` | Send to segment | Dynamic audience targeting |
| `send(request)` | Advanced send with full control | Complex requirements |

All methods support:
- Template-based or inline content
- Variable substitution
- Custom sender (`from_email`, `from_name`)
- Scheduled sends (`trigger_at`)
- Metadata for tracking

## Environment Variables

You can store your API key in environment variables:

```bash
# .env
SENDMATOR_API_KEY=sk_test_your-api-key
SENDMATOR_TEAM_ID=your-team-id
```

```typescript
const sendmator = new Sendmator({
  apiKey: process.env.SENDMATOR_API_KEY,
  teamId: process.env.SENDMATOR_TEAM_ID
});
```

## Common Patterns

### Transactional Emails

```typescript
// Welcome email after signup
await sendmator.email.sendTo(user.email, {
  template_key: 'welcome',
  first_name: user.firstName,
  variables: {
    verification_url: generateVerificationUrl(user.id)
  }
});

// Order confirmation
await sendmator.email.sendToContact(user.externalId, {
  template_key: 'order-confirmation',
  variables: {
    order_id: order.id,
    items: order.items,
    total: order.total
  }
});
```

### Marketing Campaigns

```typescript
// Send to premium customers
await sendmator.email.sendToTags(['premium', 'active'], {
  template_key: 'new-feature',
  variables: {
    feature: 'Advanced Analytics',
    cta_url: 'https://app.example.com/analytics'
  },
  from_email: 'marketing@company.com',
  from_name: 'Marketing Team'
});
```

### Scheduled Sends

```typescript
// Schedule for next week
const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);

await sendmator.email.sendToAll({
  template_key: 'weekly-digest',
  variables: { week: '12' },
  trigger_at: nextWeek.toISOString()
});
```

## Version Management

To publish a new version:

```bash
# Patch version (0.1.0 -> 0.1.1)
npm version patch

# Minor version (0.1.0 -> 0.2.0)
npm version minor

# Major version (0.1.0 -> 1.0.0)
npm version major

# Publish to NPM
npm publish --access public
```

## Resources

- [Documentation](https://docs.sendmator.com)
- [API Reference](https://docs.sendmator.com/api)
- [Dashboard](https://app.sendmator.com)
- [Support](mailto:support@sendmator.com)
- [GitHub](https://github.com/sendmator/sendmator-node)

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions:
- 📧 Email: support@sendmator.com
- 💬 Discord: [Join our community](https://discord.gg/sendmator)
- 🐛 Issues: [GitHub Issues](https://github.com/sendmator/sendmator-node/issues)

---

Made with ❤️ by the Sendmator team
