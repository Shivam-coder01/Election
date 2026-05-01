Write-Host "=========================================="
Write-Host "  Election Guide - Cloud Run Deployment   "
Write-Host "=========================================="

# 1. Check if gcloud is installed
$gcloudInstalled = Get-Command gcloud -ErrorAction SilentlyContinue

if (-not $gcloudInstalled) {
    Write-Host "`n[1/4] Google Cloud SDK not found. Downloading the installer..." -ForegroundColor Yellow
    $installerPath = "$env:TEMP\GoogleCloudSDKInstaller.exe"
    (New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", $installerPath)
    
    Write-Host "Running the installer. Please follow the prompts to install the SDK..." -ForegroundColor Cyan
    Start-Process -FilePath $installerPath -Wait
    
    Write-Host "`nIMPORTANT: You must restart your PowerShell terminal for the 'gcloud' command to be available!" -ForegroundColor Red
    Write-Host "After restarting, run this script again." -ForegroundColor Red
    exit
}

Write-Host "`n[1/4] Google Cloud SDK is installed!" -ForegroundColor Green

# 2. Authenticate
Write-Host "`n[2/4] Authenticating with Google Cloud..." -ForegroundColor Yellow
Write-Host "A browser window will open. Please log in with your Google account." -ForegroundColor Cyan
gcloud auth login

# 3. Set Project
$PROJECT_ID = "election-495017"
Write-Host "`n[3/4] Setting project to $PROJECT_ID..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID

# 4. Deploy to Cloud Run
Write-Host "`n[4/4] Deploying to Cloud Run. This will take a few minutes..." -ForegroundColor Yellow
gcloud run deploy election-guide `
    --source . `
    --region us-central1 `
    --allow-unauthenticated `
    --port 8080

Write-Host "`n=========================================="
Write-Host "  Deployment Complete! " -ForegroundColor Green
Write-Host "=========================================="
