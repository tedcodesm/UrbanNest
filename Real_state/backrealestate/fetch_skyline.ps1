$p = Invoke-RestMethod -Uri http://192.168.100.10:5000/api/property -Method Get
$s = $p | Where-Object { $_.title -like "*Skyline*" }
if ($s) {
    if ($s.images) {
        $s.images | Write-Output
    } else {
        Write-Output "No images for this property"
    }
} else {
    Write-Output "Property not found"
}
