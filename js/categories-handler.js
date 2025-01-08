export default class CategoriesHandler {
    constructor() {
        this.categories = [];
        this.selectedTools = new Set();
        this.container = document.getElementById('categoriesContainer');
    }

    async loadCategories() {
        try {
            const response = await fetch('/js/apps.json');
            const data = await response.json();
            this.categories = data.categories;
            this.renderCategories();
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    renderCategories() {
        // Clear existing categories
        this.container.innerHTML = '';

        // Render dynamic categories
        this.categories.forEach(category => {
            const categoryElement = this.createCategoryElement(category);
            this.container.appendChild(categoryElement);
        });

        // Add System Preferences category
        const systemPrefs = this.createSystemPreferencesCategory();
        this.container.appendChild(systemPrefs);
    }

    createCategoryElement(category) {
        const div = document.createElement('div');
        div.className = 'category';
        
        div.innerHTML = `
            <h3>
                <i class="${category.icon}"></i>
                ${category.name}
                <span class="selected-count">0 selected</span>
            </h3>
            <div class="tools">
                ${category.tools.map(tool => this.createToolElement(tool)).join('')}
            </div>
        `;

        // Add event listeners for checkboxes
        div.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.handleToolSelection(e, category));
        });

        return div;
    }

    createToolElement(tool) {
        return `
            <div class="tool">
                <input type="checkbox" id="${tool.id}" data-command="${tool.command}">
                <label for="${tool.id}">
                    <span class="tool-name">${tool.name}</span>
                    <span class="tool-description">${tool.description}</span>
                </label>
            </div>
        `;
    }

    createSystemPreferencesCategory() {
        const div = document.createElement('div');
        div.className = 'category system-prefs';
        
        div.innerHTML = `
            <h3>
                <i class="fas fa-cog"></i>
                System Preferences
                <span class="selected-count">0 selected</span>
            </h3>
            <div class="tools">
                <div class="tool">
                    <input type="checkbox" id="show-hidden-files">
                    <label for="show-hidden-files">
                        <span class="tool-name">Show Hidden Files</span>
                        <span class="tool-description">Show hidden files in Finder</span>
                    </label>
                </div>
                <div class="tool">
                    <input type="checkbox" id="dock-autohide">
                    <label for="dock-autohide">
                        <span class="tool-name">Auto-hide Dock</span>
                        <span class="tool-description">Automatically hide and show the Dock</span>
                    </label>
                </div>
                <div class="tool">
                    <input type="checkbox" id="faster-animations">
                    <label for="faster-animations">
                        <span class="tool-name">Faster Animations</span>
                        <span class="tool-description">Speed up macOS animations</span>
                    </label>
                </div>
            </div>
        `;

        // Add event listeners for system preferences
        div.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.handleSystemPrefSelection(e));
        });

        return div;
    }

    handleToolSelection(event, category) {
        const checkbox = event.target;
        const toolId = checkbox.id;
        const command = checkbox.dataset.command;

        if (checkbox.checked) {
            this.selectedTools.add({ id: toolId, command: command });
        } else {
            this.selectedTools.delete({ id: toolId, command: command });
        }

        // Update selected count
        const categoryElement = checkbox.closest('.category');
        const selectedCount = categoryElement.querySelectorAll('input[type="checkbox"]:checked').length;
        categoryElement.querySelector('.selected-count').textContent = `${selectedCount} selected`;
    }

    handleSystemPrefSelection(event) {
        const checkbox = event.target;
        const prefId = checkbox.id;
        
        if (checkbox.checked) {
            this.selectedTools.add({ id: prefId, type: 'system-pref' });
        } else {
            this.selectedTools.delete({ id: prefId, type: 'system-pref' });
        }

        // Update selected count
        const categoryElement = checkbox.closest('.category');
        const selectedCount = categoryElement.querySelectorAll('input[type="checkbox"]:checked').length;
        categoryElement.querySelector('.selected-count').textContent = `${selectedCount} selected`;
    }

    getSelectedTools() {
        return Array.from(this.selectedTools);
    }

    generateInstallationScript() {
        const selectedTools = this.getSelectedTools();
        const timestamp = Date.now();
        
        let script = `cat << 'EOF' > ~/setup_${timestamp}.sh\n`;
        script += `#!/bin/bash\n\n`;
        
        // Add color variables with proper escaping
        script += `# Colors for output\n`;
        script += `RED='\\033[0;31m'\n`;
        script += `GREEN='\\033[0;32m'\n`;
        script += `YELLOW='\\033[1;33m'\n`;
        script += `NC='\\033[0m'\n\n`;

        // Add error handling
        script += `# Error handling\n`;
        script += `set -e\n`;
        script += `trap 'echo "\\n\${RED}Installation failed. Check the error message above.\${NC}"' ERR\n\n`;

        script += `echo "\${GREEN}Starting macOS development environment setup...\${NC}"\n\n`;

        // Check for Homebrew
        script += `# Check if Homebrew is installed\n`;
        script += `if ! command -v brew &> /dev/null; then\n`;
        script += `    echo "\${YELLOW}Installing Homebrew...\${NC}"\n`;
        script += `    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"\n`;
        script += `    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile\n`;
        script += `    eval "$(/opt/homebrew/bin/brew shellenv)"\n`;
        script += `fi\n\n`;

        // Update Homebrew
        script += `# Update Homebrew\n`;
        script += `echo "\${YELLOW}Updating Homebrew...\${NC}"\n`;
        script += `brew update\n\n`;

        // Install selected applications
        if (selectedTools.some(tool => tool.command)) {
            script += `# Installing applications\n`;
            script += `echo "\${YELLOW}Installing selected applications...\${NC}"\n`;
            selectedTools.forEach(tool => {
                if (tool.command) {
                    script += `echo "Installing ${tool.id}..."\n`;
                    script += `${tool.command}\n`;
                }
            });
            script += `\n`;
        }

        // Apply system preferences
        const systemPrefs = selectedTools.filter(tool => tool.type === 'system-pref');
        if (systemPrefs.length > 0) {
            script += `# Applying system preferences\n`;
            script += `echo "\${YELLOW}Applying system preferences...\${NC}"\n`;
            
            systemPrefs.forEach(pref => {
                switch (pref.id) {
                    case 'show-hidden-files':
                        script += `defaults write com.apple.finder AppleShowAllFiles YES\n`;
                        break;
                    case 'dock-autohide':
                        script += `defaults write com.apple.dock autohide -bool true\n`;
                        break;
                    case 'faster-animations':
                        script += `defaults write com.apple.dock expose-animation-duration -float 0.1\n`;
                        script += `defaults write com.apple.dock workspaces-edge-delay -float 0.1\n`;
                        break;
                }
            });

            // Restart affected services
            script += `\n# Restarting services\n`;
            script += `killall Finder\n`;
            script += `killall Dock\n`;
        }

        // Cleanup
        script += `\n# Cleanup\n`;
        script += `echo "\${YELLOW}Cleaning up...\${NC}"\n`;
        script += `brew cleanup\n\n`;

        script += `echo "\${GREEN}Setup completed successfully!\${NC}"\n`;
        
        // Close heredoc and add execution commands
        script += `EOF\n`;
        script += `chmod +x ~/setup_${timestamp}.sh\n`;
        script += `~/setup_${timestamp}.sh`;

        return script;
    }
} 