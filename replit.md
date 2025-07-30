# Eco Guardian - AI-Powered Waste Reduction & Reusability Advisor

## Overview

Eco Guardian is a modern Spring Boot web application that uses Spring AI to help users identify wasteful items and find eco-friendly alternatives. The application analyzes uploaded images using OpenAI's GPT-4o vision model, suggests sustainable alternatives, calculates CO2 savings, and gamifies the experience through a reward system with EcoPoints and achievements.

**Latest Update**: Successfully converted to Spring Boot with Spring AI integration (July 30, 2025)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Java Server Pages (JSP) with JSTL and Bootstrap 5.3.2
- **Styling**: Custom eco-themed CSS with Spring AI branding
- **UI Components**: Bootstrap components with Bootstrap Icons
- **JavaScript**: Modern ES6+ SPA functionality with AJAX
- **Build Tool**: Maven with Spring Boot packaging

### Backend Architecture
- **Runtime**: Java 21 with Spring Boot 3.2.2
- **Framework**: Spring MVC with embedded Tomcat server
- **Web Container**: Apache Tomcat (embedded) for development and deployment
- **AI Integration**: Spring AI with OpenAI GPT-4o vision model
- **Data Layer**: Spring Data JPA with Hibernate ORM

### Data Storage Strategy
- **Development Database**: H2 in-memory database with web console
- **Production Ready**: PostgreSQL configuration included
- **ORM**: Hibernate with automatic schema generation
- **Repository Pattern**: Spring Data JPA repositories for data access

## Key Components

### Spring AI Analysis Service
- **Image Recognition**: Spring AI ChatClient with OpenAI GPT-4o vision model
- **Integration**: Native Spring AI framework for seamless OpenAI integration
- **Fallback System**: Comprehensive demo data when API quota exceeded
- **Error Handling**: Spring Boot exception handling with user-friendly messages

### Spring MVC Controller Architecture
- **HomeController**: Serves main JSP page with user context
- **ApiController**: RESTful endpoints for all AJAX operations
- **Exception Handling**: Global exception handling with proper HTTP status codes
- **Content Negotiation**: JSON responses for API endpoints, JSP for web pages

### JPA Entity Models
- **User Entity**: EcoPoints, levels, achievements with JPA annotations
- **Action Entity**: User action history with bidirectional relationships
- **DTO Classes**: AnalysisResult, NewsItem, RecyclingCenter for data transfer
- **Repository Layer**: Spring Data JPA repositories with custom queries

### User Interface (Spring Boot JSP)
- **index.jsp**: Single-page application with Spring integration
- **Bootstrap Integration**: Modern responsive design with Spring AI branding
- **JavaScript SPA**: AJAX communication with Spring Boot REST endpoints
- **Static Resources**: CSS/JS served from Spring Boot static resources

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

### Running the Spring Boot Application
- **Development Server**: `mvn spring-boot:run` starts embedded Tomcat
- **Port Configuration**: Tomcat runs on port 5000 (configurable via application.yml)
- **Environment**: Uses OPENAI_API_KEY environment variable for Spring AI
- **Hot Reload**: Spring Boot DevTools for automatic restart during development
- **Database Console**: H2 web console available at `/h2-console`

The application follows Spring Boot best practices with modern enterprise patterns, providing a robust and scalable foundation for environmental sustainability tracking through Spring AI-powered analysis.