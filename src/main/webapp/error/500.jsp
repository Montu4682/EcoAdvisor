<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Internal Server Error - Eco Guardian</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="<c:url value='/css/styles.css'/>">
</head>
<body>
    <div class="container-fluid vh-100 d-flex align-items-center justify-content-center">
        <div class="text-center">
            <i class="bi bi-exclamation-circle display-1 text-danger mb-4"></i>
            <h1 class="display-4 fw-bold text-success mb-4">500 - Internal Server Error</h1>
            <p class="lead text-muted mb-4">
                Something went wrong on our end. We're working to fix this issue.
                Please try again later or contact support if the problem persists.
            </p>
            <div class="d-flex gap-3 justify-content-center">
                <a href="<c:url value='/'/>" class="btn btn-success btn-lg">
                    <i class="bi bi-house me-2"></i>Go Home
                </a>
                <a href="javascript:location.reload()" class="btn btn-outline-success btn-lg">
                    <i class="bi bi-arrow-clockwise me-2"></i>Try Again
                </a>
            </div>
        </div>
    </div>
</body>
</html>