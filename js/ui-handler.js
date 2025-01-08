import CategoriesHandler from './categories-handler.js';

export default class UIHandler {
    constructor() {
        this.categoriesHandler = new CategoriesHandler();
        this.modal = document.getElementById('commandModal');
        this.init();
        this.selectedApps = new Set();
    }

    async init() {
        await this.categoriesHandler.loadCategories();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.querySelector('.search-bar');
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

        // Search tags
        document.querySelectorAll('.search-tags .tag').forEach(tag => {
            tag.addEventListener('click', () => this.handleTagClick(tag));
        });

        // View toggle
        document.getElementById('gridView').addEventListener('click', () => this.setView('grid'));
        document.getElementById('listView').addEventListener('click', () => this.setView('list'));

        // Add event listener for tag buttons
        const tagButtons = document.querySelectorAll('.tag');
        tagButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleTagClick(e));
        });

        // Add keyboard support for Enter key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.target.matches('input, textarea')) {
                const generateButton = document.querySelector('.generate-button');
                if (generateButton && this.selectedApps.size > 0) {
                    this.generateScript();
                }
            }
        });

        // Add click event listener for checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.matches('input[type="checkbox"]')) {
                const appId = e.target.id;
                if (e.target.checked) {
                    this.selectedApps.add(appId);
                } else {
                    this.selectedApps.delete(appId);
                }
                this.updateSelectedCount();
                this.highlightSelectedCategories();
            }
        });
    }

    handleSearch(query) {
        const normalizedQuery = query.toLowerCase();
        const tools = document.querySelectorAll('.tool');

        tools.forEach(tool => {
            const name = tool.querySelector('.tool-name').textContent.toLowerCase();
            const description = tool.querySelector('.tool-description').textContent.toLowerCase();
            const matches = name.includes(normalizedQuery) || description.includes(normalizedQuery);
            tool.style.display = matches ? '' : 'none';
        });

        // Hide empty categories
        document.querySelectorAll('.category').forEach(category => {
            const visibleTools = category.querySelectorAll('.tool[style="display: none"]').length;
            const totalTools = category.querySelectorAll('.tool').length;
            category.style.display = visibleTools === totalTools ? 'none' : '';
        });
    }

    handleTagClick(event) {
        const tag = event.currentTarget;
        const tagType = tag.textContent.trim();

        // Remove active class from all tags
        document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tag
        tag.classList.add('active');

        if (tagType.includes('Recommended')) {
            this.selectRecommendedApps();
        } else if (tagType.includes('Popular')) {
            // Handle popular apps filter
            this.showPopularApps();
        } else if (tagType.includes('New Apps')) {
            // Handle new apps filter
            this.showNewApps();
        }
    }

    selectRecommendedApps() {
        // List of recommended apps for a typical macOS setup
        const recommendedApps = {
            'Web Browsers': ['chrome', 'firefox'],
            'Communication': ['slack', 'zoom', 'whatsapp'],
            'Media Tools': ['vlc', 'spotify'],
            'Productivity Tools': ['rectangle', 'alfred'],
            'Office & Documents': ['microsoft-office'],
            'Development Tools': ['visual-studio-code', 'iterm2'],
            'CLI Tools': ['git']
        };

        // Uncheck all checkboxes first
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
            this.selectedApps.delete(checkbox.id);
        });

        // Select recommended apps
        for (const [category, apps] of Object.entries(recommendedApps)) {
            apps.forEach(appId => {
                const checkbox = document.querySelector(`#${appId}`);
                if (checkbox) {
                    checkbox.checked = true;
                    this.selectedApps.add(appId);
                }
            });
        }

        // Update UI to show selection
        this.updateSelectedCount();
        this.highlightSelectedCategories();
    }

    showPopularApps() {
        // Show all apps but highlight popular ones
        document.querySelectorAll('.tool').forEach(tool => {
            tool.style.display = 'flex';
            if (tool.dataset.popular === 'true') {
                tool.style.opacity = '1';
            } else {
                tool.style.opacity = '0.6';
            }
        });
    }

    showNewApps() {
        // Show all apps but highlight new ones
        document.querySelectorAll('.tool').forEach(tool => {
            tool.style.display = 'flex';
            if (tool.dataset.new === 'true') {
                tool.style.opacity = '1';
            } else {
                tool.style.opacity = '0.6';
            }
        });
    }

    updateSelectedCount() {
        const count = this.selectedApps.size;
        const generateButton = document.querySelector('.generate-button');
        if (generateButton) {
            generateButton.innerHTML = `
                <i class="fas fa-magic"></i>
                Install Selected Apps (${count})
                <span class="button-hint">Press Enter ↵</span>
            `;
        }
    }

    highlightSelectedCategories() {
        document.querySelectorAll('.category').forEach(category => {
            const checkboxes = category.querySelectorAll('input[type="checkbox"]');
            const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
            
            if (checkedCount > 0) {
                category.style.borderColor = 'var(--primary-color)';
                category.style.transform = 'translateY(-2px)';
            } else {
                category.style.borderColor = 'var(--border-color)';
                category.style.transform = 'none';
            }
        });
    }

    setView(view) {
        const container = document.getElementById('categoriesContainer');
        const gridBtn = document.getElementById('gridView');
        const listBtn = document.getElementById('listView');

        if (view === 'grid') {
            container.classList.remove('list-view');
            container.classList.add('grid-view');
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
        } else {
            container.classList.remove('grid-view');
            container.classList.add('list-view');
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
        }
    }

    copyCommand() {
        const command = document.getElementById('fullCommand').textContent;
        const feedback = document.querySelector('.copy-feedback');
        
        navigator.clipboard.writeText(command).then(() => {
            feedback.classList.add('show');
            setTimeout(() => {
                feedback.classList.remove('show');
            }, 3000); // Show feedback for 3 seconds
        }).catch(err => {
            console.error('Failed to copy command:', err);
        });
    }

    generateScript() {
        const script = this.categoriesHandler.generateInstallationScript();
        
        // Make sure the elements exist before trying to update them
        const displayElement = document.getElementById('displayCommand');
        const fullElement = document.getElementById('fullCommand');
        
        if (displayElement && fullElement) {
            // Use the full script for both display and copy
            displayElement.textContent = script;
            fullElement.textContent = script;
        }
        
        // Show the modal
        if (this.modal) {
            this.modal.style.display = 'flex';
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
            // Reset copy feedback when closing modal
            const feedback = document.querySelector('.copy-feedback');
            if (feedback) {
                feedback.classList.remove('show');
            }
        }
    }
} 