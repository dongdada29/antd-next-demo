'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const {{componentName}}Variants = cva(
  '{{baseClasses}}',
  {
    variants: {
      {{#variants}}
      {{name}}: {
        {{#values}}
        {{value}}: '{{classes}}',
        {{/values}}
      },
      {{/variants}}
    },
    defaultVariants: {
      {{#defaultVariants}}
      {{name}}: '{{value}}',
      {{/defaultVariants}}
    },
  }
);

export interface {{ComponentName}}Props
  extends React.{{htmlElement}}HTMLAttributes<HTML{{HtmlElement}}Element>,
    VariantProps<typeof {{componentName}}Variants> {
  {{#props}}
  /** {{description}} */
  {{name}}{{#optional}}?{{/optional}}: {{type}};
  {{/props}}
}

/**
 * {{description}}
 * 
 * @example
 * ```tsx
 * <{{ComponentName}} {{#exampleProps}}{{name}}={{value}} {{/exampleProps}}>
 *   {{exampleContent}}
 * </{{ComponentName}}>
 * ```
 */
const {{ComponentName}} = React.forwardRef<HTML{{HtmlElement}}Element, {{ComponentName}}Props>(
  ({ className, {{#variants}}{{name}}, {{/variants}}{{#props}}{{name}}, {{/props}}...props }, ref) => {
    return (
      <{{htmlElement}}
        className={cn({{componentName}}Variants({ {{#variants}}{{name}}, {{/variants}}className }))}
        ref={ref}
        {{#additionalProps}}
        {{name}}={{value}}
        {{/additionalProps}}
        {...props}
      {{#selfClosing}}/>{{/selfClosing}}{{^selfClosing}}>
        {{#children}}{{content}}{{/children}}
      </{{htmlElement}}>{{/selfClosing}}
    );
  }
);
{{ComponentName}}.displayName = '{{ComponentName}}';

export { {{ComponentName}}, {{componentName}}Variants };