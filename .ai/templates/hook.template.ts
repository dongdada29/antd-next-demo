'use client';

import * as React from 'react';
{{#imports}}
import { {{name}} } from '{{path}}';
{{/imports}}

{{#interfaces}}
export interface {{name}} {
  {{#properties}}
  /** {{description}} */
  {{name}}{{#optional}}?{{/optional}}: {{type}};
  {{/properties}}
}
{{/interfaces}}

/**
 * {{description}}
 * 
 * @param {{#parameters}}{{name}} - {{description}}{{/parameters}}
 * @returns {{returnDescription}}
 * 
 * @example
 * ```tsx
 * const {{#exampleUsage}}{{variable}} = {{hookName}}({{parameters}});{{/exampleUsage}}
 * ```
 */
export function {{hookName}}({{#parameters}}
  {{name}}{{#optional}}?{{/optional}}: {{type}}{{#hasNext}},{{/hasNext}}
{{/parameters}}): {{returnType}} {
  {{#state}}
  const [{{name}}, {{setter}}] = React.useState<{{type}}>({{initialValue}});
  {{/state}}

  {{#effects}}
  React.useEffect(() => {
    {{content}}
  }, [{{dependencies}}]);
  {{/effects}}

  {{#callbacks}}
  const {{name}} = React.useCallback(({{#parameters}}{{name}}: {{type}}{{#hasNext}}, {{/hasNext}}{{/parameters}}) => {
    {{content}}
  }, [{{dependencies}}]);
  {{/callbacks}}

  {{#memoizedValues}}
  const {{name}} = React.useMemo(() => {
    {{content}}
  }, [{{dependencies}}]);
  {{/memoizedValues}}

  {{#customLogic}}
  {{content}}
  {{/customLogic}}

  return {{#returnObject}}{
    {{#properties}}
    {{name}},
    {{/properties}}
  }{{/returnObject}}{{^returnObject}}{{returnValue}}{{/returnObject}};
}