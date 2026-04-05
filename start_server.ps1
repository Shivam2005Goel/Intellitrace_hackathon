# Start Invoice Physics Server
$root = $PSScriptRoot
$job = Start-Job -ArgumentList $root -ScriptBlock {
    param($root)
    Set-Location "$root\backend"
    python -m uvicorn main:app --host 0.0.0.0 --port 8000
}
Start-Sleep -Seconds 5
Receive-Job $job
Write-Host "Server started on http://localhost:8000"
