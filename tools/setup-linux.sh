#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f /etc/os-release ]] || ! . /etc/os-release || [[ "${ID:-}" != "ubuntu" ]]; then
  echo "This setup script supports Ubuntu only." >&2
  exit 1
fi

if [[ "${EUID}" -eq 0 ]]; then
  SUDO=()
else
  if ! command -v sudo >/dev/null 2>&1; then
    echo "Install sudo or run this script as root." >&2
    exit 1
  fi
  SUDO=(sudo)
fi

"${SUDO[@]}" apt-get update
"${SUDO[@]}" apt-get install -y ca-certificates curl gnupg git docker.io docker-compose-v2

"${SUDO[@]}" install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key |
  "${SUDO[@]}" gpg --dearmor --yes -o /etc/apt/keyrings/nodesource.gpg
"${SUDO[@]}" chmod a+r /etc/apt/keyrings/nodesource.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" |
  "${SUDO[@]}" tee /etc/apt/sources.list.d/nodesource.list >/dev/null
"${SUDO[@]}" apt-get update
"${SUDO[@]}" apt-get install -y nodejs

if [[ -n "${SUDO_USER:-}" && "${SUDO_USER}" != "root" ]]; then
  "${SUDO[@]}" usermod -aG docker "${SUDO_USER}"
fi

if command -v systemctl >/dev/null 2>&1 && [[ -d /run/systemd/system ]]; then
  "${SUDO[@]}" systemctl enable --now docker
else
  echo "Docker is installed; start the Docker daemon using your host's service manager."
fi

node --version
npm --version
git --version
echo "Setup complete. Re-login if your account was added to the docker group."
