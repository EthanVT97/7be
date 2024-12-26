# Create directories if they don't exist
New-Item -ItemType Directory -Force -Path "public/assets/css"
New-Item -ItemType Directory -Force -Path "public/assets/js"

# Download Bootstrap CSS
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" -OutFile "public/assets/css/bootstrap.min.css"

# Download Bootstrap JS
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" -OutFile "public/assets/js/bootstrap.bundle.min.js"

Write-Host "Bootstrap files downloaded successfully!" 