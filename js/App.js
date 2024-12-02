import { UI_ELEMENTS } from './config.js';
import { FileHandler } from './FileHandler.js';
import { DataProcessor } from './DataProcessor.js';
import { UIRenderer } from './UIRenderer.js';
import { FieldMapper } from './FieldMapper.js';

export class App {
    constructor() {
        this.initializeComponents();
        this.bindEvents();
        this.currentStep = 'upload';
    }

    initializeComponents() {
        this.uiRenderer = new UIRenderer();
        this.dataProcessor = new DataProcessor();
        this.fileHandler = new FileHandler(
            (progress) => this.uiRenderer.showProgress(progress)
        );
        this.fieldMapper = new FieldMapper(
            document.getElementById('mapping-container')
        );

        // Initialize UI elements
        this.fileInput = document.getElementById(UI_ELEMENTS.fileInput);
        this.uploadButton = document.getElementById('uploadButton');
        this.processButton = document.getElementById('processButton');
        this.backButton = document.getElementById('backToUpload');
        
        // Sections
        this.uploadSection = document.getElementById('upload-section');
        this.mappingSection = document.getElementById('mapping-section');
        this.profileContainer = document.getElementById('profile-container');

        // Steps
        this.steps = {
            upload: document.getElementById('step-upload'),
            map: document.getElementById('step-map'),
            preview: document.getElementById('step-preview')
        };
    }

    bindEvents() {
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.uploadButton.addEventListener('click', () => this.handleUpload());
        this.processButton.addEventListener('click', () => this.processFile());
        this.backButton.addEventListener('click', () => this.goToStep('upload'));
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        this.uploadButton.disabled = !file;
    }

    async handleUpload() {
        const file = this.fileInput.files[0];
        if (!file) return;

        try {
            // Validate file
            this.fileHandler.validateFile(file);

            // Read file
            const jsonData = await this.fileHandler.readXLSXFile(file);
            
            // Store the data for later processing
            this.rawData = jsonData;

            // Setup mapping interface
            this.fieldMapper.setHeaders(jsonData[0], jsonData[1]);

            // Move to mapping step
            this.goToStep('map');

        } catch (error) {
            this.uiRenderer.hideProgress();
            this.uiRenderer.showError(error.message);
        }
    }

    async processFile() {
        try {
            // Validate mappings
            this.fieldMapper.validateMappings();

            // Process data with mappings
            const processedData = this.dataProcessor.processDataWithMappings(
                this.rawData,
                this.fieldMapper.getMappings()
            );

            // Display results
            this.uiRenderer.showProgress(90);
            this.uiRenderer.displayProfile(processedData);
            this.uiRenderer.showProgress(100);

            // Move to preview step
            this.goToStep('preview');

            // Hide progress after a delay
            setTimeout(() => this.uiRenderer.hideProgress(), 1000);

        } catch (error) {
            this.uiRenderer.hideProgress();
            this.uiRenderer.showError(error.message);
        }
    }

    goToStep(step) {
        // Update current step
        this.currentStep = step;

        // Update step indicators
        Object.entries(this.steps).forEach(([name, element]) => {
            if (name === step) {
                element.classList.add('active');
                element.classList.remove('completed');
            } else if (this.getStepOrder(name) < this.getStepOrder(step)) {
                element.classList.remove('active');
                element.classList.add('completed');
            } else {
                element.classList.remove('active', 'completed');
            }
        });

        // Show/hide sections
        this.uploadSection.style.display = step === 'upload' ? 'block' : 'none';
        this.mappingSection.style.display = step === 'map' ? 'block' : 'none';
        this.profileContainer.style.display = step === 'preview' ? 'block' : 'none';
    }

    getStepOrder(step) {
        const order = { upload: 1, map: 2, preview: 3 };
        return order[step] || 0;
    }
} 