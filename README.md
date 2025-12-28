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
import Sendmator from '@sendmator/node';

// Initialize the SDK
const sendmator = new Sendmator({
  apiKey: 'sk_test_your-api-key',
  teamId: 'your-team-id' // Optional, for multi-tenant applications
});

// Send an email
await sendmator.email.send({
  template_key: 'welcome-email',
  to: 'user@example.com',
  variables: {
    first_name: 'John',
    verification_url: 'https://app.example.com/verify'
  }
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

## API Reference

### Email

#### Send Single Email

```typescript
await sendmator.email.send({
  template_key: 'welcome-email',  // Or use template_id
  to: 'user@example.com',
  from: 'noreply@yourapp.com',    // Optional override
  from_name: 'Your App',           // Optional override
  subject: 'Welcome!',             // Optional override
  reply_to: 'support@yourapp.com', // Optional
  variables: {
    first_name: 'John',
    verification_url: 'https://...'
  },
  metadata: { user_id: '123' }     // Optional custom data
});
```

#### Send Bulk Email

```typescript
// Send to all contacts
await sendmator.email.sendBulk({
  template_key: 'newsletter',
  recipient_type: 'all',
  variables: { month: 'December' }
});

// Send to specific tags
await sendmator.email.sendBulk({
  template_key: 'promotion',
  recipient_type: 'tag',
  tags: ['premium', 'active'],
  variables: { discount: '20%' }
});

// Send to single contact
await sendmator.email.sendBulk({
  template_key: 'order-confirmation',
  recipient_type: 'contact',
  contact_external_id: 'user-123',
  variables: { order_id: 'ORD-456' }
});
```

#### Get Execution Status

```typescript
const status = await sendmator.email.getExecutionStatus('execution-id');
console.log(status.data);
```

#### List Executions

```typescript
const executions = await sendmator.email.listExecutions({
  page: 1,
  limit: 20
});
```

### SMS

#### Send Single SMS

```typescript
await sendmator.sms.send({
  template_key: 'otp-sms',
  to: '+1234567890',
  variables: {
    code: '123456',
    app_name: 'MyApp'
  }
});
```

#### Send Bulk SMS

```typescript
await sendmator.sms.sendBulk({
  template_key: 'promotion-sms',
  recipient_type: 'tag',
  tags: ['premium'],
  variables: { discount: '20%' }
});
```

### WhatsApp

#### Send WhatsApp Message

```typescript
await sendmator.whatsapp.send({
  template_key: 'order-confirmation',
  to: '+1234567890',
  variables: {
    customer_name: 'John',
    order_id: 'ORD-123',
    total: '$99.99'
  },
  conversation_category: 'utility' // marketing, utility, authentication, service
});
```

#### Send Bulk WhatsApp

```typescript
await sendmator.whatsapp.sendBulk({
  template_key: 'announcement',
  recipient_type: 'all',
  variables: { message: 'New feature available!' },
  conversation_category: 'marketing'
});
```

### OTP (One-Time Password)

#### Send OTP

```typescript
// Send via email
const response = await sendmator.otp.send({
  channel: 'email',              // email, sms, or whatsapp
  identifier: 'user@example.com',
  length: 6,                     // Optional: 4-10 digits (default: 6)
  expiry_seconds: 300            // Optional: 60-3600 seconds (default: 300)
});

console.log('Session ID:', response.data.session_id);

// Send via SMS
await sendmator.otp.send({
  channel: 'sms',
  identifier: '+1234567890',
  length: 4
});

// Send via WhatsApp
await sendmator.otp.send({
  channel: 'whatsapp',
  identifier: '+1234567890'
});
```

#### Verify OTP

```typescript
const result = await sendmator.otp.verify({
  session_id: 'session-id-from-send-response',
  code: '123456'
});

if (result.data.valid) {
  console.log('OTP verified successfully!');
  // Proceed with user authentication
} else {
  console.log('Invalid OTP');
  // Show error to user
}
```

#### Resend OTP

```typescript
await sendmator.otp.resend('session-id');
```

### Contacts

#### Create Contact

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

#### Get Contact

```typescript
// By ID
const contact = await sendmator.contacts.get('contact-id');

// By email
const contact = await sendmator.contacts.getByEmail('user@example.com');
```

#### List Contacts

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

#### Update Contact

```typescript
await sendmator.contacts.update('contact-id', {
  first_name: 'Jane',
  tags: ['premium', 'vip'],
  custom_fields: { plan: 'enterprise' }
});
```

#### Delete Contact

```typescript
await sendmator.contacts.delete('contact-id');
```

#### Manage Subscriptions

```typescript
// Unsubscribe
await sendmator.contacts.unsubscribe('contact-id');

// Resubscribe
await sendmator.contacts.resubscribe('contact-id');
```

#### Manage Tags

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
await sendmator.email.send({ ... });

// Switch to a different tenant
sendmator.setTeamId('team-456');
await sendmator.email.send({ ... });

// Clear team ID
sendmator.clearTeamId();
```

## Error Handling

The SDK throws `SendmatorError` for API errors:

```typescript
import Sendmator, { SendmatorError } from '@sendmator/node';

try {
  await sendmator.email.send({ ... });
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

const request: SendEmailRequest = {
  template_key: 'welcome-email',
  to: 'user@example.com',
  variables: { name: 'John' }
};

const response: SendmatorResponse = await sendmator.email.send(request);
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
