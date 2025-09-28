/**
 * Component Generation Demo
 * 
 * Comprehensive demonstration of AI component generation tools,
 * including interactive generation, pattern usage, and management.
 */

import * as React from 'react';
import { 
  useComponentGeneration,
  useComponentTemplates 
} from '@/hooks/useComponentGeneration';
import { ComponentBuilder, ComponentPatterns } from '@/lib/component-config-builder';
import { 
  EnhancedButton, 
  EnhancedCard, 
  EnhancedInput,
  FormField,
  Form,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui';

/**
 * Component Generation Interface
 */
export const ComponentGenerationDemo: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'generate' | 'patterns' | 'history' | 'analytics'>('generate');

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">AI Component Generation</h1>
          <p className="text-xl text-muted-foreground">
            Create React components using AI-powered generation tools
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-2">
          <EnhancedButton
            variant={activeTab === 'generate' ? 'default' : 'outline'}
            onClick={() => setActiveTab('generate')}
          >
            Generate
          </EnhancedButton>
          <EnhancedButton
            variant={activeTab === 'patterns' ? 'default' : 'outline'}
            onClick={() => setActiveTab('patterns')}
          >
            Patterns
          </EnhancedButton>
          <EnhancedButton
            variant={activeTab === 'history' ? 'default' : 'outline'}
            onClick={() => setActiveTab('history')}
          >
            History
          </EnhancedButton>
          <EnhancedButton
            variant={activeTab === 'analytics' ? 'default' : 'outline'}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </EnhancedButton>
        </div>

        {/* Content */}
        {activeTab === 'generate' && <GenerateTab />}
        {activeTab === 'patterns' && <PatternsTab />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </div>
    </div>
  );
};

/**
 * Generate Tab - Custom component generation
 */
const GenerateTab: React.FC = () => {
  const { 
    generateComponent, 
    state, 
    reset 
  } = useComponentGeneration();

  const [formData, setFormData] = React.useState({
    name: '',
    type: 'ui' as const,
    description: '',
    interactive: false,
    responsive: true,
    darkMode: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const request = ComponentBuilder.create()
        .name(formData.name)
        .type(formData.type)
        .description(formData.description)
        .functionality({
          interactive: formData.interactive,
          accessibility: true
        })
        .styling({
          responsive: formData.responsive,
          darkMode: formData.darkMode
        })
        .build();

      await generateComponent(request);
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Generation Form */}
      <EnhancedCard>
        <CardHeader>
          <CardTitle>Generate Component</CardTitle>
          <CardDescription>Create a custom React component using AI</CardDescription>
        </CardHeader>
        
        <Form onSubmit={handleSubmit} variant="card">
          <FormField label="Component Name" required>
            <EnhancedInput
              placeholder="MyComponent"
              value={formData.name}
              onChange={handleInputChange('name')}
            />
          </FormField>

          <FormField label="Component Type" required>
            <select
              value={formData.type}
              onChange={handleInputChange('type')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="ui">UI Component</option>
              <option value="form">Form Component</option>
              <option value="layout">Layout Component</option>
              <option value="data">Data Component</option>
              <option value="common">Common Component</option>
            </select>
          </FormField>

          <FormField label="Description" required>
            <textarea
              placeholder="Describe what this component should do..."
              value={formData.description}
              onChange={handleInputChange('description')}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              rows={3}
            />
          </FormField>

          <div className="space-y-2">
            <label className="text-sm font-medium">Features</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.interactive}
                  onChange={handleInputChange('interactive')}
                />
                <span className="text-sm">Interactive (click, hover, focus)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.responsive}
                  onChange={handleInputChange('responsive')}
                />
                <span className="text-sm">Responsive design</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.darkMode}
                  onChange={handleInputChange('darkMode')}
                />
                <span className="text-sm">Dark mode support</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <EnhancedButton 
              type="submit" 
              disabled={state.status === 'generating'}
              className="flex-1"
            >
              {state.status === 'generating' ? 'Generating...' : 'Generate Component'}
            </EnhancedButton>
            
            {state.status !== 'idle' && (
              <EnhancedButton 
                type="button" 
                variant="outline"
                onClick={reset}
              >
                Reset
              </EnhancedButton>
            )}
          </div>
        </Form>
      </EnhancedCard>

      {/* Generation Status & Results */}
      <EnhancedCard>
        <CardHeader>
          <CardTitle>Generation Status</CardTitle>
          <CardDescription>Real-time generation progress and results</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Progress */}
          {state.status === 'generating' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{state.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${state.progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">{state.currentStep}</p>
            </div>
          )}

          {/* Success */}
          {state.status === 'success' && state.result && (
            <div className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded text-green-800">
                ✅ Component generated successfully!
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Generated: {state.result.config.name}</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Type: {state.result.config.type}</div>
                  <div>Props: {state.result.config.props.length}</div>
                  <div>Variants: {state.result.config.variants.length}</div>
                  <div>Lines: {state.result.code.split('\n').length}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Generated Code Preview:</h4>
                <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto max-h-40">
                  <code>{state.result.code.slice(0, 500)}...</code>
                </pre>
              </div>
            </div>
          )}

          {/* Error */}
          {state.status === 'error' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800">
              ❌ Generation failed: {state.error}
            </div>
          )}

          {/* Idle */}
          {state.status === 'idle' && (
            <div className="text-center text-muted-foreground py-8">
              Fill out the form and click "Generate Component" to start
            </div>
          )}
        </CardContent>
      </EnhancedCard>
    </div>
  );
};

/**
 * Patterns Tab - Predefined component patterns
 */
const PatternsTab: React.FC = () => {
  const { generateFromPattern, state } = useComponentGeneration();
  const [selectedPattern, setSelectedPattern] = React.useState<string>('');
  const [customName, setCustomName] = React.useState('');

  const patterns = [
    { key: 'button', name: 'Button', description: 'Interactive button with variants' },
    { key: 'input', name: 'Input', description: 'Form input with validation' },
    { key: 'card', name: 'Card', description: 'Content container' },
    { key: 'dataTable', name: 'Data Table', description: 'Table with sorting and pagination' },
    { key: 'form', name: 'Form', description: 'Form container with validation' },
    { key: 'layout', name: 'Layout', description: 'Page layout component' }
  ];

  const handleGeneratePattern = async () => {
    if (!selectedPattern) return;

    try {
      await generateFromPattern(
        selectedPattern as keyof typeof ComponentPatterns,
        customName ? { name: customName } : undefined
      );
    } catch (error) {
      console.error('Pattern generation failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <EnhancedCard>
        <CardHeader>
          <CardTitle>Component Patterns</CardTitle>
          <CardDescription>Generate components from predefined patterns</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patterns.map(pattern => (
              <div
                key={pattern.key}
                className={`p-4 border rounded cursor-pointer transition-colors ${
                  selectedPattern === pattern.key 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedPattern(pattern.key)}
              >
                <h4 className="font-medium">{pattern.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">{pattern.description}</p>
              </div>
            ))}
          </div>

          {selectedPattern && (
            <div className="space-y-4 pt-4 border-t">
              <FormField label="Custom Name (optional)">
                <EnhancedInput
                  placeholder={`Custom${patterns.find(p => p.key === selectedPattern)?.name}`}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
              </FormField>

              <EnhancedButton 
                onClick={handleGeneratePattern}
                disabled={state.status === 'generating'}
                className="w-full"
              >
                {state.status === 'generating' 
                  ? 'Generating...' 
                  : `Generate ${patterns.find(p => p.key === selectedPattern)?.name}`
                }
              </EnhancedButton>
            </div>
          )}
        </CardContent>
      </EnhancedCard>

      {/* Pattern Results */}
      {state.result && (
        <EnhancedCard>
          <CardHeader>
            <CardTitle>Generated Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="font-medium">{state.result.config.name}</div>
              <div className="text-sm text-muted-foreground">{state.result.config.description}</div>
              <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto max-h-60">
                <code>{state.result.code}</code>
              </pre>
            </div>
          </CardContent>
        </EnhancedCard>
      )}
    </div>
  );
};

/**
 * History Tab - Generation history
 */
const HistoryTab: React.FC = () => {
  const { history, regenerateFromHistory, clearHistory } = useComponentGeneration();

  return (
    <div className="space-y-6">
      <EnhancedCard>
        <CardHeader>
          <CardTitle>Generation History</CardTitle>
          <CardDescription>View and manage your component generation history</CardDescription>
          <div className="flex gap-2">
            <EnhancedButton 
              variant="outline" 
              size="sm"
              onClick={clearHistory}
              disabled={history.entries.length === 0}
            >
              Clear History
            </EnhancedButton>
          </div>
        </CardHeader>
        
        <CardContent>
          {history.entries.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No generation history yet. Generate some components to see them here.
            </div>
          ) : (
            <div className="space-y-4">
              {history.entries.map(entry => (
                <div key={entry.id} className="border rounded p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{entry.request.name}</h4>
                      <p className="text-sm text-muted-foreground">{entry.request.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        entry.success 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {entry.success ? 'Success' : 'Failed'}
                      </span>
                      <EnhancedButton
                        size="sm"
                        variant="outline"
                        onClick={() => regenerateFromHistory(entry.id)}
                      >
                        Regenerate
                      </EnhancedButton>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-x-4">
                    <span>Type: {entry.request.type}</span>
                    <span>Duration: {entry.duration}ms</span>
                    <span>Generated: {entry.timestamp.toLocaleString()}</span>
                  </div>
                  
                  {entry.error && (
                    <div className="mt-2 text-sm text-red-600">
                      Error: {entry.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </EnhancedCard>
    </div>
  );
};

/**
 * Analytics Tab - Generation statistics
 */
const AnalyticsTab: React.FC = () => {
  const { getStatistics } = useComponentGeneration();
  const stats = getStatistics();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <EnhancedCard>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{stats.totalGenerations}</div>
            <div className="text-sm text-muted-foreground">Total Generations</div>
          </CardContent>
        </EnhancedCard>

        <EnhancedCard>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{stats.successfulGenerations}</div>
            <div className="text-sm text-muted-foreground">Successful</div>
          </CardContent>
        </EnhancedCard>

        <EnhancedCard>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </CardContent>
        </EnhancedCard>

        <EnhancedCard>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{Math.round(stats.averageDuration)}ms</div>
            <div className="text-sm text-muted-foreground">Avg Duration</div>
          </CardContent>
        </EnhancedCard>
      </div>

      <EnhancedCard>
        <CardHeader>
          <CardTitle>Component Types</CardTitle>
          <CardDescription>Distribution of generated component types</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(stats.componentTypes).length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No data available yet. Generate some components to see statistics.
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(stats.componentTypes).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="capitalize">{type}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </EnhancedCard>
    </div>
  );
};