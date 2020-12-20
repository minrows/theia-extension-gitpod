FROM gitpod/workspace-full

# Install custom tools, runtime, etc.
RUN sudo apt-get update \
    && sudo apt-get install -y \
    build-essential libx11-dev libxkbfile-dev
    && sudo rm -rf /var/lib/apt/lists/*