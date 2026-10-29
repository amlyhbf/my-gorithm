#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
mkdir -p .rive-tools
curl -fsSL https://releases.rive.app/cli/install.sh -o .rive-tools/install-official.sh
RIVE_VERSION=1.8.0 RIVE_HOME="$PWD/.rive-tools" bash .rive-tools/install-official.sh
# The installer stores docs beside the version payload; expose them beside its launcher too.
if [ ! -e .rive-tools/bin/docs ]; then
  ln -s ../versions/1.8.0/docs .rive-tools/bin/docs
fi
if ! ldd .rive-tools/bin/rive | grep -q 'libGLESv2.so.2 => /'; then
  mkdir -p .rive-tools/apt/lists/partial .rive-tools/apt/cache/archives/partial .rive-tools/debs .rive-tools/sysroot
  printf 'deb [signed-by=/usr/share/keyrings/debian-archive-keyring.gpg] https://deb.debian.org/debian trixie main\n' > .rive-tools/apt/sources.list
  cat > .rive-tools/apt/config <<EOF
Dir::Etc::parts "-";
Dir::Etc::main "-";
Dir::Etc::sourcelist "$PWD/.rive-tools/apt/sources.list";
Dir::Etc::sourceparts "-";
Dir::State::lists "$PWD/.rive-tools/apt/lists";
Dir::Cache "$PWD/.rive-tools/apt/cache";
APT::Sandbox::User "$(id -un)";
EOF
  export APT_CONFIG="$PWD/.rive-tools/apt/config"
  /usr/bin/apt-get update
  (cd .rive-tools/debs && /usr/bin/apt-get download libgles2 && dpkg-deb -x libgles2_*.deb ../sysroot)
fi
if ! grep -qxF '/.rive-tools/' .git/info/exclude; then
  printf '\n/.rive-tools/\n' >> .git/info/exclude
fi
./tools/rive --version
./tools/rive doctor
