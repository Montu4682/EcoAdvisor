// Eco Guardian JavaScript Application

class EcoGuardianApp {
    constructor() {
        this.baseURL = window.location.origin;
        this.currentUser = null;
        this.init();
    }

    async init() {
        console.log('Initializing Eco Guardian App...');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load initial data
        await this.loadUserData();
        await this.loadDashboard();
        await this.loadNews();
        await this.loadRecyclingCenters();
        
        // Setup smooth scrolling
        this.setupSmoothScrolling();
        
        console.log('Eco Guardian App initialized successfully');
    }

    setupEventListeners() {
        // Image upload handling
        const imageInput = document.getElementById('image-input');
        const uploadArea = document.querySelector('.upload-area');
        const analysisForm = document.getElementById('analysis-form');

        if (imageInput) {
            imageInput.addEventListener('change', (e) => this.handleImageSelect(e));
        }

        if (uploadArea) {
            // Drag and drop functionality
            uploadArea.addEventListener('click', () => imageInput?.click());
            uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        }

        if (analysisForm) {
            analysisForm.addEventListener('submit', (e) => this.handleAnalysisSubmit(e));
        }

        // Navigation smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleSmoothScroll(e));
        });
    }

    async loadUserData() {
        try {
            const response = await fetch(`${this.baseURL}/api/user`);
            if (response.ok) {
                this.currentUser = await response.json();
                this.updateUserDisplay();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            this.showToast('Failed to load user data', 'error');
        }
    }

    updateUserDisplay() {
        if (!this.currentUser) return;

        // Update navbar
        const pointsElement = document.getElementById('user-points');
        const levelElement = document.getElementById('user-level');
        
        if (pointsElement) pointsElement.textContent = this.currentUser.ecoPoints;
        if (levelElement) levelElement.textContent = this.currentUser.level;

        // Update hero stats
        document.getElementById('total-co2-saved').textContent = this.currentUser.totalCO2Saved;
        document.getElementById('total-points').textContent = this.currentUser.ecoPoints;
        document.getElementById('total-achievements').textContent = this.currentUser.achievements.length;
    }

    async loadDashboard() {
        try {
            const [userResponse, actionsResponse] = await Promise.all([
                fetch(`${this.baseURL}/api/user`),
                fetch(`${this.baseURL}/api/actions`)
            ]);

            if (userResponse.ok && actionsResponse.ok) {
                const user = await userResponse.json();
                const actions = await actionsResponse.json();
                this.renderDashboard(user, actions);
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
            this.showToast('Failed to load dashboard', 'error');
        }
    }

    renderDashboard(user, actions) {
        const dashboardContent = document.getElementById('dashboard-content');
        if (!dashboardContent) return;

        const progressPercentage = user.monthlyProgressPercentage || 0;
        
        dashboardContent.innerHTML = `
            <div class="col-lg-4 col-md-6">
                <div class="card h-100 level-card">
                    <div class="card-body text-center">
                        <i class="bi bi-award display-4 mb-3"></i>
                        <h3 class="card-title">${user.level}</h3>
                        <p class="card-text">${user.ecoPoints} EcoPoints</p>
                        <div class="progress mt-3" style="height: 10px;">
                            <div class="progress-bar bg-warning" style="width: ${Math.min(100, (user.ecoPoints % 500) / 5)}%"></div>
                        </div>
                        <small class="text-light mt-2 d-block">Progress to next level</small>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-4 col-md-6">
                <div class="card h-100">
                    <div class="card-header bg-success text-white">
                        <h5 class="mb-0"><i class="bi bi-graph-up me-2"></i>Monthly Progress</h5>
                    </div>
                    <div class="card-body">
                        <div class="text-center mb-3">
                            <h2 class="text-success">${user.monthlyProgress}kg</h2>
                            <p class="text-muted">CO2 Saved This Month</p>
                        </div>
                        <div class="progress mb-3" style="height: 12px;">
                            <div class="progress-bar bg-success" style="width: ${progressPercentage}%"></div>
                        </div>
                        <small class="text-muted">Goal: ${user.monthlyGoal}kg CO2</small>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-4 col-md-6">
                <div class="card h-100">
                    <div class="card-header bg-warning text-dark">
                        <h5 class="mb-0"><i class="bi bi-trophy me-2"></i>Achievements</h5>
                    </div>
                    <div class="card-body">
                        ${user.achievements.length > 0 ? 
                            user.achievements.map(achievement => 
                                `<span class="badge bg-success me-2 mb-2">${achievement}</span>`
                            ).join('') :
                            '<p class="text-muted">No achievements yet. Start analyzing items to earn your first achievement!</p>'
                        }
                    </div>
                </div>
            </div>
            
            <div class="col-12">
                <div class="card">
                    <div class="card-header bg-info text-white">
                        <h5 class="mb-0"><i class="bi bi-clock-history me-2"></i>Recent Actions</h5>
                    </div>
                    <div class="card-body">
                        ${actions.length > 0 ? 
                            actions.slice(0, 5).map(action => `
                                <div class="d-flex justify-content-between align-items-center border-bottom py-2">
                                    <div>
                                        <strong>${action.itemName}</strong>
                                        <br><small class="text-muted">Alternative: ${action.alternativeChosen}</small>
                                    </div>
                                    <div class="text-end">
                                        <span class="badge bg-success">+${action.pointsEarned} points</span>
                                        <br><small class="text-muted">${action.co2Saved}kg CO2</small>
                                    </div>
                                </div>
                            `).join('') :
                            '<p class="text-muted">No actions yet. Upload an image to get started!</p>'
                        }
                    </div>
                </div>
            </div>
        `;
    }

    async loadNews() {
        try {
            const response = await fetch(`${this.baseURL}/api/news`);
            if (response.ok) {
                const news = await response.json();
                this.renderNews(news);
            }
        } catch (error) {
            console.error('Error loading news:', error);
            this.showToast('Failed to load news', 'error');
        }
    }

    renderNews(newsItems) {
        const newsContent = document.getElementById('news-content');
        if (!newsContent) return;

        newsContent.innerHTML = newsItems.map(item => `
            <div class="col-lg-6">
                <div class="card h-100 news-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="news-category">${item.category}</span>
                            <small class="text-muted">${item.formattedDate}</small>
                        </div>
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">${item.summary}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">Source: ${item.source}</small>
                            <a href="${item.url}" class="btn btn-outline-success btn-sm">Read More</a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async loadRecyclingCenters() {
        try {
            const response = await fetch(`${this.baseURL}/api/recycling-centers`);
            if (response.ok) {
                const centers = await response.json();
                this.renderRecyclingCenters(centers);
            }
        } catch (error) {
            console.error('Error loading recycling centers:', error);
            this.showToast('Failed to load recycling centers', 'error');
        }
    }

    renderRecyclingCenters(centers) {
        const recyclingContent = document.getElementById('recycling-content');
        if (!recyclingContent) return;

        recyclingContent.innerHTML = centers.map(center => `
            <div class="col-lg-4 col-md-6">
                <div class="card h-100 recycling-card">
                    <div class="card-body">
                        <h5 class="card-title text-success">${center.name}</h5>
                        <p class="card-text">
                            <i class="bi bi-geo-alt me-2"></i>${center.address}
                            <br><i class="bi bi-telephone me-2"></i>${center.phone}
                            <br><i class="bi bi-clock me-2"></i>${center.hours}
                        </p>
                        <div class="mb-3">
                            <strong>Accepted Materials:</strong>
                            <br>${center.acceptedMaterials.map(material => 
                                `<span class="badge bg-secondary me-1 mb-1">${material}</span>`
                            ).join('')}
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="rating-stars">
                                ${Array.from({length: 5}, (_, i) => 
                                    `<i class="bi bi-star${i < Math.floor(center.rating) ? '-fill' : ''}"></i>`
                                ).join('')}
                                <span class="ms-1">${center.rating}</span>
                            </div>
                            <small class="text-muted">${center.formattedDistance}</small>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    handleImageSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.validateAndPreviewImage(file);
        }
    }

    validateAndPreviewImage(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showToast('Please select a valid image file', 'error');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            this.showToast('Image size must be less than 5MB', 'error');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewContainer = document.getElementById('image-preview');
            const previewImg = document.getElementById('preview-img');
            const analyzeBtn = document.getElementById('analyze-btn');

            if (previewImg) previewImg.src = e.target.result;
            if (previewContainer) previewContainer.classList.remove('d-none');
            if (analyzeBtn) analyzeBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }

    clearImage() {
        const imageInput = document.getElementById('image-input');
        const previewContainer = document.getElementById('image-preview');
        const analyzeBtn = document.getElementById('analyze-btn');
        const resultsContainer = document.getElementById('analysis-results');

        if (imageInput) imageInput.value = '';
        if (previewContainer) previewContainer.classList.add('d-none');
        if (analyzeBtn) analyzeBtn.disabled = true;
        if (resultsContainer) resultsContainer.classList.add('d-none');
    }

    async handleAnalysisSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
        
        try {
            loadingModal.show();
            
            const response = await fetch(`${this.baseURL}/api/analyze`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                this.displayAnalysisResults(result);
                await this.loadUserData(); // Refresh user data
                await this.loadDashboard(); // Refresh dashboard
                this.showToast(`Analysis complete! Identified: ${result.analysis.analysis.itemName}`, 'success');
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Analysis failed');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            this.showToast(error.message || 'Failed to analyze image. Please try again.', 'error');
        } finally {
            loadingModal.hide();
        }
    }

    displayAnalysisResults(result) {
        const resultsContainer = document.getElementById('analysis-results');
        const resultsContent = document.getElementById('results-content');
        
        if (!resultsContainer || !resultsContent) return;

        const analysis = result.analysis.analysis;
        const alternatives = result.analysis.alternatives;

        resultsContent.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <img src="${result.item.image}" class="img-fluid rounded mb-3" alt="Analyzed item">
                </div>
                <div class="col-md-6">
                    <div class="analysis-confidence">
                        <h5 class="text-success">${analysis.itemName}</h5>
                        <p class="text-muted mb-2">${analysis.itemType}</p>
                        <div class="confidence-bar-container">
                            <small class="text-muted">Confidence: ${Math.round(analysis.confidence * 100)}%</small>
                            <div class="bg-light rounded" style="height: 8px;">
                                <div class="confidence-bar" style="width: ${analysis.confidence * 100}%"></div>
                            </div>
                        </div>
                    </div>
                    <p><strong>Environmental Impact:</strong> ${analysis.environmentalImpact}</p>
                    <p><strong>Waste Category:</strong> 
                        <span class="badge bg-secondary">${analysis.wasteCategory}</span>
                    </p>
                </div>
            </div>
            
            <hr class="my-4">
            
            <h5 class="text-success mb-3">Eco-Friendly Alternatives</h5>
            <div class="row">
                ${alternatives.map(alt => `
                    <div class="col-md-12 mb-3">
                        <div class="alternative-card">
                            <h6 class="text-success">${alt.name}</h6>
                            <p class="mb-2">${alt.description}</p>
                            <p class="mb-2"><strong>Availability:</strong> ${alt.availability}</p>
                            <div>
                                <span class="co2-savings">
                                    <i class="bi bi-leaf me-1"></i>${alt.co2Savings}kg CO2 Saved
                                </span>
                                <span class="points-value">
                                    <i class="bi bi-star me-1"></i>+${alt.pointsValue} EcoPoints
                                </span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="alert alert-success mt-3">
                <i class="bi bi-check-circle me-2"></i>
                <strong>Great job!</strong> You've earned <strong>${result.analysis.recommendedPoints} EcoPoints</strong> 
                and saved <strong>${result.analysis.totalCO2Savings}kg of CO2</strong> by analyzing this item!
            </div>
        `;

        resultsContainer.classList.remove('d-none');
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    handleDragOver(event) {
        event.preventDefault();
        event.currentTarget.classList.add('dragover');
    }

    handleDragLeave(event) {
        event.currentTarget.classList.remove('dragover');
    }

    handleDrop(event) {
        event.preventDefault();
        event.currentTarget.classList.remove('dragover');
        
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const imageInput = document.getElementById('image-input');
            if (imageInput) {
                imageInput.files = files;
                this.validateAndPreviewImage(files[0]);
            }
        }
    }

    handleSmoothScroll(event) {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    setupSmoothScrolling() {
        // Add active class to navigation items based on scroll position
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-80px 0px -80px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        if (link.getAttribute('href') === `#${entry.target.id}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toastId = `toast-${Date.now()}`;
        const toastHTML = `
            <div id="${toastId}" class="toast toast-${type}" role="alert">
                <div class="toast-body">
                    <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
                    ${message}
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, { delay: 5000 });
        toast.show();

        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }
}

// Global function to clear image (called from JSP)
function clearImage() {
    if (window.ecoApp) {
        window.ecoApp.clearImage();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ecoApp = new EcoGuardianApp();
});