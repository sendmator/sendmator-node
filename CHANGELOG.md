# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-12-28

### Added
- Initial release of @sendmator/node SDK
- Email resource with send, sendBulk, getExecutionStatus, and listExecutions methods
- SMS resource with send, sendBulk, getExecutionStatus, and listExecutions methods
- WhatsApp resource with send, sendBulk, getExecutionStatus, and listExecutions methods
- OTP resource with send, verify, and resend methods
- Contacts resource with full CRUD operations (create, get, list, update, delete)
- Contact subscription management (subscribe/unsubscribe)
- Contact tag management (addTags/removeTags)
- Multi-tenant support with dynamic team ID management
- TypeScript support with complete type definitions
- Custom error handling with SendmatorError class
- Comprehensive documentation and examples
- Template-based messaging for all channels
- Variable substitution support
- Bulk sending with recipient targeting (all, tag, contact)
- Phone number validation for SMS and WhatsApp
- Conversation category support for WhatsApp messages
- Pagination support for list operations
- Custom metadata support for all message types

### Features
- Promise-based async/await API
- Axios-based HTTP client with interceptors
- API key authentication with X-API-Key header
- Optional team isolation for multi-tenant applications
- Request timeout configuration (default: 30000ms)
- Automatic error handling and transformation
- Type-safe request and response interfaces

[0.1.0]: https://github.com/sendmator/sendmator-node/releases/tag/v0.1.0
