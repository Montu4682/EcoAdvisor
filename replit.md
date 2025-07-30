# Eco Guardian - AI-Powered Waste Reduction & Reusability Advisor

## Overview

Eco Guardian is a full-stack Java web application that uses AI to help users identify wasteful items and find eco-friendly alternatives. The application analyzes uploaded images using computer vision, suggests sustainable alternatives, calculates CO2 savings, and gamifies the experience through a reward system with EcoPoints and achievements.

**Recent Conversion**: Successfully converted from React/TypeScript/Node.js to Java JSP architecture (July 30, 2025)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Java Server Pages (JSP) with JSTL
- **Styling**: Bootstrap 5.3.2 with custom eco-themed CSS
- **UI Components**: Bootstrap components with Bootstrap Icons
- **JavaScript**: Vanilla JavaScript with modern ES6+ features
- **Build Tool**: Maven for dependency management and build process

### Backend Architecture
- **Runtime**: Java 21 with Jakarta EE
- **Framework**: Jakarta Servlet API with embedded Jetty server
- **Web Container**: Eclipse Jetty for development and deployment
- **AI Integration**: OpenAI GPT-4o for image analysis via HTTP client
- **Session Management**: HTTP session-based state management

### Data Storage Strategy
- **Development Storage**: In-memory storage using ConcurrentHashMap
- **Production Ready**: Designed for easy PostgreSQL integration
- **Service Layer**: StorageService singleton pattern for data operations
- **Thread Safety**: Concurrent collections for multi-user support

## Key Components

### AI Analysis Service (OpenAIService.java)
- **Image Recognition**: OpenAI GPT-4o vision model for item identification
- **HTTP Client**: Apache HttpClient 5 for API communication
- **Fallback System**: Demo data when API quota exceeded
- **Error Handling**: Comprehensive error management with user-friendly messages

### Servlet Architecture
- **AIAnalysisServlet**: Handles image upload and AI analysis requests
- **UserServlet**: Manages user data and profile information
- **ActionsServlet**: Tracks user actions and history
- **NewsServlet**: Provides environmental news and updates
- **RecyclingCentersServlet**: Locates nearby recycling facilities

### Data Models
- **User**: EcoPoints, levels, achievements, and progress tracking
- **AnalysisResult**: AI analysis results with alternatives and environmental impact
- **Action**: User action history with points and CO2 savings
- **NewsItem**: Environmental news with categorization
- **RecyclingCenter**: Facility information with accepted materials

### User Interface (JSP Pages)
- **index.jsp**: Single-page application with all sections
- **Bootstrap Integration**: Responsive design with modern UI components
- **JavaScript SPA**: Dynamic content loading without page refreshes
- **Error Pages**: Custom 404 and 500 error handling

## Data Flow

1. **Image Upload**: User uploads item photo through multipart form submission
2. **Servlet Processing**: AIAnalysisServlet handles file validation and processing
3. **AI Integration**: OpenAIService converts image to base64 and calls GPT-4o API
4. **Result Processing**: JSON response parsed into AnalysisResult objects
5. **Storage Update**: StorageService updates user points, achievements, and action history
6. **Response Generation**: Servlet returns JSON response to frontend JavaScript
7. **UI Update**: JavaScript updates dashboard and displays analysis results

## External Dependencies

### AI Services
- **OpenAI API**: GPT-4o model for image analysis and text generation
- **Apache HttpClient 5**: HTTP client for OpenAI API communication

### Java Libraries
- **Jakarta Servlet API**: Web application framework
- **Jakarta JSP & JSTL**: Server-side templating and tag libraries
- **Jackson Databind**: JSON processing and object mapping
- **Apache Commons**: File upload and IO utilities
- **SLF4J & Logback**: Logging framework

### Frontend Libraries
- **Bootstrap 5.3.2**: CSS framework for responsive design
- **Bootstrap Icons**: Icon library for UI components
- **Vanilla JavaScript**: Modern ES6+ features for SPA functionality

### Build & Development Tools
- **Apache Maven**: Build automation and dependency management
- **Eclipse Jetty**: Embedded web server for development
- **OpenJDK 21**: Java runtime environment

## Deployment Strategy

### Build Process
- **Maven Build**: `mvn clean compile package` creates WAR file
- **Servlet Container**: Eclipse Jetty embedded server for development
- **Static Resources**: CSS, JavaScript, and JSP files served directly
- **Dependency Management**: Maven handles all library dependencies

### Environment Configuration
- **Development**: `mvn jetty:run` starts embedded Jetty server on port 5000
- **Production**: WAR deployment to any Jakarta EE compatible server
- **Configuration**: Environment variables for OpenAI API key
- **Logging**: SLF4J with Logback for comprehensive application logging

### Scalability Considerations
- **Thread Safety**: ConcurrentHashMap and thread-safe collections
- **Session Management**: HTTP sessions for user state management
- **Memory Efficiency**: In-memory storage with singleton pattern
- **API Integration**: Robust error handling and fallback mechanisms
- **File Upload**: Configurable size limits and validation

### Running the Application
- **Development Server**: `./run_server.sh` or `mvn jetty:run`
- **Port Configuration**: Jetty runs on port 5000 with host 0.0.0.0
- **Environment**: Requires OPENAI_API_KEY environment variable
- **Dependencies**: Maven automatically downloads required JAR files

The application follows Java enterprise patterns with modern web development practices, providing a robust and scalable foundation for environmental sustainability tracking through AI-powered analysis.