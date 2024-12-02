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
            document.getElementById('mapping-container'),
            document.getElementById('rowSelector')
        );

        // Initialize UI elements
        this.fileInput = document.getElementById(UI_ELEMENTS.fileInput);
        this.uploadButton = document.getElementById('uploadButton');
        this.processButton = document.getElementById('processButton');
        this.backToUploadButton = document.getElementById('backToUpload');
        this.backToMappingButton = document.getElementById('backToMapping');
        this.copyJsonButton = document.getElementById('copyJson');
        this.copyComponentButton = document.getElementById('copyComponent');
        
        // Sections
        this.uploadSection = document.getElementById('upload-section');
        this.mappingSection = document.getElementById('mapping-section');
        this.previewSection = document.getElementById('preview-section');

        // Preview elements
        this.jsonPreview = document.getElementById('jsonPreview');
        this.componentPreview = document.getElementById('componentPreview');

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
        this.backToUploadButton.addEventListener('click', () => this.goToStep('upload'));
        this.backToMappingButton.addEventListener('click', () => this.goToStep('map'));
        this.copyJsonButton.addEventListener('click', () => this.copyToClipboard('json'));
        this.copyComponentButton.addEventListener('click', () => this.copyToClipboard('component'));
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
            
            // Setup mapping interface with all data
            this.fieldMapper.setData(jsonData);

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

            // Get selected row data and process with mappings
            const selectedData = this.fieldMapper.getSelectedData();
            const processedData = this.dataProcessor.processDataWithMappings(
                [this.fieldMapper.excelHeaders, selectedData],
                this.fieldMapper.getMappings()
            );

            // Generate component code
            const componentCode = this.generateComponentCode(processedData);

            // Display results
            this.displayPreviews(processedData, componentCode);

            // Move to preview step
            this.goToStep('preview');

        } catch (error) {
            this.uiRenderer.showError(error.message);
        }
    }

    generateComponentCode(data) {
        // Generate the exact format required
        return `~[com[25306 1 72${JSON.stringify({
            version: 72,
            data: data.data
        })}]]~`;
    }

    displayPreviews(jsonData, componentCode) {
        // Display JSON with syntax highlighting
        this.jsonPreview.textContent = JSON.stringify(jsonData, null, 2);
        Prism.highlightElement(this.jsonPreview);

        // Display component code with syntax highlighting
        this.componentPreview.textContent = componentCode;
        Prism.highlightElement(this.componentPreview);
    }

    async copyToClipboard(type) {
        const text = type === 'json' ? 
            this.jsonPreview.textContent : 
            this.componentPreview.textContent;

        try {
            await navigator.clipboard.writeText(text);
            this.uiRenderer.showSuccess(`${type === 'json' ? 'JSON' : 'Component code'} copied to clipboard`);
        } catch (err) {
            this.uiRenderer.showError('Failed to copy to clipboard');
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
        this.previewSection.style.display = step === 'preview' ? 'block' : 'none';
    }

    getStepOrder(step) {
        const order = { upload: 1, map: 2, preview: 3 };
        return order[step] || 0;
    }
} 