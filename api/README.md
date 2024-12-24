# 2D3D Lottery API Documentation

## Base URL
- Local: `http://localhost/2D3DKobo/api`
- Remote: `https://twod3d-lottery-api.onrender.com`

## Authentication
Bearer token authentication is required for protected endpoints.
```
Authorization: Bearer your-token-here
```

## Endpoints

### Status Check
GET `/`
```json
{
    "status": "success",
    "message": "API is working",
    "server_time": "2024-12-25 04:15:19",
    "php_version": "8.1.31",
    "request_method": "GET",
    "request_uri": "/",
    "db_connected": true
}
```

### 2D Lottery
1. GET `/api/2d/today`
   - Returns today's 2D lottery results
2. GET `/api/2d/latest`
   - Returns the latest 2D result
3. GET `/api/2d/date/{date}`
   - Returns 2D results for a specific date
4. GET `/api/2d/history`
   - Returns historical 2D results

### 3D Lottery
1. GET `/api/3d/today`
   - Returns today's 3D lottery results
2. GET `/api/3d/latest`
   - Returns the latest 3D result
3. GET `/api/3d/date/{date}`
   - Returns 3D results for a specific date
4. GET `/api/3d/history`
   - Returns historical 3D results

### Protected Endpoints
These endpoints require authentication:

1. POST `/api/2d/update`
   - Update 2D lottery results
2. POST `/api/3d/update`
   - Update 3D lottery results

## Response Format
All responses follow this structure:
```json
{
    "status": "success|error",
    "message": "Response message",
    "data": {
        // Response data here
    },
    "timestamp": "ISO 8601 timestamp"
}
```

## Error Codes
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error
