FROM node:18-bullseye

# Create a group and user to run the application
RUN groupadd -r vscode && useradd -r -g vscode vscode

# Set the working directory to /workspaces
WORKDIR /workspaces

# Create the /workspaces directory and change the owner to vscode
RUN mkdir -p /workspaces && chown -R vscode:vscode /workspaces

# Switch to the vscode user
USER vscode

# Change the permission of the working directory to 775 to allow group write access
RUN chmod 775 /workspaces
