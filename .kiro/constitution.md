# Next.js + Ant Design AI Development Constitution

## Core Principles

### 1. Quality First (MUST)
- All code must pass TypeScript strict mode checking
- ESLint rules must be satisfied before commits
- Components must be properly tested before production deployment
- Performance and accessibility are non-negotiable requirements

### 2. Developer Experience (MUST)
- Code should be self-documenting and easy to understand
- Consistent patterns across the entire codebase
- Automated tooling for code quality enforcement
- Clear separation of concerns and modular architecture

### 3. User Experience (MUST)
- Applications must be responsive and mobile-friendly
- Loading states and error handling must be comprehensive
- Accessibility compliance (WCAG 2.1 AA) is required
- Performance targets: < 3s first contentful paint

### 4. Maintainability (SHOULD)
- Component reusability should be prioritized
- Technical debt must be documented and addressed
- Dependencies should be kept to a minimum and regularly updated
- Documentation should be kept current with code changes

## Technology Standards

### Framework Requirements
- **Next.js 14**: App Router only, no Pages Router
- **React 18**: Functional components with hooks
- **TypeScript**: Strict mode enabled, no any types
- **Ant Design 5**: Current stable version only

### Development Tools
- **Package Manager**: pnpm required
- **Code Quality**: ESLint + TypeScript
- **Testing**: Jest + React Testing Library
- **Build**: Next.js built-in optimization

## Architecture Standards

### Project Structure
```
src/
├── app/           # Next.js App Router (mandatory)
├── components/    # Reusable components (mandatory)
├── hooks/         # Custom hooks (mandatory)
├── lib/          # Utility functions (mandatory)
├── services/     # API services (mandatory)
├── types/        # TypeScript definitions (mandatory)
└── styles/       # Global styles (mandatory)
```

### Component Standards
- All components must be TypeScript functional components
- Props must be properly typed with interfaces
- Components must be named using PascalCase
- Files must follow kebab-case naming convention

### State Management
- Local state: useState/useReducer hooks
- Form state: Ant Design Form hooks
- Global state: React Context or Zustand (if needed)
- Server state: React Query/TanStack Query

## Code Quality Standards

### TypeScript Requirements
- Strict mode must be enabled
- No implicit any types allowed
- All functions must have return types
- Generic types should be used for reusable components

### ESLint Configuration
- Next.js recommended rules must be enabled
- React hooks rules must be enforced
- Import sorting must be configured
- No console.log in production code

### Performance Standards
- Components must use React.memo for expensive renders
- Images must be optimized using Next.js Image component
- Code splitting must be implemented for large applications
- Bundle size must be monitored and optimized

## Security Standards

### Code Security
- No hardcoded secrets or API keys
- Input validation must be implemented on both client and server
- XSS prevention measures must be in place
- CSRF protection must be enabled for forms

### Dependencies
- All dependencies must be regularly audited
- Only actively maintained packages should be used
- License compliance must be verified
- Vulnerability scanning must be performed regularly

## Testing Standards

### Unit Testing
- All components must have corresponding test files
- Test coverage must be maintained above 80%
- Tests must be written using React Testing Library
- Mock files must be properly organized

### Integration Testing
- Critical user flows must be tested end-to-end
- API integrations must have integration tests
- Error scenarios must be thoroughly tested
- Performance testing must be conducted

## Documentation Standards

### Code Documentation
- All public APIs must be documented with JSDoc
- Complex business logic must have inline comments
- Component props must be clearly documented
- External integrations must be documented

### Project Documentation
- README must be kept current with project features
- AGENTS.md must contain development guidelines
- API documentation must be generated and maintained
- Deployment procedures must be documented

## Workflow Standards

### Development Workflow
1. Feature branches must be created from main
2. Code must be reviewed before merging
3. Tests must pass before deployment
4. Documentation must be updated with new features

### Deployment Standards
- Automated CI/CD pipelines must be implemented
- Staging environment must mirror production
- Rollback procedures must be documented
- Monitoring and logging must be configured

## Compliance and Governance

### Code Reviews
- All code changes must be reviewed
- Security reviews must be conducted for sensitive features
- Performance reviews must be conducted for complex features
- Accessibility reviews must be conducted for user-facing features

### Quality Gates
- No known security vulnerabilities
- Test coverage above 80%
- Performance metrics within acceptable ranges
- Accessibility compliance verified

## Enforcement Mechanisms

### Automated Checks
- Pre-commit hooks must enforce code quality
- CI/CD pipelines must run all tests
- Security scanning must be automated
- Performance monitoring must be continuous

### Manual Reviews
- Senior developer approval for architectural changes
- Security team approval for authentication features
- UX review for user-facing features
- Performance review for resource-intensive features

## Amendment Process

### Constitution Changes
- Changes must be proposed with clear justification
- Team consensus must be achieved
- Impact assessment must be conducted
- Documentation must be updated accordingly

### Exception Process
- Exceptions must be documented and justified
- Temporary exceptions must have expiration dates
- Exception requests must be approved by technical lead
- Exceptions must be reviewed regularly

---

**Last Updated**: 2024-09-24  
**Version**: 1.0  
**Effective Date**: Immediately