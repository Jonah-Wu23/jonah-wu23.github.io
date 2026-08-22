# -*- coding: utf-8 -*-
import sys
import urllib.request
import ssl
from pathlib import Path

links_file = Path(__file__).resolve().parent.parent / "links.txt"
if not links_file.exists():
    print(f"Links file not found: {links_file}")
    sys.exit(1)

urls = [line.strip() for line in links_file.read_text(encoding="utf-8").splitlines() if line.strip()]

print(f"Loaded {len(urls)} links to test from {links_file.name}:")
print("-" * 60)

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

results = []
for url in urls:
    if url.startswith("mailto:"):
        print(f"PASS [MAIL]  {url}")
        results.append((url, "MAILTO", True))
        continue

    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    )
    try:
        with urllib.request.urlopen(req, timeout=10, context=ctx) as response:
            code = response.getcode()
            print(f"PASS [{code}]  {url}")
            results.append((url, str(code), True))
    except Exception as e:
        print(f"FAIL [ERR]   {url} -> {e}")
        results.append((url, str(e), False))

print("-" * 60)
passed = sum(1 for _, _, ok in results if ok)
total = len(results)
print(f"Summary: {passed}/{total} passed.")