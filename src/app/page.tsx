'use client';

import React from 'react';
import { Button, Space, Card, Input, DatePicker, Select } from 'antd';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Home = () => {
  const showMessage = () => {
    const { message } = require('antd');
    message.success('This is a success message!');
  };

  return (
    <div className="App" style={{ padding: '24px' }}>
      
      <Card title="Ant Design Examples" style={{ marginBottom: '24px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          
          {/* Buttons */}
          <Card title="Buttons" size="small">
            <Space wrap>
              <Button type="primary">Primary</Button>
              <Button>Default</Button>
              <Button type="dashed">Dashed</Button>
              <Button type="text">Text</Button>
              <Button type="link">Link</Button>
              <Button type="primary" danger>
                Danger
              </Button>
            </Space>
          </Card>

          {/* Input */}
          <Card title="Input" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input placeholder="Basic input" />
              <Input.Password placeholder="Password input" />
              <Input.Search placeholder="Search input" />
            </Space>
          </Card>

          {/* DatePicker */}
          <Card title="DatePicker" size="small">
            <Space>
              <DatePicker placeholder="Select date" />
              <RangePicker />
            </Space>
          </Card>

          {/* Select */}
          <Card title="Select" size="small">
            <Select 
              defaultValue="option1" 
              style={{ width: 200 }}
              placeholder="Select an option"
            >
              <Option value="option1">Option 1</Option>
              <Option value="option2">Option 2</Option>
              <Option value="option3">Option 3</Option>
            </Select>
          </Card>

          {/* Message Button */}
          <Card title="Message" size="small">
            <Button type="primary" onClick={showMessage}>
              Show Message
            </Button>
          </Card>

        </Space>
      </Card>
    </div>
  );
};

export default Home;