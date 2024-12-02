import { UI_ELEMENTS } from './config.js';
import { FileHandler } from './FileHandler.js';
import { DataProcessor } from './DataProcessor.js';
import { UIRenderer } from './UIRenderer.js';

export class App {
    constructor() {
        this.initializeComponents();
        this.bindEvents();
    }

    initializeComponents() {
        this.uiRenderer = new UIRenderer();
        this.dataProcessor = new DataProcessor();
        this.fileHandler = new FileHandler(
            (progress) => this.uiRenderer.showProgress(progress)
        );

        // Initialize UI elements
        this.fileInput = document.getElementById(UI_ELEMENTS.fileInput);
        this.processButton = document.getElementById(UI_ELEMENTS.processButton);
    }

    bindEvents() {
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.processButton.addEventListener('click', () => this.processFile());
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        this.processButton.disabled = !file;
    }

    async processFile() {
        const file = this.fileInput.files[0];
        if (!file) return;

        try {
            // Validate file
            this.fileHandler.validateFile(file);

            // Read and process file
            const jsonData = await this.fileHandler.readXLSXFile(file);
            const processedData = this.dataProcessor.processData(jsonData);

            // Display results
            this.uiRenderer.showProgress(90);
            this.uiRenderer.displayProfile(processedData);
            this.uiRenderer.showProgress(100);

            // Hide progress after a delay
            setTimeout(() => this.uiRenderer.hideProgress(), 1000);

        } catch (error) {
            this.uiRenderer.hideProgress();
            this.uiRenderer.showError(error.message);
        }
    }
} 