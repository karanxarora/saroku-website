#!/bin/sh
# Break Saroku — installer.
#
#   curl -fsSL https://saroku.com/install-challenge.sh | sh
#
# Fetches the challenge harness (agent simulation, CLI, lifecycle client)
# from its public repo — this does NOT include the actual Challenge Set
# scenario content, which the CLI fetches live from saroku.com on each run
# (requires a completed check-in first) rather than bundling it, so the
# scenarios can't be read by browsing the repo.

set -eu

INSTALL_DIR="${SAROKU_CHALLENGE_DIR:-$HOME/.saroku-challenge/app}"
REPO_URL="${SAROKU_CHALLENGE_REPO_URL:-https://github.com/Karanxa/saroku-challenge.git}"

echo "Break Saroku — installer"
echo "========================="

# Best-effort funnel-visibility ping — never blocks the install if it fails.
curl -fsSL -m 5 -X POST https://saroku.com/api/challenge/install-ping >/dev/null 2>&1 || true

# 1. Check Python 3.10+
PYTHON_BIN=""
for candidate in python3.12 python3.11 python3.10 python3; do
  if command -v "$candidate" >/dev/null 2>&1; then
    version="$("$candidate" -c 'import sys; print(f"{sys.version_info[0]}.{sys.version_info[1]}")' 2>/dev/null || echo "0.0")"
    major="$(echo "$version" | cut -d. -f1)"
    minor="$(echo "$version" | cut -d. -f2)"
    if [ "$major" -eq 3 ] && [ "$minor" -ge 10 ]; then
      PYTHON_BIN="$candidate"
      break
    fi
  fi
done

if [ -z "$PYTHON_BIN" ]; then
  echo "Error: Python 3.10+ is required. Install it and re-run this script." >&2
  exit 1
fi
echo "Using $($PYTHON_BIN --version)"

# 2. Fetch the harness.
if [ -d "$INSTALL_DIR/.git" ]; then
  echo "Updating existing install at $INSTALL_DIR ..."
  git -C "$INSTALL_DIR" pull --ff-only
else
  echo "Cloning challenge harness to $INSTALL_DIR ..."
  mkdir -p "$(dirname "$INSTALL_DIR")"
  git clone --depth 1 "$REPO_URL" "$INSTALL_DIR"
fi

# 3. Set up a virtualenv and install deps (requests + saroku itself).
cd "$INSTALL_DIR"
"$PYTHON_BIN" -m venv .venv
. .venv/bin/activate
pip install --upgrade pip >/dev/null
pip install -r requirements.txt
pip install saroku

echo ""
echo "Installed. Configure an LLM provider API key (e.g. export OPENAI_API_KEY=...),"
echo "then run:"
echo ""
echo "  cd $INSTALL_DIR && . .venv/bin/activate && python -m challenge.cli"
echo ""
echo "First run checks in with saroku.com automatically, then fetches the"
echo "current Challenge Set."
