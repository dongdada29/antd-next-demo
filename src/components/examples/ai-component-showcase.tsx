/**
 * AI Component Showcase
 * 
 * Demonstrates the usage of AI-friendly components with comprehensive
 * examples, patterns, and integration scenarios for AI agents to learn from.
 */

import * as React from 'react';
import { 
  EnhancedButton, 
  EnhancedCard, 
  EnhancedInput,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui';

/**
 * Basic Component Usage Examples
 * 
 * @ai-example-category "basic-usage"
 * @ai-learning-objective "Understand basic component composition and props"
 */
export const BasicComponentExamples: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Basic Component Usage</h2>
      
      {/* Button Examples */}
      <EnhancedCard>
        <CardHeader>
          <CardTitle>Button Variants</CardTitle>
          <CardDescription>Different button styles for various use cases</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <EnhancedButton variant="default">Default</EnhancedButton>
            <EnhancedButton variant="secondary">Secondary</EnhancedButton>
            <EnhancedButton variant="outline">Outline</EnhancedButton>
            <EnhancedButton variant="ghost">Ghost</EnhancedButton>
            <EnhancedButton variant="link">Link</EnhancedButton>
            <EnhancedButton variant="destructive">Destructive</EnhancedButton>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <EnhancedButton size="sm">Small</EnhancedButton>
            <EnhancedButton size="default">Default</EnhancedButton>
            <EnhancedButton size="lg">Large</EnhancedButton>
            <EnhancedButton size="icon">🔍</EnhancedButton>
          </div>
        </CardContent>
      </EnhancedCard>

      {/* Input Examples */}
      <EnhancedCard>
        <CardHeader>
          <CardTitle>Input Variations</CardTitle>
          <CardDescription>Form inputs with different states and configurations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <EnhancedInput 
            label="Basic Input"
            placeholder="Enter text here"
          />
          
          <EnhancedInput 
            label="Email Input"
            type="email"
            placeholder="user@example.com"
            helperText="We'll never share your email"
          />
          
          <EnhancedInput 
            label="Required Field"
            placeholder="This field is required"
            required
          />
          
          <EnhancedInput 
            label="Error State"
            placeholder="Invalid input"
            error="This field contains an error"
          />
          
          <EnhancedInput 
            label="Success State"
            placeholder="Valid input"
            success="Input is valid"
          />
        </CardContent>
      </EnhancedCard>
    </div>
  );
};

/**
 * Form Integration Example
 * 
 * @ai-example-category "form-integration"
 * @ai-learning-objective "Learn form composition with validation and state management"
 */
export const FormIntegrationExample: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    alert('Form submitted successfully!');
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <EnhancedCard>
        <CardHeader>
          <CardTitle>Contact Form</CardTitle>
          <CardDescription>Send us a message and we'll get back to you</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <EnhancedInput
              label="Full Name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={errors.name}
              required
            />
            
            <EnhancedInput
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={errors.email}
              required
            />
            
            <EnhancedInput
              label="Message"
              placeholder="Your message here..."
              value={formData.message}
              onChange={handleInputChange('message')}
              error={errors.message}
              required
            />
          </CardContent>
          
          <CardFooter className="flex gap-2">
            <EnhancedButton 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </EnhancedButton>
            
            <EnhancedButton 
              type="button" 
              variant="outline"
              onClick={() => {
                setFormData({ name: '', email: '', message: '' });
                setErrors({});
              }}
            >
              Clear
            </EnhancedButton>
          </CardFooter>
        </form>
      </EnhancedCard>
    </div>
  );
};

/**
 * Dashboard Widget Example
 * 
 * @ai-example-category "dashboard-widgets"
 * @ai-learning-objective "Learn dashboard component composition and data display"
 */
export const DashboardWidgetExample: React.FC = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '12,345',
      description: '+20% from last month',
      trend: { value: 20, isPositive: true }
    },
    {
      title: 'Revenue',
      value: '$54,321',
      description: '+15% from last month',
      trend: { value: 15, isPositive: true }
    },
    {
      title: 'Bounce Rate',
      value: '2.4%',
      description: '-5% from last month',
      trend: { value: 5, isPositive: false }
    },
    {
      title: 'Active Sessions',
      value: '1,234',
      description: 'Current active users',
      trend: { value: 8, isPositive: true }
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <EnhancedCard key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span className={`flex items-center ${
                  stat.trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend.isPositive ? '↗' : '↘'} {stat.trend.value}%
                </span>
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </EnhancedCard>
        ))}
      </div>
      
      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EnhancedCard>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <EnhancedButton variant="outline" className="w-full justify-start">
              📊 View Analytics
            </EnhancedButton>
            <EnhancedButton variant="outline" className="w-full justify-start">
              👥 Manage Users
            </EnhancedButton>
            <EnhancedButton variant="outline" className="w-full justify-start">
              ⚙️ Settings
            </EnhancedButton>
          </CardContent>
        </EnhancedCard>
        
        <EnhancedCard>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>New user registered</span>
                <span className="text-muted-foreground">2 min ago</span>
              </div>
              <div className="flex justify-between">
                <span>Payment processed</span>
                <span className="text-muted-foreground">5 min ago</span>
              </div>
              <div className="flex justify-between">
                <span>System backup completed</span>
                <span className="text-muted-foreground">1 hour ago</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <EnhancedButton variant="link" className="p-0">
              View all activity →
            </EnhancedButton>
          </CardFooter>
        </EnhancedCard>
      </div>
    </div>
  );
};

/**
 * AI Component Showcase Container
 * 
 * @ai-usage "Use this component to understand comprehensive component usage patterns"
 */
export const AIComponentShowcase: React.FC = () => {
  const [activeExample, setActiveExample] = React.useState<'basic' | 'form' | 'dashboard'>('basic');

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold mb-4">AI Component Showcase</h1>
          <div className="flex gap-2">
            <EnhancedButton
              variant={activeExample === 'basic' ? 'default' : 'outline'}
              onClick={() => setActiveExample('basic')}
            >
              Basic Usage
            </EnhancedButton>
            <EnhancedButton
              variant={activeExample === 'form' ? 'default' : 'outline'}
              onClick={() => setActiveExample('form')}
            >
              Form Integration
            </EnhancedButton>
            <EnhancedButton
              variant={activeExample === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setActiveExample('dashboard')}
            >
              Dashboard Widgets
            </EnhancedButton>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto">
        {activeExample === 'basic' && <BasicComponentExamples />}
        {activeExample === 'form' && <FormIntegrationExample />}
        {activeExample === 'dashboard' && <DashboardWidgetExample />}
      </div>
    </div>
  );
};