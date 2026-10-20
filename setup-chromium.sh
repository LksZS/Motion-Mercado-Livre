#!/bin/bash
set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$DIR/bin"
node -e 'import("@sparticuz/chromium").then(async m => {
  const p = await m.default.executablePath();
  const fs = await import("fs");
  fs.copyFileSync(p, "bin/chromium-bin");
  fs.chmodSync("bin/chromium-bin", 0o755);
  console.log("Chromium bin extracted");
})'
