# Contributing to Sendmator Node SDK

Thank you for your interest in contributing to the Sendmator Node SDK! We welcome contributions from the community.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone git@github.com:YOUR_USERNAME/sendmator-node.git
   cd sendmator-node
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development

### Project Structure

```
sendmator-node-sdk/
├── src/
│   ├── index.ts           # Main SDK entry point
│   ├── resources/         # API resource implementations
│   │   ├── email.ts
│   │   ├── sms.ts
│   │   ├── whatsapp.ts
│   │   ├── otp.ts
│   │   └── contacts.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   └── utils/             # Utility classes
│       └── http-client.ts
├── dist/                  # Compiled JavaScript (generated)
└── package.json
```

### Building

```bash
npm run build
```

This compiles TypeScript to the `dist/` directory.

### Code Style

- We use TypeScript strict mode
- Follow existing code formatting
- Run the linter before committing:
  ```bash
  npm run lint
  ```
- Format code with Prettier:
  ```bash
  npm run format
  ```

### Testing

Before submitting a pull request, ensure your code:
- Builds without errors: `npm run build`
- Follows the existing code style
- Includes appropriate JSDoc comments
- Updates the README if adding new features

## Submitting Changes

1. Commit your changes with a clear commit message:
   ```bash
   git commit -m "Add feature: description of your changes"
   ```

2. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

3. Open a Pull Request on GitHub with:
   - Clear description of the changes
   - Reference to any related issues
   - Screenshots/examples if applicable

## Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Update the CHANGELOG.md if applicable
- Ensure all changes are backward compatible unless it's a major version bump
- Add examples to the README for new features
- Follow the existing code structure and naming conventions

## Reporting Issues

If you find a bug or have a feature request:

1. Check if the issue already exists in [GitHub Issues](https://github.com/sendmator/sendmator-node/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Your environment (Node version, SDK version)
   - Code examples if applicable

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Questions?

If you have questions about contributing, feel free to:
- Open a GitHub issue with the "question" label
- Join our Discord community: https://discord.gg/sendmator
- Email us at: support@sendmator.com

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Sendmator! 🚀
