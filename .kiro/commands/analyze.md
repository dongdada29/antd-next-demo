---
description: Analyze code quality and consistency across the Next.js + Ant Design project
---

User input: $ARGUMENTS

Goal: Perform comprehensive code analysis for the Next.js + Ant Design project to identify quality issues, consistency problems, and optimization opportunities.

Execution steps:

1. **Project Structure Analysis**
   - Verify proper Next.js 14 App Router structure
   - Check Ant Design component usage patterns
   - Validate TypeScript implementation consistency
   - Review file organization and naming conventions

2. **Code Quality Checks**
   - TypeScript type safety and coverage
   - React component best practices
   - Ant Design component usage patterns
   - Performance optimization opportunities
   - Accessibility compliance

3. **Consistency Validation**
   - Component naming conventions
   - File structure patterns
   - Import/export consistency
   - Styling approach uniformity
   - Error handling patterns

4. **Standards Compliance**
   - Next.js App Router best practices
   - Ant Design integration guidelines
   - TypeScript strict mode compliance
   - ESLint rule adherence
   - Project-specific conventions

5. **Generate Analysis Report**
   - Quality metrics and scores
   - Identified issues with severity levels
   - Consistency violations
   - Optimization recommendations
   - Actionable improvement suggestions

Output format:
```
## Code Analysis Report

### Quality Metrics
- TypeScript Coverage: XX%
- Component Consistency: XX%
- Performance Score: XX%
- Accessibility Compliance: XX%

### Issues Found
| ID | Category | Severity | Location | Description | Recommendation |
|----|----------|----------|----------|-------------|----------------|
| Q1 | TypeScript | HIGH | src/components/Button.tsx | Missing return type annotation | Add explicit return type |

### Recommendations
1. [Priority recommendation 1]
2. [Priority recommendation 2]
3. [Priority recommendation 3]

### Next Steps
- Run: `pnpm lint` to fix linting issues
- Run: `pnpm type-check` to verify TypeScript compliance
- Review: Component patterns for consistency
```