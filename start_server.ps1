# Start Invoice Physics Server
$job = Start-Job {
    Set-Location "d:\Invoice_Intellitrace\backend"
    python -m uvicorn main:app --host 0.0.0.0 --port 8000
}
Start-Sleep -Seconds 5
Receive-Job $job
Write-Host "Server started on http://0.0.0.0:8000"
