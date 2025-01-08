import APP_CATEGORIES from './categories.js';
import SYSTEM_PREFERENCES from './system-preferences.js';
import ScriptGenerator from './script-generator.js';

class UIHandler {
    constructor() {
        this.scriptGenerator = new ScriptGenerator();
        this.searchInput = document.querySelector('.search-bar');
        this.setupEventListeners();
        this.renderCategories();
    }

    setupEventListeners() {
        // Search functionality
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

        // Category selection
        document.querySelectorAll('.select-all').forEach(button => {
            button.addEventListener('click', (e) => this.toggleCategory(e.target.dataset.category));
        });

        // Generate button
        document.querySelector('.actions button').addEventListener('click', () => this.generateScript());

        // Modal close button
        document.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
    }

    renderCategories() {
        const container = document.querySelector('.categories');
        container.innerHTML = '';
        container.className = 'categories-container';

        // Define column categories
        const columns = {
            essentials: {
                title: "Essentials",
                categories: ['browsers', 'productivity', 'communication']
            },
            development: {
                title: "Development",
                categories: ['development', 'programming', 'cli']
            },
            tools: {
                title: "Tools & Utilities",
                categories: ['databases', 'cloud', 'media']
            }
        };

        // Create columns and render categories
        Object.entries(columns).forEach(([columnKey, columnData]) => {
            const column = document.createElement('div');
            column.className = 'category-column';

            columnData.categories.forEach(categoryKey => {
                const category = APP_CATEGORIES[categoryKey];
                if (category) {
                    const categoryHtml = this.createCategoryHtml(categoryKey, category);
                    column.appendChild(categoryHtml);
                }
            });

            container.appendChild(column);
        });

        // Add system preferences in a separate column
        const prefsColumn = document.createElement('div');
        prefsColumn.className = 'category-column';
        const prefsHtml = this.createPreferencesHtml();
        prefsColumn.appendChild(prefsHtml);
        container.appendChild(prefsColumn);
    }

    createCategoryHtml(key, category) {
        const div = document.createElement('div');
        div.className = 'category';
        div.innerHTML = `
            <h3>${category.title}</h3>
            <div class="tools" id="${key}">
                ${category.items.map(item => `
                    <div class="tool">
                        <input type="checkbox" id="${item.id}" data-type="${item.type}" data-name="${item.package}">
                        <label for="${item.id}">
                            <span class="tool-name">${item.name}</span>
                            <span class="description">${item.description}</span>
                        </label>
                    </div>
                `).join('')}
            </div>
        `;
        return div;
    }

    createPreferencesHtml() {
        const div = document.createElement('div');
        div.className = 'category';
        div.innerHTML = `
            <h3>System Preferences</h3>
            <div class="tools" id="preferences">
                ${Object.values(SYSTEM_PREFERENCES).map(category => `
                    <div class="preference-group">
                        <h4>${category.title}</h4>
                        ${category.items.map(item => `
                            <div class="tool">
                                <input type="checkbox" id="${item.id}" data-type="preference">
                                <label for="${item.id}">
                                    <span class="tool-name">${item.name}</span>
                                </label>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        `;
        return div;
    }

    handleSearch(query) {
        query = query.toLowerCase();
        document.querySelectorAll('.tool').forEach(tool => {
            const label = tool.querySelector('label').textContent.toLowerCase();
            const description = tool.querySelector('.description')?.textContent.toLowerCase() || '';
            const matches = label.includes(query) || description.includes(query);
            tool.style.display = matches ? 'flex' : 'none';
        });

        // Show/hide categories based on whether they have visible tools
        document.querySelectorAll('.category').forEach(category => {
            const hasVisibleTools = Array.from(category.querySelectorAll('.tool'))
                .some(tool => tool.style.display !== 'none');
            category.style.display = hasVisibleTools ? 'block' : 'none';
        });
    }

    toggleCategory(categoryId) {
        const tools = document.querySelectorAll(`#${categoryId} input[type="checkbox"]`);
        const allChecked = Array.from(tools).every(tool => tool.checked);
        tools.forEach(tool => tool.checked = !allChecked);
    }

    generateScript() {
        const selectedApps = Array.from(document.querySelectorAll('input[type="checkbox"]:checked:not([data-type="preference"])'))
            .map(input => input.id);

        const selectedPrefs = Array.from(document.querySelectorAll('input[type="checkbox"][data-type="preference"]:checked'))
            .map(input => input.id);

        if (selectedApps.length === 0 && selectedPrefs.length === 0) {
            alert('Please select at least one item to install.');
            return;
        }

        const command = this.scriptGenerator.generateScript(selectedApps, selectedPrefs);
        this.showModal(command);
    }

    showModal(command) {
        const modal = document.getElementById('commandModal');
        const commandOutput = modal.querySelector('.command-output pre');
        commandOutput.textContent = command;
        modal.style.display = 'flex';

        // Setup copy button
        const copyButton = modal.querySelector('.copy-button');
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(command);
            this.showCopyIndicator();
        });
    }

    closeModal() {
        document.getElementById('commandModal').style.display = 'none';
    }

    showCopyIndicator() {
        const indicator = document.querySelector('.copy-indicator');
        indicator.classList.add('show');
        setTimeout(() => indicator.classList.remove('show'), 2000);
    }
}

export default UIHandler; 