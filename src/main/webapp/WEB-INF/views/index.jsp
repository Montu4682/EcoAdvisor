<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="Use AI to identify wasteful items from photos and get eco-friendly alternatives. Track your environmental impact with EcoPoints and achieve sustainability goals.">
    
    <!-- Open Graph Tags -->
    <meta property="og:title" content="Eco Guardian - AI-Powered Waste Reduction Advisor">
    <meta property="og:description" content="Transform your environmental impact with AI-powered analysis of everyday items and personalized eco-friendly alternatives.">
    <meta property="og:type" content="website">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="<c:url value='/css/styles.css'/>">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-success sticky-top">
        <div class="container">
            <a class="navbar-brand fw-bold" href="#home">
                <i class="bi bi-recycle me-2"></i>Eco Guardian
            </a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="#home">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#analyzer">AI Analyzer</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#dashboard">Dashboard</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#news">News</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#recycling">Recycling Centers</a>
                    </li>
                </ul>
                
                <div class="navbar-text">
                    <span class="badge bg-warning text-dark">
                        <i class="bi bi-star-fill me-1"></i>
                        <span id="user-points">${user.ecoPoints}</span> EcoPoints
                    </span>
                    <span class="badge bg-info ms-2" id="user-level">${user.level}</span>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero-section bg-gradient text-white py-5">
        <div class="container">
            <div class="row align-items-center min-vh-50">
                <div class="col-lg-6">
                    <h1 class="display-4 fw-bold mb-4">
                        Transform Your Environmental Impact with Spring AI
                    </h1>
                    <p class="lead mb-4">
                        Upload photos of everyday items and get personalized eco-friendly alternatives using Spring Boot and Spring AI. 
                        Track your CO2 savings, earn EcoPoints, and join the sustainable living revolution.
                    </p>
                    <div class="d-flex gap-3">
                        <a href="#analyzer" class="btn btn-warning btn-lg px-4">
                            <i class="bi bi-camera me-2"></i>Start Analyzing
                        </a>
                        <a href="#dashboard" class="btn btn-outline-light btn-lg px-4">
                            View Dashboard
                        </a>
                    </div>
                </div>
                <div class="col-lg-6 text-center">
                    <div class="hero-stats">
                        <div class="row">
                            <div class="col-4">
                                <div class="stat-item">
                                    <h3 class="h2 fw-bold text-warning" id="total-co2-saved">${user.totalCO2Saved}</h3>
                                    <p class="mb-0">CO2 Saved (kg)</p>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="stat-item">
                                    <h3 class="h2 fw-bold text-info" id="total-points">${user.ecoPoints}</h3>
                                    <p class="mb-0">EcoPoints</p>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="stat-item">
                                    <h3 class="h2 fw-bold text-light" id="total-achievements">${user.achievements.size()}</h3>
                                    <p class="mb-0">Achievements</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- AI Analyzer Section -->
    <section id="analyzer" class="py-5">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="text-center mb-5">
                        <h2 class="h1 fw-bold text-success">Spring AI-Powered Item Analysis</h2>
                        <p class="lead text-muted">
                            Upload a photo of any item to get instant eco-friendly alternatives using OpenAI's GPT-4o vision model
                        </p>
                    </div>

                    <div class="card shadow-lg border-success">
                        <div class="card-body p-4">
                            <form id="analysis-form" enctype="multipart/form-data">
                                <div class="upload-area border border-2 border-dashed border-success rounded p-5 text-center mb-4">
                                    <i class="bi bi-cloud-upload display-1 text-success mb-3"></i>
                                    <h4 class="text-success">Drop your image here or click to upload</h4>
                                    <p class="text-muted mb-3">Supports JPG, PNG, GIF (max 5MB)</p>
                                    <input type="file" id="image-input" name="image" accept="image/*" class="d-none">
                                    <button type="button" class="btn btn-success" onclick="document.getElementById('image-input').click()">
                                        Choose File
                                    </button>
                                </div>
                                
                                <div id="image-preview" class="d-none mb-4">
                                    <img id="preview-img" class="img-fluid rounded" style="max-height: 300px;">
                                    <button type="button" class="btn btn-sm btn-outline-danger mt-2" onclick="clearImage()">
                                        <i class="bi bi-trash"></i> Remove
                                    </button>
                                </div>
                                
                                <div class="d-grid">
                                    <button type="submit" class="btn btn-success btn-lg" id="analyze-btn" disabled>
                                        <i class="bi bi-magic me-2"></i>Analyze with Spring AI
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- Analysis Results -->
                    <div id="analysis-results" class="d-none mt-5">
                        <div class="card shadow">
                            <div class="card-header bg-success text-white">
                                <h4 class="mb-0"><i class="bi bi-lightbulb me-2"></i>Spring AI Analysis Results</h4>
                            </div>
                            <div class="card-body">
                                <div id="results-content">
                                    <!-- Results will be populated by JavaScript -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Dashboard Section -->
    <section id="dashboard" class="py-5 bg-light">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="h1 fw-bold text-success">Your Eco Dashboard</h2>
                <p class="lead text-muted">Track your environmental impact and achievements</p>
            </div>

            <div class="row g-4" id="dashboard-content">
                <!-- Dashboard content will be loaded dynamically -->
            </div>
        </div>
    </section>

    <!-- News Section -->
    <section id="news" class="py-5">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="h1 fw-bold text-success">Environmental News & Updates</h2>
                <p class="lead text-muted">Stay informed about the latest in sustainability and environmental protection</p>
            </div>

            <div class="row g-4" id="news-content">
                <!-- News content will be loaded dynamically -->
            </div>
        </div>
    </section>

    <!-- Recycling Centers Section -->
    <section id="recycling" class="py-5 bg-light">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="h1 fw-bold text-success">Location-Based Recycling Centers</h2>
                <p class="lead text-muted">
                    Real-time recycling facilities near you using Google Maps data
                    <br><small class="text-secondary">Allow location access for personalized results</small>
                </p>
            </div>

            <div class="row g-4" id="recycling-content">
                <!-- Recycling centers content will be loaded dynamically -->
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-light py-4">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h5><i class="bi bi-recycle me-2"></i>Eco Guardian</h5>
                    <p class="mb-0">Spring Boot + Spring AI powered waste reduction and sustainability advisor</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <p class="mb-0">&copy; 2025 Eco Guardian. Making the world more sustainable with Spring AI.</p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Loading Modal -->
    <div class="modal fade" id="loadingModal" tabindex="-1" data-bs-backdrop="static">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body text-center p-4">
                    <div class="spinner-border text-success mb-3" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <h5>Analyzing your image with Spring AI...</h5>
                    <p class="text-muted mb-0">Using OpenAI GPT-4o vision model</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Container -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3" id="toast-container"></div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="<c:url value='/js/app.js'/>"></script>
</body>
</html>