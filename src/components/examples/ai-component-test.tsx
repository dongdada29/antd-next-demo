/**
 * AI Component Test Suite
 * 
 * Comprehensive test component to verify AI component registry,
 * enhanced components, and generation capabilities.
 */

import * as React from 'react';
import { 
  useAIComponentRegistry, 
  useAIComponentSuggestions,
  useComponentDocumentation 
} from '@/hooks/useAIComponentRegistry';
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
 * Registry Status Component
 */
const RegistryStatus: React.FC = () => {
  const { isInitialized, stats } = useAIComponentRegistry();

  return (
    <EnhancedCard>
      <CardHeader>
        <CardTitle>Registry Status</CardTitle>
        <CardDescription>AI Component Registry initialization and statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Status:</span>
            <span className={isInitialized ? 'text-green-600' : 'text-red-600'}>
              {isInitialized ? '✓ Initialized' : '✗ Not Initialized'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Components:</span>
            <span>{stats.components}</span>
          </div>
          <div className="flex justify-between">
            <span>Templates:</span>
            <span>{stats.templates}</span>
          </div>
          <div className="flex justify-between">
            <span>Categories:</span>
            <span>{stats.categories}</span>
          </div>
        </div>
        
        {stats.componentsByCategory.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Components by Category:</h4>
            <div className="space-y-1">
              {stats.componentsByCategory.map((cat, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{cat.category}:</span>
                  <span>{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </EnhancedCard>
  );
};

/**
 * Component Search Test
 */
const ComponentSearchTest: React.FC = () => {
  const { searchComponents, getComponent } = useAIComponentRegistry();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<any[]>([]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const results = searchComponents({
      name: searchTerm,
      description: searchTerm
    });
    setSearchResults(results);
  };

  return (
    <EnhancedCard>
      <CardHeader>
        <CardTitle>Component Search</CardTitle>
        <CardDescription>Search for components in the registry</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <EnhancedInput
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <EnhancedButton onClick={handleSearch}>Search</EnhancedButton>
        </div>
        
        {searchResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Search Results:</h4>
            {searchResults.map((component, index) => (
              <div key={index} className="p-2 border rounded text-sm">
                <div className="font-medium">{component.name}</div>
                <div className="text-muted-foreground">{component.description}</div>
                <div className="text-xs text-blue-600">Type: {component.type}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </EnhancedCard>
  );
};

/**
 * AI Suggestions Test
 */
const AISuggestionsTest: React.FC = () => {
  const [requirement, setRequirement] = React.useState('');
  const { suggestions, bestMatch, isLoading } = useAIComponentSuggestions(requirement);

  return (
    <EnhancedCard>
      <CardHeader>
        <CardTitle>AI Component Suggestions</CardTitle>
        <CardDescription>Get AI-powered component recommendations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <EnhancedInput
          label="Describe what you need"
          placeholder="e.g., 'I need a button for submitting forms'"
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          helperText="Describe the component you need and get AI suggestions"
        />
        
        {isLoading && (
          <div className="text-center text-muted-foreground">Loading suggestions...</div>
        )}
        
        {bestMatch && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <h4 className="font-medium text-green-800">Best Match:</h4>
            <div className="text-green-700">
              <div className="font-medium">{bestMatch.name}</div>
              <div className="text-sm">{bestMatch.description}</div>
            </div>
          </div>
        )}
        
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Other Suggestions:</h4>
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <div key={index} className="p-2 border rounded text-sm">
                <div className="font-medium">{suggestion.name}</div>
                <div className="text-muted-foreground">{suggestion.description}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </EnhancedCard>
  );
};

/**
 * Code Generation Test
 */
const CodeGenerationTest: React.FC = () => {
  const { generateComponentCode, getComponent } = useAIComponentRegistry();
  const [componentName, setComponentName] = React.useState('Button');
  const [generatedCode, setGeneratedCode] = React.useState('');

  const handleGenerate = () => {
    try {
      const code = generateComponentCode(componentName, {
        variant: 'primary',
        size: 'md',
        children: 'Click me'
      });
      setGeneratedCode(code);
    } catch (error) {
      setGeneratedCode(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <EnhancedCard>
      <CardHeader>
        <CardTitle>Code Generation</CardTitle>
        <CardDescription>Generate component code using AI templates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <EnhancedInput
            label="Component Name"
            value={componentName}
            onChange={(e) => setComponentName(e.target.value)}
            placeholder="Button"
          />
          <div className="flex items-end">
            <EnhancedButton onClick={handleGenerate}>Generate</EnhancedButton>
          </div>
        </div>
        
        {generatedCode && (
          <div className="space-y-2">
            <h4 className="font-medium">Generated Code:</h4>
            <pre className="p-3 bg-gray-100 rounded text-xs overflow-x-auto">
              <code>{generatedCode}</code>
            </pre>
          </div>
        )}
      </CardContent>
    </EnhancedCard>
  );
};

/**
 * Documentation Generation Test
 */
const DocumentationTest: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = React.useState('Button');
  const { documentation, isGenerating, generateDocumentation } = useComponentDocumentation();

  const handleGenerateDoc = () => {
    generateDocumentation(selectedComponent);
  };

  return (
    <EnhancedCard>
      <CardHeader>
        <CardTitle>Documentation Generation</CardTitle>
        <CardDescription>Generate comprehensive component documentation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <EnhancedInput
            label="Component Name"
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
            placeholder="Button"
          />
          <div className="flex items-end">
            <EnhancedButton onClick={handleGenerateDoc} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate Docs'}
            </EnhancedButton>
          </div>
        </div>
        
        {documentation && (
          <div className="space-y-2">
            <h4 className="font-medium">Generated Documentation:</h4>
            <div className="p-3 bg-gray-50 rounded text-xs overflow-x-auto max-h-64 overflow-y-auto">
              <pre>{documentation}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </EnhancedCard>
  );
};

/**
 * Main AI Component Test Suite
 */
export const AIComponentTestSuite: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">AI Component Test Suite</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive testing of AI component registry and generation capabilities
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RegistryStatus />
        <ComponentSearchTest />
        <AISuggestionsTest />
        <CodeGenerationTest />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <DocumentationTest />
      </div>
    </div>
  );
};