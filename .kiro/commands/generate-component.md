---
description: Generate new React components following Next.js + Ant Design patterns
---

User input: $ARGUMENTS

Goal: Generate new React components following established patterns for Next.js + Ant Design projects.

Execution steps:

1. **Requirements Analysis**
   - Parse user input for component requirements
   - Identify required Ant Design components
   - Determine component props and interfaces
   - Plan component structure and functionality

2. **Component Generation**
   - Follow established TypeScript interface patterns:
     ```tsx
     interface ComponentProps {
       // Required props
       title: string;
       
       // Optional props
       onAction?: () => void;
       className?: string;
       disabled?: boolean;
       
       // Children if needed
       children?: React.ReactNode;
     }
     ```
   - Generate component following functional component pattern
   - Include proper TypeScript typing
   - Add accessibility considerations
   - Implement error handling where appropriate

3. **Ant Design Integration**
   - Import required Ant Design components
   - Use consistent styling patterns
   - Implement proper form handling if needed
   - Add responsive design considerations

4. **File Structure**
   - Create component in appropriate directory (src/components/[category]/)
   - Follow naming conventions (PascalCase for components)
   - Include index.ts exports if needed
   - Add component documentation

5. **Validation & Testing**
   - Verify TypeScript compliance
   - Check ESLint rules
   - Validate Ant Design usage
   - Ensure accessibility compliance

Component template:
```tsx
'use client';

import React from 'react';
import { Button, Space, Card } from 'antd';

interface ComponentProps {
  title: string;
  onAction?: () => void;
  className?: string;
}

const Component: React.FC<ComponentProps> = ({ 
  title, 
  onAction, 
  className 
}) => {
  return (
    <Card className={className} title={title}>
      {/* Component content */}
      <Space>
        <Button type="primary" onClick={onAction}>
          Action
        </Button>
      </Space>
    </Card>
  );
};

export default Component;
```

Usage examples and documentation should be included as comments in the generated component.