---
description: Implement new features following Next.js + Ant Design patterns
---

User input: $ARGUMENTS

Goal: Execute feature implementation following established Next.js + Ant Design patterns and project conventions.

Prerequisites:
- Feature specification should be documented
- Project structure must be properly set up
- Dependencies must be installed via pnpm

Execution steps:

1. **Context Analysis**
   - Review existing project structure and patterns
   - Analyze current component implementations
   - Understand Ant Design usage patterns
   - Check TypeScript integration approaches

2. **Implementation Planning**
   - Break down feature into manageable components
   - Identify required Ant Design components
   - Plan data flow and state management
   - Define TypeScript interfaces and types
   - Consider performance and accessibility

3. **Component Implementation**
   - Create components following established patterns:
     ```tsx
     interface ComponentProps {
       title: string;
       onAction?: () => void;
       className?: string;
     }

     const Component: React.FC<ComponentProps> = ({ title, onAction, className }) => {
       return (
         <div className={className}>
           {/* Component implementation */}
         </div>
       );
     };
     ```
   - Use Ant Design components appropriately
   - Implement proper TypeScript typing
   - Follow accessibility best practices

4. **Integration Steps**
   - Setup phase: Initialize components and dependencies
   - Core development: Implement main functionality
   - Integration: Connect with existing systems
   - Polish: Add error handling, loading states, validation

5. **Quality Assurance**
   - TypeScript type checking
   - ESLint compliance
   - Performance considerations
   - Accessibility validation
   - Cross-browser compatibility

6. **Testing Integration**
   - Component testing patterns
   - Integration testing considerations
   - Error scenario coverage
   - Performance testing setup

Implementation rules:
- Always use TypeScript interfaces for props
- Follow established file naming conventions
- Use Ant Design components consistently
- Implement proper error handling
- Include loading states for async operations
- Ensure accessibility compliance
- Follow React best practices

Output progress tracking after each major milestone and validate against project standards.