# Ant Design Usage Guidelines

## Import Patterns

### Recommended Imports
```tsx
// ✅ Correct - Import specific components
import { Button, Form, Input, Select } from 'antd';

// ✅ Correct - Import sub-components
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

// ✅ Correct - Import utilities
import { message, notification } from 'antd';
```

### Avoid These Patterns
```tsx
// ❌ Avoid - Import entire library
import * as antd from 'antd';

// ❌ Avoid - Import from specific paths
import Button from 'antd/es/button';
```

## Component Usage Patterns

### Form Components
```tsx
// ✅ Correct - Form with proper validation
const UserForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values: FormValues) => {
    console.log('Form values:', values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          { required: true, message: 'Please input username!' },
          { min: 3, message: 'Username must be at least 3 characters' }
        ]}
      >
        <Input placeholder="Enter username" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, type: 'email', message: 'Please enter a valid email!' }
        ]}
      >
        <Input placeholder="Enter email" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
```

### Data Display Components
```tsx
// ✅ Correct - Table with proper typing
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const TableComponent = () => {
  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const data: DataType[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    // More data...
  ];

  return <Table columns={columns} dataSource={data} />;
};
```

### Layout Components
```tsx
// ✅ Correct - Layout with proper spacing
const PageLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px' }}>
        <h1>Application Header</h1>
      </Header>
      
      <Content style={{ padding: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card title="Card 1">Content 1</Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card title="Card 2">Content 2</Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card title="Card 3">Content 3</Card>
          </Col>
        </Row>
      </Content>
      
      <Footer style={{ textAlign: 'center' }}>
        Application Footer ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};
```

## Styling Guidelines

### Using className Props
```tsx
// ✅ Correct - Use className for custom styling
const StyledComponent = () => {
  return (
    <div className="custom-container">
      <Button className="custom-button">Click me</Button>
      <Card className="custom-card">Card content</Card>
    </div>
  );
};
```

### Custom CSS
```css
/* ✅ Correct - Use CSS modules or styled-components */
.custom-container {
  padding: 24px;
  background-color: #f5f5f5;
}

.custom-button {
  margin-right: 8px;
}

.custom-card {
  border-radius: 8px;
}
```

## Message and Notification Usage

### Global Messages
```tsx
// ✅ Correct - Use message API properly
const MessageComponent = () => {
  const showMessage = () => {
    message.success('Operation completed successfully!');
    message.error('Something went wrong!');
    message.warning('Please check your input');
    message.info('This is an informational message');
  };

  return <Button onClick={showMessage}>Show Message</Button>;
};
```

### Notifications
```tsx
// ✅ Correct - Use notification API properly
const NotificationComponent = () => {
  const showNotification = () => {
    notification.success({
      message: 'Success',
      description: 'Your changes have been saved successfully',
      placement: 'topRight',
      duration: 3,
    });
  };

  return <Button onClick={showNotification}>Show Notification</Button>;
};
```

## Modal and Drawer Usage

### Modal Components
```tsx
// ✅ Correct - Modal with proper state management
const ModalComponent = () => {
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const handleCancel = () => setVisible(false);
  const handleOk = () => {
    // Handle confirm action
    setVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        title="Basic Modal"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  );
};
```

## Performance Considerations

### Virtual Scrolling
```tsx
// ✅ Correct - Use virtual scrolling for large lists
const LargeListComponent = () => {
  const data = Array(10000).fill(0).map((_, index) => ({
    id: index,
    name: `Item ${index}`,
  }));

  return (
    <List
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <Typography.Text>{item.name}</Typography.Text>
        </List.Item>
      )}
      pagination={{
        pageSize: 20,
      }}
    />
  );
};
```

### Lazy Loading
```tsx
// ✅ Correct - Use React.lazy for component lazy loading
const LazyComponent = React.lazy(() => import('./LazyComponent'));

const App = () => {
  return (
    <React.Suspense fallback={<Spin />}>
      <LazyComponent />
    </React.Suspense>
  );
};
```

## Accessibility Guidelines

### Form Accessibility
```tsx
// ✅ Correct - Accessible form elements
const AccessibleForm = () => {
  return (
    <Form layout="vertical">
      <Form.Item 
        label="Username"
        htmlFor="username-input"
      >
        <Input 
          id="username-input"
          aria-describedby="username-help"
          placeholder="Enter username"
        />
      </Form.Item>
      <div id="username-help" className="ant-form-item-explain">
        Username must be at least 3 characters long
      </div>
    </Form>
  );
};
```

### Button Accessibility
```tsx
// ✅ Correct - Accessible buttons
const AccessibleButtons = () => {
  return (
    <Space>
      <Button aria-label="Save changes">Save</Button>
      <Button aria-describedby="delete-help">Delete</Button>
    </Space>
  );
};
```