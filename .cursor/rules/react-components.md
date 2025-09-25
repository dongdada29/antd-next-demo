# React Component Development Rules

## Component Structure

### Functional Components Only
```tsx
// ✅ Correct - Functional component with TypeScript
interface ComponentProps {
  title: string;
  onAction?: () => void;
}

const Component: React.FC<ComponentProps> = ({ title, onAction }) => {
  return <div>{title}</div>;
};

export default Component;
```

### TypeScript Requirements
- All components must have explicit prop interfaces
- Use `React.FC` for functional components
- Include optional props with `?` modifier
- Use proper TypeScript types for event handlers

### Component Organization
```tsx
// ✅ Correct organization
import React from 'react';
import { Button, Space } from 'antd';

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
  // State and effects
  const [loading, setLoading] = React.useState(false);

  // Event handlers
  const handleClick = () => {
    onAction?.();
  };

  return (
    <div className={className}>
      <Button 
        type="primary" 
        loading={loading}
        onClick={handleClick}
      >
        {title}
      </Button>
    </div>
  );
};

export default Component;
```

## Ant Design Integration Rules

### Import Patterns
```tsx
// ✅ Correct - Import only what you need
import { Button, Form, Input } from 'antd';

// ❌ Avoid - Import entire antd library
import * as antd from 'antd';
```

### Component Usage
```tsx
// ✅ Correct - Use Ant Design components properly
const FormComponent = () => {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="vertical">
      <Form.Item 
        label="Username" 
        name="username"
        rules={[{ required: true }]}
      >
        <Input placeholder="Enter username" />
      </Form.Item>
    </Form>
  );
};
```

## State Management

### Local State
- Use `useState` for simple local state
- Use `useReducer` for complex state logic
- Avoid global state unless necessary

### Form State
```tsx
// ✅ Correct - Use Ant Design Form
const UserForm = () => {
  const [form] = Form.useForm();
  
  const onFinish = (values: FormValues) => {
    console.log('Form values:', values);
  };

  return (
    <Form form={form} onFinish={onFinish}>
      {/* Form fields */}
    </Form>
  );
};
```

## Performance Rules

### Memoization
```tsx
// ✅ Correct - Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Expensive rendering logic
  return <div>{/* Complex rendering */}</div>;
});

// ✅ Correct - Use useCallback for event handlers
const Component = ({ onItemClick }) => {
  const handleClick = React.useCallback((id) => {
    onItemClick(id);
  }, [onItemClick]);

  return <Button onClick={handleClick}>Click</Button>;
};
```

## Accessibility Rules

### Semantic HTML
- Use appropriate HTML elements for content
- Include proper ARIA labels
- Ensure keyboard navigation
- Provide alt text for images

### Focus Management
```tsx
// ✅ Correct - Handle focus properly
const ModalComponent = ({ isOpen, onClose }) => {
  const modalRef = React.useRef();

  React.useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div 
      ref={modalRef}
      tabIndex={0}
      role="dialog"
      aria-modal="true"
    >
      {/* Modal content */}
    </div>
  );
};
```

## Error Handling

### Component Boundaries
```tsx
// ✅ Correct - Use error boundaries
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>;
    }

    return this.props.children;
  }
}
```

### Async Operations
```tsx
// ✅ Correct - Handle loading and error states
const DataComponent = () => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await api.getData();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin />;
  if (error) return <Alert message={error} type="error" />;

  return <div>{/* Render data */}</div>;
};
```

## Testing Requirements

### Component Testing
- All components should have corresponding test files
- Test component rendering and user interactions
- Mock external dependencies
- Test error scenarios

### Test Structure
```tsx
// ✅ Correct - Test structure
describe('Component', () => {
  it('renders correctly', () => {
    render(<Component title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const mockClick = jest.fn();
    render(<Component onAction={mockClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockClick).toHaveBeenCalled();
  });
});
```