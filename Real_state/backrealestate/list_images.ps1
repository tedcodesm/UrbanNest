$p = Invoke-RestMethod -Uri http://192.168.100.10:5000/api/property -Method Get
foreach ($prop in $p) {
    Write-Output "Property: $($prop.title)"
    if ($prop.images) {
        $prop.images | ForEach-Object { Write-Output "  Image: $_" }
    } else {
        Write-Output "  No images"
    }
}
