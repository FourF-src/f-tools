token=7d3b21397c5df9aae2915cc1d1e6d07b8f073794
repo=FourF-src/f-tools

upload_url=$(curl -s -H "Authorization: token $token"  \
     -d '{"tag_name": "test", "name":"release-0.0.1","body":"this is a test release"}'  \
     "https://api.github.com/repos/$repo/releases" )

upload_url="${upload_url%\{*}"

echo "uploading asset to release to url : $upload_url"

curl -s -H "Authorization: token $token"  \
        -H "Content-Type: text/html" \
        --data-binary ../dist/index.html  \
        "$upload_url?name=index.html&label=test-index.html"
