/**
 * AI Components Example Page
 * 
 * Demonstrates the AI-friendly component system with live examples,
 * testing interface, and comprehensive showcase of capabilities.
 */

'use client';

import * as React from 'react';
import { AIComponentShowcase } from '@/components/examples/ai-component-showcase';
import { AIComponentTestSuite } from '@/components/examples/ai-component-test';
import { EnhancedButton, EnhancedCard, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';

type ViewMode = 'showcase' | 'test' | 'documentation';

export default function AIComponentsPage() {
  const [viewMode, setViewMode] = React.useState<ViewMode>('showcase');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col space-y-4">
            <div>
              <h1 className="text-4xl font-bold">AI-Friendly Components</h1>
              <p className="text-xl text-muted-foreground mt-2">
                Enhanced shadcn/ui components with AI generation capabilities
              </p>
            </div>
            
            {/* Navigation */}
            <div className="flex flex-wrap gap-2">
              <EnhancedButton
                variant={viewMode === 'showcase' ? 'default' : 'outline'}
                onClick={() => setViewMode('showcase')}
              >
                Component Showcase
              </EnhancedButton>
              <EnhancedButton
                variant={viewMode === 'test' ? 'default' : 'outline'}
                onClick={() => setViewMode('test')}
              >
                Test Suite
              </EnhancedButton>
              <EnhancedButton
                variant={viewMode === 'documentation' ? 'default' : 'outline'}
                onClick={() => setViewMode('documentation')}
              >
                Documentation
              </EnhancedButton>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto">
        {viewMode === 'showcase' && <AIComponentShowcase />}
        {viewMode === 'test' && <AIComponentTestSuite />}
        {viewMode === 'documentation' && <DocumentationView />}
      </div>
    </div>
  );
}

/**
 * Documentation View Component
 */
const DocumentationView: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">AI Component Documentation</h2>
        <p className="text-muted-foreground mt-2">
          Comprehensive guide to using AI-friendly components
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overview */}
        <EnhancedCard>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Understanding the AI component architecture</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Key Features:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• AI-friendly component configurations</li>
                <li>• Comprehensive metadata and documentation</li>
                <li>• Code generation templates</li>
                <li>• Intelligent component suggestions</li>
                <li>• Automated documentation generation</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Component Types:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• <strong>UI Components:</strong> Basic interface elements</li>
                <li>• <strong>Form Components:</strong> Input and validation elements</li>
                <li>• <strong>Layout Components:</strong> Structural and organizational</li>
                <li>• <strong>Data Components:</strong> Tables, lists, and displays</li>
              </ul>
            </div>
          </CardContent>
        </EnhancedCard>

        {/* Usage Guide */}
        <EnhancedCard>
          <CardHeader>
            <CardTitle>Usage Guide</CardTitle>
            <CardDescription>How to use AI components in your projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Basic Usage:</h4>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
{`import { EnhancedButton } from '@/components/ui';

<EnhancedButton variant="default">
  Click me
</EnhancedButton>`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">With AI Registry:</h4>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
{`import { useAIComponentRegistry } from '@/hooks';

const { findBestComponent } = useAIComponentRegistry();
const component = findBestComponent('submit button');`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Code Generation:</h4>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
{`const { generateComponentCode } = useAIComponentRegistry();
const code = generateComponentCode('Button', {
  variant: 'primary',
  children: 'Submit'
});`}
              </pre>
            </div>
          </CardContent>
        </EnhancedCard>

        {/* AI Prompts */}
        <EnhancedCard>
          <CardHeader>
            <CardTitle>AI Generation Prompts</CardTitle>
            <CardDescription>Example prompts for AI component generation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Button Generation:</h4>
              <p className="text-sm text-muted-foreground">
                "Create a primary button for form submission with loading state support"
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Form Generation:</h4>
              <p className="text-sm text-muted-foreground">
                "Generate a contact form with name, email, and message fields with validation"
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Card Generation:</h4>
              <p className="text-sm text-muted-foreground">
                "Create a dashboard widget card showing user statistics with trend indicators"
              </p>
            </div>
          </CardContent>
        </EnhancedCard>

        {/* Best Practices */}
        <EnhancedCard>
          <CardHeader>
            <CardTitle>Best Practices</CardTitle>
            <CardDescription>Guidelines for AI component development</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Component Design:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Use semantic HTML elements</li>
                <li>• Include proper ARIA attributes</li>
                <li>• Support keyboard navigation</li>
                <li>• Provide clear prop interfaces</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">AI Integration:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Write descriptive component metadata</li>
                <li>• Include comprehensive examples</li>
                <li>• Provide clear generation prompts</li>
                <li>• Document usage patterns</li>
              </ul>
            </div>
          </CardContent>
        </EnhancedCard>
      </div>
    </div>
  );
};