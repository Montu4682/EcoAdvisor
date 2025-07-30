<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Not Found - Eco Guardian</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="<c:url value='/css/styles.css'/>">
</head>
<body>
    <div class="container-fluid vh-100 d-flex align-items-center justify-content-center">
        <div class="text-center">
            <i class="bi bi-exclamation-triangle display-1 text-warning mb-4"></i>
            <h1 class="display-4 fw-bold text-success mb-4">404 - Page Not Found</h1>
            <p class="lead text-muted mb-4">
                Oops! The page you're looking for doesn't exist. 
                Maybe it was moved, deleted, or you entered the wrong URL.
            </p>
            <div class="d-flex gap-3 justify-content-center">
                <a href="<c:url value='/'/>" class="btn btn-success btn-lg">
                    <i class="bi bi-house me-2"></i>Go Home
                </a>
                <a href="javascript:history.back()" class="btn btn-outline-success btn-lg">
                    <i class="bi bi-arrow-left me-2"></i>Go Back
                </a>
            </div>
        </div>
    </div>
</body>
</html>