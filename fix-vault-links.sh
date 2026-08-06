#!/usr/bin/env bash
# 修复 Obsidian vault 中与 content/ 相同的链接问题（沙盒无法直接写入 vault，需手动执行一次）
# 用法: bash fix-vault-links.sh
set -euo pipefail

VAULT_PUBLIC="${1:-/Users/bobcgn/Markdown-Notes/Public}"

fix() {
  local file="$1"
  [[ -f "$file" ]] || { echo "跳过(不存在): $file"; return; }
  # 空链接 [url]() -> 完整外部链接 [url](url)
  sed -i '' \
    -e 's|\[http://localhost:8858\]()|[http://localhost:8858](http://localhost:8858)|g' \
    -e 's|\[http://localhost:8500\]()|[http://localhost:8500](http://localhost:8500)|g' \
    -e 's|\[http://127.0.0.1:9411\]()|[http://127.0.0.1:9411](http://127.0.0.1:9411)|g' \
    "$file"
  echo "已修复: $file"
}

fix "$VAULT_PUBLIC/开发学习/后端开发/工具/Docker/Docker.md"
fix "$VAULT_PUBLIC/开发学习/后端开发/框架/Spring/Spring.md"
echo "完成。随后运行 vault 目录下的 publish.sh 重新同步即可。"
