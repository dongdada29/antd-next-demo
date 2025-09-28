/**
 * AI-Friendly Style Generation Prompts
 * Focused on Tailwind CSS class generation for AI agents
 */

export const aiStylePrompts = {
  // Core Tailwind CSS generation principles
  tailwindGeneration: `
When generating Tailwind CSS classes, follow these AI-friendly principles:

1. **Use Semantic Design Tokens**
   - Colors: bg-primary, text-foreground, border-border
   - Spacing: space-y-4, gap-6, p-4, m-2
   - Typography: text-lg, font-medium, leading-relaxed
   - Shadows: shadow-sm, shadow-md, shadow-lg

2. **Apply Consistent Patterns**
   - Buttons: "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
   - Cards: "bg-card text-card-foreground rounded-lg border shadow-sm p-6"
   - Inputs: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
   - Containers: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"

3. **Implement Responsive Design**
   - Mobile-first: base classes for mobile, then sm:, md:, lg:, xl:, 2xl:
   - Grid layouts: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
   - Typography: "text-sm md:text-base lg:text-lg"
   - Spacing: "p-4 md:p-6 lg:p-8"

4. **Ensure Accessibility**
   - Focus states: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
   - Color contrast: Use semantic colors that meet WCAG standards
   - Touch targets: Minimum 44px for interactive elements
   - Screen readers: Include sr-only classes for additional context

5. **Use AI-Friendly Utility Classes**
   - Layout: ai-container, ai-grid-auto, ai-flex-center, ai-flex-between
   - Components: ai-card, ai-button-primary, ai-input
   - Text: ai-text-heading, ai-text-body, ai-text-balance
   - Spacing: ai-spacing-section, ai-spacing-content, ai-spacing-compact
  `,

  // Responsive design patterns for AI
  responsivePatterns: `
Generate responsive Tailwind classes using these mobile-first patterns:

**Layout Patterns:**
- Single to multi-column: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
- Stack to row: "flex flex-col md:flex-row"
- Hide/show elements: "hidden md:block" or "block md:hidden"
- Container sizing: "w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"

**Typography Scaling:**
- Headings: "text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
- Body text: "text-sm md:text-base lg:text-lg"
- Line height: "leading-tight md:leading-normal lg:leading-relaxed"

**Spacing Adjustments:**
- Padding: "p-4 md:p-6 lg:p-8 xl:p-10"
- Margins: "mt-4 md:mt-6 lg:mt-8"
- Gaps: "gap-2 md:gap-4 lg:gap-6 xl:gap-8"

**Component Sizing:**
- Buttons: "h-9 px-3 text-xs md:h-10 md:px-4 md:text-sm lg:h-11 lg:px-6"
- Cards: "p-4 md:p-6 lg:p-8"
- Images: "w-full h-48 md:h-64 lg:h-80 object-cover"

**Navigation Patterns:**
- Mobile menu: "block md:hidden" for toggle, "hidden md:flex" for desktop nav
- Responsive nav: "flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6"
  `,

  // Dark mode implementation
  darkModePatterns: `
Implement dark mode using CSS variables and Tailwind classes:

**Automatic Dark Mode (Preferred):**
Use semantic color variables that automatically adapt:
- Background: "bg-background text-foreground"
- Cards: "bg-card text-card-foreground border-border"
- Buttons: "bg-primary text-primary-foreground hover:bg-primary/90"
- Inputs: "bg-background border-input focus:ring-ring"
- Muted content: "bg-muted text-muted-foreground"

**Manual Dark Mode Classes (When Needed):**
- Backgrounds: "bg-white dark:bg-gray-900"
- Text: "text-gray-900 dark:text-gray-100"
- Borders: "border-gray-200 dark:border-gray-700"
- Hover states: "hover:bg-gray-100 dark:hover:bg-gray-800"

**Best Practices:**
- Always test both light and dark modes
- Ensure proper contrast in both themes
- Use semantic colors when possible
- Provide smooth theme transitions: "transition-colors duration-200"
  `,

  // Accessibility-focused class generation
  accessibilityClasses: `
Generate accessible Tailwind classes following WCAG 2.1 AA standards:

**Focus Management:**
- Visible focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
- Focus within: "focus-within:ring-2 focus-within:ring-ring"
- Skip links: "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50"

**Color and Contrast:**
- High contrast text: Use semantic colors (text-foreground, text-muted-foreground)
- Interactive elements: Ensure 3:1 contrast ratio minimum
- Status indicators: Combine color with icons/text

**Touch Targets:**
- Minimum size: "min-h-[44px] min-w-[44px]"
- Button padding: "px-4 py-2" minimum
- Clickable areas: "p-3" minimum for touch interfaces

**Screen Reader Support:**
- Hidden content: "sr-only"
- Descriptive text: Include context in class combinations
- Status updates: Use appropriate ARIA live regions

**Keyboard Navigation:**
- Tab order: Ensure logical flow with proper HTML structure
- Interactive states: "hover:bg-accent focus:bg-accent active:bg-accent/90"
- Disabled states: "disabled:opacity-50 disabled:pointer-events-none"
  `,

  // Performance-optimized class patterns
  performancePatterns: `
Generate performance-optimized Tailwind classes:

**Animation Performance:**
- Use transform/opacity: "transition-transform duration-300 hover:scale-105"
- GPU acceleration: "transform-gpu"
- Smooth animations: "transition-all duration-200 ease-in-out"
- Reduced motion: "motion-reduce:transition-none motion-reduce:transform-none"

**Layout Performance:**
- Avoid layout shifts: "aspect-square", "aspect-video"
- Efficient layouts: Use CSS Grid/Flexbox over positioning
- Image optimization: "w-full h-auto object-cover"
- Container queries: Use responsive utilities efficiently

**Loading States:**
- Skeleton screens: "animate-pulse bg-muted rounded"
- Loading spinners: "animate-spin"
- Progressive loading: "opacity-0 animate-in fade-in duration-500"

**Bundle Optimization:**
- Use semantic classes to leverage Tailwind's optimization
- Avoid arbitrary values when possible: prefer "bg-primary" over "bg-[#3b82f6]"
- Group related utilities: "flex items-center justify-between gap-4"
  `,

  // Component-specific class patterns
  componentPatterns: `
Standard Tailwind class patterns for common components:

**Buttons:**
- Primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring"
- Secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
- Outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
- Ghost: "hover:bg-accent hover:text-accent-foreground"
- Destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"

**Cards:**
- Basic: "bg-card text-card-foreground rounded-lg border shadow-sm"
- Interactive: "bg-card text-card-foreground rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
- Elevated: "bg-card text-card-foreground rounded-lg shadow-lg border-0"

**Forms:**
- Input: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
- Label: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
- Error: "text-sm font-medium text-destructive"
- Helper: "text-sm text-muted-foreground"

**Navigation:**
- Nav container: "flex items-center justify-between px-4 py-3 border-b"
- Nav links: "text-sm font-medium transition-colors hover:text-primary"
- Active link: "text-primary font-medium"
- Mobile menu: "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"

**Data Display:**
- Table: "w-full caption-bottom text-sm"
- Table header: "border-b px-4 py-3 text-left font-medium text-muted-foreground"
- Table cell: "border-b px-4 py-3"
- Badge: "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"

**Layout:**
- Container: "container mx-auto px-4 sm:px-6 lg:px-8"
- Section: "py-12 md:py-16 lg:py-20"
- Grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
- Flex: "flex items-center justify-between gap-4"
  `,

  // Animation and transition patterns
  animationPatterns: `
Tailwind animation and transition patterns for smooth interactions:

**Standard Transitions:**
- Colors: "transition-colors duration-200"
- All properties: "transition-all duration-300 ease-in-out"
- Transform: "transition-transform duration-200"
- Opacity: "transition-opacity duration-300"

**Hover Effects:**
- Scale: "hover:scale-105 transition-transform duration-200"
- Shadow: "hover:shadow-lg transition-shadow duration-300"
- Opacity: "hover:opacity-80 transition-opacity duration-200"
- Background: "hover:bg-accent transition-colors duration-200"

**Focus Effects:**
- Ring: "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
- Outline: "focus-visible:outline-none focus-visible:ring-2"
- Scale: "focus:scale-105 transition-transform duration-200"

**Loading Animations:**
- Spin: "animate-spin" (for loading spinners)
- Pulse: "animate-pulse" (for skeleton screens)
- Bounce: "animate-bounce" (for attention)

**Enter/Exit Animations:**
- Fade in: "animate-in fade-in duration-300"
- Slide in: "animate-in slide-in-from-bottom-2 duration-300"
- Scale in: "animate-in zoom-in-95 duration-200"
- Fade out: "animate-out fade-out duration-200"

**Motion Preferences:**
- Respect reduced motion: "motion-reduce:transition-none motion-reduce:animate-none"
- Smooth scrolling: "scroll-smooth"
  `,
} as const;

// AI prompt templates for specific styling scenarios
export const aiStylePromptTemplates = {
  // Generate component styles
  generateComponentStyles: (componentName: string, requirements: string[]) => `
Generate Tailwind CSS classes for a ${componentName} component with these requirements:
${requirements.map(req => `- ${req}`).join('\n')}

Apply these styling principles:
1. Use semantic design tokens (bg-primary, text-foreground, etc.)
2. Implement responsive design with mobile-first approach
3. Include proper accessibility features (focus states, ARIA support)
4. Use AI-friendly utility classes when available (ai-*)
5. Ensure consistent spacing and typography
6. Support both light and dark modes automatically
7. Include hover, focus, and active states for interactive elements
8. Follow performance best practices

Provide complete className strings for all elements.
  `,

  // Generate layout styles
  generateLayoutStyles: (layoutType: string, sections: string[]) => `
Create Tailwind CSS classes for a ${layoutType} layout containing:
${sections.map(section => `- ${section}`).join('\n')}

Layout requirements:
1. Use CSS Grid or Flexbox for structure
2. Implement responsive breakpoints (xs, sm, md, lg, xl, 2xl)
3. Apply consistent spacing using design system tokens
4. Use ai-container and ai-grid-auto classes where appropriate
5. Ensure proper semantic HTML structure
6. Include accessibility considerations
7. Support both light and dark themes
8. Optimize for performance and loading states

Provide complete layout structure with Tailwind classes.
  `,

  // Generate form styles
  generateFormStyles: (formType: string, fields: string[]) => `
Generate Tailwind CSS classes for a ${formType} form with these fields:
${fields.map(field => `- ${field}`).join('\n')}

Form styling requirements:
1. Use ai-input class for input fields
2. Implement proper form validation states (error, success, warning)
3. Include accessible labels and helper text
4. Apply consistent spacing between form elements
5. Style buttons with appropriate variants (primary, secondary, outline)
6. Ensure mobile-friendly touch targets (minimum 44px)
7. Include loading and disabled states
8. Support keyboard navigation and screen readers
9. Use semantic colors for status indicators
10. Implement smooth transitions for state changes

Provide styling for all form elements and their various states.
  `,

  // Generate responsive styles
  generateResponsiveStyles: (breakpoints: string[], content: string) => `
Create responsive Tailwind CSS classes for: ${content}

Target breakpoints: ${breakpoints.join(', ')}

Responsive requirements:
1. Use mobile-first approach (base styles for mobile)
2. Apply progressive enhancement for larger screens
3. Ensure content remains accessible at all breakpoints
4. Optimize typography scaling across devices
5. Adjust spacing and sizing appropriately
6. Handle navigation patterns for different screen sizes
7. Consider touch vs. mouse interactions
8. Maintain visual hierarchy across breakpoints

Provide complete responsive class combinations.
  `,

  // Generate animation styles
  generateAnimationStyles: (animationType: string, trigger: string, duration: string) => `
Create Tailwind CSS animation classes for ${animationType} triggered by ${trigger} with ${duration} duration:

Animation requirements:
1. Use CSS transitions and transforms for performance
2. Respect prefers-reduced-motion accessibility setting
3. Apply appropriate easing functions (ease-in, ease-out, ease-in-out)
4. Include hover, focus, and active states
5. Ensure smooth 60fps performance
6. Use GPU-accelerated properties (transform, opacity)
7. Provide fallbacks for reduced motion preferences
8. Consider loading and state change animations

Include complete animation classes and state variations.
  `,
} as const;

// Utility functions for AI style generation
export const aiStyleUtils = {
  // Combine multiple class patterns
  combineClasses: (...classGroups: string[]) => {
    return classGroups.filter(Boolean).join(' ');
  },

  // Generate responsive class pattern
  generateResponsivePattern: (baseClass: string, breakpoints: Record<string, string>) => {
    const classes = [baseClass];
    Object.entries(breakpoints).forEach(([breakpoint, value]) => {
      classes.push(`${breakpoint}:${value}`);
    });
    return classes.join(' ');
  },

  // Generate state variants
  generateStateVariants: (baseClass: string, states: Record<string, string>) => {
    const classes = [baseClass];
    Object.entries(states).forEach(([state, value]) => {
      classes.push(`${state}:${value}`);
    });
    return classes.join(' ');
  },

  // Common class combinations
  commonCombinations: {
    button: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    card: 'rounded-lg border bg-card text-card-foreground shadow-sm',
    input: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    container: 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
    flexCenter: 'flex items-center justify-center',
    flexBetween: 'flex items-center justify-between',
    gridAuto: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
    textHeading: 'text-2xl font-semibold tracking-tight',
    textBody: 'text-sm text-muted-foreground',
    spacingSection: 'space-y-6',
    spacingContent: 'space-y-4',
  },
} as const;

export type AiStylePrompts = typeof aiStylePrompts;
export type AiStylePromptTemplates = typeof aiStylePromptTemplates;
export type AiStyleUtils = typeof aiStyleUtils;