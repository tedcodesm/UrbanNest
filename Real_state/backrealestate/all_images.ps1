$p = Invoke-RestMethod -Uri http://192.168.100.10:5000/api/property -Method Get
foreach ($prop in $p) {
    "Property: $($prop.title)" | Out-File -FilePath images.txt -Append
    if ($prop.images) {
        foreach ($img in $prop.images) {
            "  Image: $img" | Out-File -FilePath images.txt -Append
        }
    } else {
        "  No images" | Out-File -FilePath images.txt -Append
    }
}
