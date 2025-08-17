# New Aspire Property Management 2025

A modern property management system built with Next.js, TypeScript, and Tailwind CSS, following SOLID principles and senior software engineering practices.

## 🏗️ Architecture & Design Principles

This project is built following **SOLID principles** and **Object-Oriented Programming** concepts:

### SOLID Principles Implementation

1. **Single Responsibility Principle (SRP)**
   - Each component has one reason to change
   - Components are focused on specific functionality
   - Clear separation of concerns

2. **Open/Closed Principle (OCP)**
   - Components are open for extension, closed for modification
   - Type definitions allow for easy extension
   - Hook-based architecture enables flexible data management

3. **Liskov Substitution Principle (LSP)**
   - Type interfaces are consistent and substitutable
   - Component props follow strict typing contracts

4. **Interface Segregation Principle (ISP)**
   - Components only depend on interfaces they use
   - Minimal prop interfaces for each component

5. **Dependency Inversion Principle (DIP)**
   - High-level components depend on abstractions
   - Custom hooks provide data abstraction layer

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page component
├── components/             # Reusable UI components
│   ├── Header.tsx         # Application header
│   ├── PropertyDashboard.tsx # Main dashboard
│   ├── PropertyCard.tsx   # Individual property display
│   └── DashboardStats.tsx # Statistics display
├── hooks/                  # Custom React hooks
│   └── usePropertyData.ts # Property data management
├── types/                  # TypeScript type definitions
│   ├── Property.ts        # Property entity types
│   └── DashboardStats.ts  # Dashboard statistics types
└── styles/                 # Global styles
    └── globals.css        # Tailwind CSS and custom styles
```

## 🎯 Key Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Component Architecture**: Modular, reusable components
- **Data Management**: Custom hooks for state management
- **Responsive Design**: Mobile-first approach
- **Performance**: Next.js optimization features

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Linting**: ESLint with Next.js config
- **Build Tool**: Next.js built-in bundler

## 📊 Component Architecture

### Header Component
- Navigation menu
- Brand identity
- Action buttons

### Property Dashboard
- Main dashboard view
- Statistics overview
- Property grid layout

### Property Card
- Individual property information
- Status indicators
- Action buttons

### Dashboard Stats
- Key performance metrics
- Visual indicators
- Trend information

## 🔧 Custom Hooks

### usePropertyData
- Manages property data state
- Handles data fetching
- Provides loading states
- Calculates statistics

## 🎨 Design System

### Color Palette
- Primary: Blue (#3b82f6)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Error: Red (#ef4444)
- Neutral: Gray scale

### Component Classes
- `.btn-primary`: Primary button styling
- `.card`: Card container styling

## 📝 Code Quality

- **ESLint**: Code quality and consistency
- **TypeScript**: Type safety and IntelliSense
- **Prettier**: Code formatting (recommended)
- **SOLID Principles**: Clean architecture patterns

## 🚀 Deployment

The application can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any Node.js hosting platform

## 🤝 Contributing

1. Follow SOLID principles
2. Maintain component responsibility
3. Use TypeScript for all new code
4. Follow existing naming conventions
5. Add proper documentation for new components

## 📄 License

This project is proprietary software for New Aspire Property Management.
