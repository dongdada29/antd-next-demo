# Antd Next AI Template - Agent Configuration

## Project Overview
This is a Next.js 14 + React 18 + Ant Design 5 template optimized for AI-powered development workflows. Features modern tooling and AI-assisted development patterns.

## Package Manager
This project uses **pnpm** for package management.

## Available Commands

### Development
```bash
pnpm dev
```
Start development server at http://localhost:3000

### Build
```bash
pnpm build
```
Build the application for production

### Start
```bash
pnpm start
```
Start production server

### Lint
```bash
pnpm lint
```
Run ESLint to check code quality

### Type Check
```bash
pnpm type-check
```
Run TypeScript type checking (add to package.json if needed)

## AI Development Patterns

### Component Generation
- Use functional components with TypeScript
- Follow Ant Design patterns
- Include proper typing and documentation
- Example component structure:

```tsx
interface ComponentProps {
  title: string;
  onAction?: () => void;
  className?: string;
}

const Component: React.FC<ComponentProps> = ({ title, onAction, className }) => {
  return (
    <div className={className}>
      {/* Component logic */}
    </div>
  );
};

export default Component;
```

### File Organization
- `src/app/` - App Router pages and layouts
- `src/components/` - Reusable components (use index.ts for exports)
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions and helpers
- `src/types/` - TypeScript type definitions
- `src/services/` - API services and data fetching
- `src/styles/` - Global styles and themes

### AI-Friendly Code Style
- Use clear, descriptive variable names
- Add JSDoc comments for complex logic
- Prefer composition over inheritance
- Use TypeScript interfaces for type safety
- Follow React best practices and hooks rules

### Ant Design Integration
- Import components individually from 'antd'
- Use type props consistently
- Customize theme through ConfigProvider if needed
- Follow Ant Design naming conventions

## Project Configuration

### Technology Stack
- Next.js 14 with App Router
- React 18 with TypeScript
- Ant Design 5 for UI components
- ESLint for code quality
- pnpm for package management

### Development Workflow
1. Create new features using component-first approach
2. Use AI agents for code generation and optimization
3. Run linting before commits
4. Test components thoroughly
5. Document complex functionality

### AI Assistant Guidelines
- When generating code, follow existing patterns
- Include proper TypeScript types
- Add necessary imports
- Use existing utility functions when available
- Follow the established file structure
- Include error handling where appropriate