# Eco Guardian - AI-Powered Waste Reduction & Reusability Advisor

## Overview

Eco Guardian is a full-stack web application that uses AI to help users identify wasteful items and find eco-friendly alternatives. The application analyzes uploaded images using computer vision, suggests sustainable alternatives, calculates CO2 savings, and gamifies the experience through a reward system with EcoPoints and achievements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom eco-themed color palette
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **AI Integration**: OpenAI GPT-4o for image analysis and eco-alternative suggestions
- **Session Storage**: Connect-pg-simple for PostgreSQL-backed sessions

### Data Storage Strategy
- **Primary Database**: PostgreSQL for persistent data storage
- **Development Fallback**: In-memory storage for demo/development purposes
- **Database Migration**: Drizzle Kit for schema management and migrations
- **Connection**: Neon Database serverless PostgreSQL

## Key Components

### AI Analysis Service
- **Image Recognition**: OpenAI GPT-4o vision model for item identification
- **Natural Language Processing**: Generates eco-friendly alternative suggestions
- **Environmental Impact**: Calculates CO2 savings and environmental benefits
- **Structured Output**: Returns JSON-formatted analysis with confidence scores

### Gamification System
- **EcoPoints**: Point-based reward system for sustainable actions
- **User Levels**: Progressive achievement system (Eco Starter → Eco Champion → Eco Warrior)
- **Achievements**: Badge system for various eco-friendly milestones
- **Progress Tracking**: Monthly goals and progress visualization

### User Interface Components
- **AI Analyzer**: Image upload and analysis interface with drag-and-drop support
- **Dashboard**: Progress tracking, achievements, and user statistics
- **Navigation**: Sticky header with user points display and smooth scrolling
- **News Feed**: Environmental news and local events integration
- **Rewards Card**: Achievement display and progress visualization

## Data Flow

1. **Image Upload**: User uploads item photo through drag-and-drop interface
2. **AI Processing**: Image converted to base64 and sent to OpenAI GPT-4o for analysis
3. **Result Generation**: AI identifies item type and generates eco-friendly alternatives
4. **Database Storage**: Analysis results, user actions, and points stored in PostgreSQL
5. **UI Updates**: React Query invalidates cache and updates dashboard with new data
6. **Gamification**: Points awarded and achievements unlocked based on user actions

## External Dependencies

### AI Services
- **OpenAI API**: GPT-4o model for image analysis and text generation
- **Computer Vision**: Built-in vision capabilities for item recognition

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations and schema management

### Development Tools
- **Replit Integration**: Development environment support with cartographer plugin
- **TypeScript**: Full type safety across frontend and backend
- **Vite Plugins**: Runtime error overlay and development enhancements

### UI/UX Libraries
- **Radix UI**: Accessible primitive components
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for consistent iconography
- **React Hook Form**: Form state management with validation

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React application to `dist/public`
- **Backend**: ESBuild bundles Express server for Node.js production
- **Database**: Drizzle Kit handles schema migrations and deployments

### Environment Configuration
- **Development**: Hot reloading with Vite dev server and TSX for backend
- **Production**: Compiled JavaScript bundle with static file serving
- **Database**: Environment-based connection strings for different deployment stages

### Scalability Considerations
- **Stateless Architecture**: Session data stored in PostgreSQL for horizontal scaling
- **API Rate Limiting**: OpenAI API usage managed through request throttling
- **Image Processing**: Base64 encoding limits handled with file size validation
- **Database Connection**: Connection pooling through Neon's serverless infrastructure

The application follows a modern full-stack architecture with clear separation of concerns, type safety throughout, and a focus on environmental sustainability through gamified user engagement.