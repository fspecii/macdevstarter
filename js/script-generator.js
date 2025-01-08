import APP_CATEGORIES from './categories.js';
import SYSTEM_PREFERENCES from './system-preferences.js';

class ScriptGenerator {
    constructor() {
        this.brewInstalls = [];
        this.caskInstalls = [];
        this.systemPrefs = [];
        this.vscodeExtensions = [];
    }

    generateScript(selectedApps, selectedPrefs) {
        this._processSelections(selectedApps, selectedPrefs);
        return this._createInstallationScript();
    }

    _processSelections(selectedApps, selectedPrefs) {
        // Process app selections
        for (const appId of selectedApps) {
            for (const category of Object.values(APP_CATEGORIES)) {
                const app = category.items.find(item => item.id === appId);
                if (app) {
                    if (app.type === 'brew') {
                        this.brewInstalls.push(app.package);
                    } else if (app.type === 'cask') {
                        this.caskInstalls.push(app.package);
                    }
                    if (app.id === 'vscode' && app.extensions) {
                        this.vscodeExtensions.push(...app.extensions);
                    }
                }
            }
        }

        // Process system preference selections
        for (const prefId of selectedPrefs) {
            for (const category of Object.values(SYSTEM_PREFERENCES)) {
                const pref = category.items.find(item => item.id === prefId);
                if (pref) {
                    this.systemPrefs.push(pref.command);
                }
            }
        }
    }

    _createInstallationScript() {
        const timestamp = new Date().getTime();
        const scriptContent = [
            '#!/bin/bash',
            '',
            '# Colors for output',
            'RED=\'\\033[0;31m\'',
            'GREEN=\'\\033[0;32m\'',
            'YELLOW=\'\\033[1;33m\'',
            'NC=\'\\033[0m\'',
            '',
            '# Error handling',
            'set -e',
            'trap \'echo "\\n${RED}Installation failed. Check the error message above.${NC}"\' ERR',
            '',
            'echo "${GREEN}Starting macOS development environment setup...${NC}"',
            '',
            '# Check if Homebrew is installed',
            'if ! command -v brew &> /dev/null; then',
            '    echo "${YELLOW}Installing Homebrew...${NC}"',
            '    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
            '    echo \'eval "$(/opt/homebrew/bin/brew shellenv)"\' >> ~/.zprofile',
            '    eval "$(/opt/homebrew/bin/brew shellenv)"',
            'fi',
            '',
            '# Update Homebrew',
            'echo "${YELLOW}Updating Homebrew...${NC}"',
            'brew update',
            ''
        ];

        // Add system preferences
        if (this.systemPrefs.length > 0) {
            scriptContent.push(
                '# Configuring system preferences',
                'echo "${YELLOW}Configuring system preferences...${NC}"',
                ...this.systemPrefs,
                ''
            );
        }

        // Add Homebrew formulae
        if (this.brewInstalls.length > 0) {
            scriptContent.push(
                '# Installing Homebrew formulae',
                'echo "${YELLOW}Installing Homebrew formulae...${NC}"',
                `brew install ${this.brewInstalls.join(' ')}`,
                ''
            );
        }

        // Add Homebrew casks
        if (this.caskInstalls.length > 0) {
            scriptContent.push(
                '# Installing applications',
                'echo "${YELLOW}Installing applications...${NC}"',
                `brew install --cask ${this.caskInstalls.join(' ')}`,
                ''
            );
        }

        // Add VS Code extensions
        if (this.vscodeExtensions.length > 0) {
            scriptContent.push(
                '# Installing VS Code extensions',
                'echo "${YELLOW}Installing VS Code extensions...${NC}"',
                'if command -v code &> /dev/null; then',
                ...this.vscodeExtensions.map(ext => `    code --install-extension ${ext}`),
                'else',
                '    echo "${RED}VS Code not found. Skipping extension installation.${NC}"',
                'fi',
                ''
            );
        }

        // Add cleanup and completion message
        scriptContent.push(
            '# Cleanup',
            'echo "${YELLOW}Cleaning up...${NC}"',
            'brew cleanup',
            '',
            'echo "${GREEN}Setup completed successfully!${NC}"'
        );

        // Generate the command to create and run the script
        const command = `cat << 'EOF' > ~/setup_${timestamp}.sh\n${scriptContent.join('\n')}\nEOF\nchmod +x ~/setup_${timestamp}.sh\n~/setup_${timestamp}.sh`;

        return command;
    }
}

export default ScriptGenerator; 