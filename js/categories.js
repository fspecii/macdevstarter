const APP_CATEGORIES = {
    development: {
        title: "Development Tools",
        description: "Essential tools for software development",
        items: [
            { id: "vscode", name: "Visual Studio Code", type: "cask", package: "visual-studio-code", description: "Popular code editor by Microsoft" },
            { id: "docker", name: "Docker", type: "cask", package: "docker", description: "Containerization platform" },
            { id: "postman", name: "Postman", type: "cask", package: "postman", description: "API development environment" },
            { id: "github", name: "GitHub Desktop", type: "cask", package: "github", description: "GitHub desktop client" },
            { id: "sourcetree", name: "SourceTree", type: "cask", package: "sourcetree", description: "Git client by Atlassian" },
            { id: "jetbrains-toolbox", name: "JetBrains Toolbox", type: "cask", package: "jetbrains-toolbox", description: "JetBrains IDE manager" },
            { id: "android-studio", name: "Android Studio", type: "cask", package: "android-studio", description: "Android development IDE" },
            { id: "iterm2", name: "iTerm2", type: "cask", package: "iterm2", description: "Enhanced terminal emulator" },
            { id: "ngrok", name: "ngrok", type: "brew", package: "ngrok", description: "Secure tunneling service" },
            { id: "sublime-text", name: "Sublime Text", type: "cask", package: "sublime-text", description: "Sophisticated text editor" }
        ]
    },

    databases: {
        title: "Database Tools",
        description: "Database management and development tools",
        items: [
            { id: "mysql", name: "MySQL", type: "brew", package: "mysql", description: "Popular SQL database" },
            { id: "postgresql", name: "PostgreSQL", type: "brew", package: "postgresql", description: "Advanced SQL database" },
            { id: "mongodb", name: "MongoDB", type: "brew", package: "mongodb-community", description: "NoSQL database" },
            { id: "redis", name: "Redis", type: "brew", package: "redis", description: "In-memory data store" },
            { id: "mongodb-compass", name: "MongoDB Compass", type: "cask", package: "mongodb-compass", description: "MongoDB GUI" },
            { id: "tableplus", name: "TablePlus", type: "cask", package: "tableplus", description: "Modern database management" },
            { id: "dbeaver", name: "DBeaver", type: "cask", package: "dbeaver-community", description: "Universal database tool" }
        ]
    },

    cloud: {
        title: "Cloud & DevOps Tools",
        description: "Tools for cloud development and DevOps",
        items: [
            { id: "aws-cli", name: "AWS CLI", type: "brew", package: "awscli", description: "Amazon Web Services CLI" },
            { id: "azure-cli", name: "Azure CLI", type: "brew", package: "azure-cli", description: "Microsoft Azure CLI" },
            { id: "google-cloud-sdk", name: "Google Cloud SDK", type: "cask", package: "google-cloud-sdk", description: "Google Cloud Platform SDK" },
            { id: "terraform", name: "Terraform", type: "brew", package: "terraform", description: "Infrastructure as Code tool" },
            { id: "kubectl", name: "kubectl", type: "brew", package: "kubernetes-cli", description: "Kubernetes CLI" },
            { id: "minikube", name: "Minikube", type: "brew", package: "minikube", description: "Local Kubernetes" },
            { id: "helm", name: "Helm", type: "brew", package: "helm", description: "Kubernetes package manager" }
        ]
    },

    programming: {
        title: "Programming Languages",
        description: "Programming languages and their tools",
        items: [
            { id: "python", name: "Python 3", type: "brew", package: "python@3.11", description: "Python programming language" },
            { id: "node", name: "Node.js", type: "brew", package: "node", description: "JavaScript runtime" },
            { id: "go", name: "Go", type: "brew", package: "go", description: "Go programming language" },
            { id: "rust", name: "Rust", type: "brew", package: "rust", description: "Rust programming language" },
            { id: "java", name: "Java", type: "brew", package: "openjdk", description: "Java Development Kit" },
            { id: "kotlin", name: "Kotlin", type: "brew", package: "kotlin", description: "Kotlin programming language" },
            { id: "swift", name: "Swift", type: "brew", package: "swift", description: "Swift programming language" },
            { id: "ruby", name: "Ruby", type: "brew", package: "ruby", description: "Ruby programming language" },
            { id: "php", name: "PHP", type: "brew", package: "php", description: "PHP programming language" }
        ]
    },

    productivity: {
        title: "Productivity Tools",
        description: "Tools to enhance your productivity",
        items: [
            { id: "raycast", name: "Raycast", type: "cask", package: "raycast", description: "Productivity launcher" },
            { id: "rectangle", name: "Rectangle", type: "cask", package: "rectangle", description: "Window management" },
            { id: "alfred", name: "Alfred", type: "cask", package: "alfred", description: "Productivity app" },
            { id: "notion", name: "Notion", type: "cask", package: "notion", description: "All-in-one workspace" },
            { id: "obsidian", name: "Obsidian", type: "cask", package: "obsidian", description: "Knowledge base" },
            { id: "bartender", name: "Bartender", type: "cask", package: "bartender", description: "Menu bar organizer" },
            { id: "cleanshot", name: "CleanShot X", type: "cask", package: "cleanshot", description: "Screenshot tool" }
        ]
    },

    communication: {
        title: "Communication",
        description: "Communication and collaboration tools",
        items: [
            { id: "slack", name: "Slack", type: "cask", package: "slack", description: "Team communication" },
            { id: "discord", name: "Discord", type: "cask", package: "discord", description: "Voice and text chat" },
            { id: "zoom", name: "Zoom", type: "cask", package: "zoom", description: "Video conferencing" },
            { id: "microsoft-teams", name: "Microsoft Teams", type: "cask", package: "microsoft-teams", description: "Team collaboration" }
        ]
    },

    browsers: {
        title: "Web Browsers",
        description: "Web browsers for development and testing",
        items: [
            { id: "chrome", name: "Google Chrome", type: "cask", package: "google-chrome", description: "Popular web browser" },
            { id: "firefox", name: "Firefox", type: "cask", package: "firefox", description: "Mozilla web browser" },
            { id: "brave", name: "Brave", type: "cask", package: "brave-browser", description: "Privacy-focused browser" },
            { id: "microsoft-edge", name: "Microsoft Edge", type: "cask", package: "microsoft-edge", description: "Chromium-based Edge" }
        ]
    },

    cli: {
        title: "CLI Tools",
        description: "Command-line tools and utilities",
        items: [
            { id: "git", name: "Git", type: "brew", package: "git", description: "Version control" },
            { id: "gh", name: "GitHub CLI", type: "brew", package: "gh", description: "GitHub command-line" },
            { id: "wget", name: "wget", type: "brew", package: "wget", description: "File downloader" },
            { id: "curl", name: "curl", type: "brew", package: "curl", description: "Data transfer tool" },
            { id: "htop", name: "htop", type: "brew", package: "htop", description: "Process viewer" },
            { id: "tmux", name: "tmux", type: "brew", package: "tmux", description: "Terminal multiplexer" },
            { id: "neovim", name: "Neovim", type: "brew", package: "neovim", description: "Modern vim editor" },
            { id: "exa", name: "exa", type: "brew", package: "exa", description: "Modern ls replacement" },
            { id: "bat", name: "bat", type: "brew", package: "bat", description: "Modern cat replacement" },
            { id: "ripgrep", name: "ripgrep", type: "brew", package: "ripgrep", description: "Fast search tool" },
            { id: "fzf", name: "fzf", type: "brew", package: "fzf", description: "Fuzzy finder" },
            { id: "jq", name: "jq", type: "brew", package: "jq", description: "JSON processor" }
        ]
    },

    media: {
        title: "Media Tools",
        description: "Media creation and editing tools",
        items: [
            { id: "vlc", name: "VLC", type: "cask", package: "vlc", description: "Media player" },
            { id: "obs", name: "OBS Studio", type: "cask", package: "obs", description: "Streaming software" },
            { id: "handbrake", name: "HandBrake", type: "cask", package: "handbrake", description: "Video transcoder" },
            { id: "imageoptim", name: "ImageOptim", type: "cask", package: "imageoptim", description: "Image optimizer" },
            { id: "figma", name: "Figma", type: "cask", package: "figma", description: "Design tool" }
        ]
    }
};

export default APP_CATEGORIES; 