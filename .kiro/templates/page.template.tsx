import type { Metadata } from 'next';
{{#imports}}
import { {{name}} } from '{{path}}';
{{/imports}}

export const metadata: Metadata = {
  title: '{{title}}',
  description: '{{description}}',
  {{#additionalMetadata}}
  {{key}}: {{value}},
  {{/additionalMetadata}}
};

{{#serverComponent}}
export default async function {{PageName}}Page({{#params}}{ params }: { params: {{type}} }{{/params}}) {
{{/serverComponent}}{{^serverComponent}}
'use client';

export default function {{PageName}}Page({{#params}}{ params }: { params: {{type}} }{{/params}}) {
{{/serverComponent}}
  {{#serverLogic}}
  {{content}}
  {{/serverLogic}}

  return (
    <div className="{{containerClasses}}">
      {{#header}}
      <header className="{{headerClasses}}">
        <h1 className="{{titleClasses}}">{{title}}</h1>
        {{#description}}
        <p className="{{descriptionClasses}}">{{description}}</p>
        {{/description}}
        {{#actions}}
        <div className="{{actionsClasses}}">
          {{content}}
        </div>
        {{/actions}}
      </header>
      {{/header}}

      <main className="{{mainClasses}}">
        {{#sections}}
        <section className="{{sectionClasses}}">
          {{content}}
        </section>
        {{/sections}}
      </main>

      {{#footer}}
      <footer className="{{footerClasses}}">
        {{content}}
      </footer>
      {{/footer}}
    </div>
  );
}