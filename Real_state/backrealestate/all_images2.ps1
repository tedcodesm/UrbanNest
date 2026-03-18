$p = Invoke-RestMethod -Uri http://192.168.100.10:5000/api/property -Method Get
foreach ($prop in $p) {
    "Property: $($prop.title)" | Out-File -FilePath images2.txt -Append -Encoding utf8
    if ($prop.images) {
        foreach ($img in $prop.images) {
            "  Image: $img" | Out-File -FilePath images2.txt -Append -Encoding utf8
        }
    } else {
        "  No images" | Out-File -FilePath images2.txt -Append -Encoding utf8
    }
}
