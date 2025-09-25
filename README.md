# Antd Next AI Template

A Next.js 14 + React 18 + Ant Design 5 template optimized for AI-powered development workflows with Claude Code.

## 🚀 Features

- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Ant Design 5** for UI components
- **pnpm** for fast package management
- **AI-optimized** project structure
- **TypeScript** for type safety
- **ESLint** for code quality

## 🛠 Quick Start

### Prerequisites
- Node.js 18+
- pnpm

### Installation

1. Clone this template
```bash
git clone <repository-url>
cd antd-next-ai-template
```

2. Install dependencies
```bash
pnpm install
```

3. Start development server
```bash
pnpm dev
```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with AntdRegistry
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # Basic UI components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── index.ts          # Component exports
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── services/             # API services
├── types/                # TypeScript definitions
└── styles/               # Global styles
```

## 🤖 AI Development

This template is optimized for AI-assisted development with Claude Code.

### AI Prompt Guidelines

The project includes comprehensive AI development guidelines in `.ai-prompts.md`:

- **Code generation templates** for common tasks
- **Component generation patterns** 
- **File structure rules**
- **Code style guidelines**
- **Error handling patterns**
- **Performance considerations**

### Using with Claude Code

1. **Generate components**: Use the templates in `.ai-prompts.md`
2. **Follow patterns**: AI will reference existing code patterns
3. **Type safety**: All generated code includes TypeScript
4. **Ant Design integration**: Uses established antd patterns

### Example AI Prompts

```bash
# Generate a new form component
"Create a user registration form using Ant Design Form with validation"

# Add a new page
"Create a dashboard page with charts and data tables"

# Create an API service
"Generate a service for user management with CRUD operations"
```

## 📝 Available Scripts

```bash
pnpm dev          # Start development server on port 3001
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript type checking
```

## 🎨 Components

The template includes examples of commonly used Ant Design components:

- **Buttons**: Various types and states
- **Forms**: With validation and submission
- **Inputs**: Text, password, search
- **DatePicker**: Single and range picker
- **Select**: Dropdown with options
- **Cards**: Organized content sections
- **Layout**: Grid and spacing systems

## 🔧 Configuration

### Port Configuration
- Development: `3001`
- Production: Configurable via environment

### Ant Design Configuration
Ant Design is configured via `AntdRegistry` in `src/app/layout.tsx`

### TypeScript Configuration
Strict TypeScript mode enabled in `tsconfig.json`

## 🤝 Contributing

This template is designed for AI-assisted development. When contributing:

1. Follow the patterns established in `.ai-prompts.md`
2. Maintain TypeScript type safety
3. Use Ant Design components consistently
4. Keep the project structure organized

## 📄 License

MIT License - feel free to use this template for your projects.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Ant Design](https://ant.design/) - UI component library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [pnpm](https://pnpm.io/) - Fast package manager
- [Claude Code](https://claude.ai/code) - AI development assistant