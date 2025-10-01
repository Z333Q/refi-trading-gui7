# Claude Code & bolt.new Development Guide

## Project Overview
ReFi.Trading is a non-custodial algorithmic trading platform with dual-proof verification (zk-VaR + ACE policy compliance). This document provides guidelines for working with Claude Code and bolt.new environments.

## Core Architecture Principles

### Security First
- **Never expose API secrets client-side** - all sensitive credentials must be handled by secure backend endpoints
- **Validate all user inputs** - implement proper sanitization and validation
- **Use environment variables** for configuration - never hardcode sensitive values
- **Implement proper authentication** - verify user identity before allowing access to trading features

### Code Organization
- **Modular architecture** - separate concerns into focused modules
- **Configuration externalization** - keep data separate from component logic
- **Service layer pattern** - use services for data access and business logic
- **Type safety** - leverage TypeScript for compile-time error detection

## Development Workflow

### Pre-Development Checklist
1. Ensure all environment variables are properly configured
2. Run `npm audit` to check for security vulnerabilities
3. Verify TypeScript compilation with `npx tsc --noEmit`
4. Run linting with `npx eslint src/`

### Code Review Standards
1. **Security Review**: Check for exposed secrets, input validation, authentication gaps
2. **Performance Review**: Look for inefficient algorithms, memory leaks, unnecessary re-renders
3. **Type Safety**: Ensure proper TypeScript usage and type definitions
4. **Test Coverage**: Verify critical paths have adequate test coverage

### Testing Strategy
- **Unit Tests**: Test individual functions and utilities
- **Integration Tests**: Test component interactions and data flow
- **Security Tests**: Verify input validation and authentication
- **Performance Tests**: Check for memory leaks and performance bottlenecks

## Claude Code Specific Guidelines

### Effective Prompts
- Be specific about security requirements
- Request comprehensive error handling
- Ask for TypeScript type safety
- Specify performance optimization needs

### Common Patterns
- Use the mock API service pattern for data management
- Implement proper loading states and error boundaries
- Follow the established component structure
- Maintain consistent naming conventions

## bolt.new Environment Considerations

### Limitations
- No access to real backend services
- Limited to client-side storage (localStorage)
- Cannot run native binaries or install system packages
- Git is not available

### Workarounds
- Use mock API services for backend simulation
- Implement localStorage-based persistence
- Use browser-compatible packages only
- Simulate external API responses

## Security Checklist

### API Keys & Secrets
- [ ] WalletConnect Project ID configured with origin restrictions
- [ ] Polygon.io API key properly secured
- [ ] Alpaca API credentials handled by backend only
- [ ] No hardcoded secrets in client code

### Input Validation
- [ ] All user inputs sanitized
- [ ] File uploads properly validated
- [ ] URL parameters validated
- [ ] Form data validated before processing

### Authentication & Authorization
- [ ] Wallet connection properly verified
- [ ] User permissions checked before sensitive operations
- [ ] Session management implemented
- [ ] Logout functionality clears all sensitive data

## Performance Optimization

### React Best Practices
- Use `React.memo` for expensive components
- Implement proper dependency arrays in `useEffect`
- Avoid unnecessary re-renders with `useCallback` and `useMemo`
- Use lazy loading for large components

### Data Management
- Implement proper caching strategies
- Use pagination for large datasets
- Optimize API calls with debouncing
- Clean up subscriptions and intervals

## Future Improvements

### Backend Integration
1. Replace mock API service with real backend
2. Implement proper authentication system
3. Add real-time WebSocket connections
4. Implement proper database schema

### Enhanced Security
1. Add rate limiting for API calls
2. Implement proper session management
3. Add audit logging for all user actions
4. Implement proper error handling and logging

### Testing & Monitoring
1. Add comprehensive test suite with Jest and React Testing Library
2. Implement end-to-end testing with Playwright
3. Add performance monitoring and alerting
4. Implement proper logging and error tracking

## Troubleshooting

### Common Issues
- **Language switching not working**: Check i18n configuration and React integration
- **WebSocket connection failures**: Verify API keys and network connectivity
- **State management issues**: Ensure proper cleanup of effects and subscriptions
- **Performance issues**: Check for memory leaks and unnecessary re-renders

### Debug Commands
```bash
# Check TypeScript compilation
npx tsc --noEmit

# Run linting
npx eslint src/

# Check for security vulnerabilities
npm audit

# Run tests
npm test
```

## Contact & Support
For questions about this codebase or development practices, refer to the README.md or create an issue in the project repository.