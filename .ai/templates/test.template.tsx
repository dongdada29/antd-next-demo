import { render, screen{{#additionalImports}}, {{name}}{{/additionalImports}} } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
{{#customImports}}
import { {{name}} } from '{{path}}';
{{/customImports}}
import { {{ComponentName}} } from './{{componentFile}}';

{{#mockData}}
const {{name}} = {{value}};
{{/mockData}}

{{#testWrappers}}
const {{name}} = ({ children }: { children: React.ReactNode }) => (
  {{content}}
);
{{/testWrappers}}

describe('{{ComponentName}}', () => {
  {{#setupTests}}
  beforeEach(() => {
    {{content}}
  });
  {{/setupTests}}

  {{#teardownTests}}
  afterEach(() => {
    {{content}}
  });
  {{/teardownTests}}

  it('renders correctly', () => {
    render(<{{ComponentName}} {{#defaultProps}}{{name}}={{value}} {{/defaultProps}}>{{defaultContent}}</{{ComponentName}}>);
    
    {{#assertions}}
    expect({{assertion}}).{{matcher}};
    {{/assertions}}
  });

  {{#propTests}}
  it('{{description}}', () => {
    render(<{{ComponentName}} {{#props}}{{name}}={{value}} {{/props}}>{{content}}</{{ComponentName}}>);
    
    {{#assertions}}
    expect({{assertion}}).{{matcher}};
    {{/assertions}}
  });
  {{/propTests}}

  {{#interactionTests}}
  it('{{description}}', async () => {
    const user = userEvent.setup();
    const {{handlerName}} = jest.fn();
    
    render(<{{ComponentName}} {{#props}}{{name}}={{value}} {{/props}}>{{content}}</{{ComponentName}}>);
    
    {{#interactions}}
    await user.{{action}}({{target}});
    {{/interactions}}
    
    {{#assertions}}
    expect({{assertion}}).{{matcher}};
    {{/assertions}}
  });
  {{/interactionTests}}

  {{#accessibilityTests}}
  it('{{description}}', () => {
    render(<{{ComponentName}} {{#props}}{{name}}={{value}} {{/props}}>{{content}}</{{ComponentName}}>);
    
    {{#assertions}}
    expect({{assertion}}).{{matcher}};
    {{/assertions}}
  });
  {{/accessibilityTests}}

  {{#customTests}}
  it('{{description}}', {{#async}}async {{/async}}() => {
    {{#setup}}
    {{content}}
    {{/setup}}
    
    render({{renderContent}});
    
    {{#actions}}
    {{content}}
    {{/actions}}
    
    {{#assertions}}
    expect({{assertion}}).{{matcher}};
    {{/assertions}}
  });
  {{/customTests}}
});