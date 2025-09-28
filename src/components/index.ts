// Component exports
export * from './forms';
export * from './lists';
export * from './common';
export * from './api-docs';
export * from './development';

// AI-friendly UI components
export * from './ui';

// Composite components
export * from './composite';

// AI component registry and helpers
export { aiComponentRegistry, AIComponentHelpers } from '@/lib/ai-component-registry';
export { componentDocGenerator } from '@/lib/component-documentation-generator';
export { initializeComponentRegistry, getRegistryStats } from '@/lib/initialize-component-registry';