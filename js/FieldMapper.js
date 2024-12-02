import { FIELD_MAPPINGS } from './config.js';

export class FieldMapper {
    constructor(container) {
        this.container = container;
        this.mappings = new Map();
        this.excelHeaders = [];
        this.previewData = [];
    }

    setHeaders(headers, firstRowData) {
        this.excelHeaders = headers;
        this.previewData = firstRowData;
        this.createMappingInterface();
    }

    createMappingInterface() {
        this.container.innerHTML = '';
        
        // Create mapping rows for each required field
        Object.entries(FIELD_MAPPINGS).forEach(([fieldId, fieldLabel]) => {
            const row = this.createMappingRow(fieldId, fieldLabel);
            this.container.appendChild(row);
        });
    }

    createMappingRow(fieldId, fieldLabel) {
        const row = document.createElement('div');
        row.className = 'mapping-row';

        // Field label
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'mapping-field';
        fieldDiv.textContent = fieldLabel;

        // Select dropdown
        const select = document.createElement('select');
        select.className = 'form-select mapping-select';
        select.setAttribute('data-field-id', fieldId);

        // Add empty option
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '-- Select Column --';
        select.appendChild(emptyOption);

        // Add options for each Excel header
        this.excelHeaders.forEach((header, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = header;
            select.appendChild(option);

            // Auto-select if header matches field label
            if (header.toLowerCase() === fieldLabel.toLowerCase()) {
                select.value = index;
                this.updateMapping(fieldId, index);
            }
        });

        // Preview div
        const preview = document.createElement('div');
        preview.className = 'mapping-preview';

        // Handle change events
        select.addEventListener('change', (e) => {
            const selectedIndex = e.target.value;
            this.updateMapping(fieldId, selectedIndex);
            this.updatePreview(preview, selectedIndex);
        });

        // Initial preview
        if (select.value) {
            this.updatePreview(preview, select.value);
        }

        row.appendChild(fieldDiv);
        row.appendChild(select);
        row.appendChild(preview);

        return row;
    }

    updateMapping(fieldId, columnIndex) {
        if (columnIndex === '') {
            this.mappings.delete(fieldId);
        } else {
            this.mappings.set(fieldId, parseInt(columnIndex));
        }
    }

    updatePreview(previewElement, columnIndex) {
        if (columnIndex === '') {
            previewElement.textContent = '';
            return;
        }

        const previewValue = this.previewData[columnIndex];
        previewElement.textContent = previewValue ? 
            `Preview: ${this.truncateText(previewValue, 30)}` : 
            'No preview available';
    }

    truncateText(text, maxLength) {
        return text.length > maxLength ? 
            text.substring(0, maxLength) + '...' : 
            text;
    }

    getMappings() {
        return this.mappings;
    }

    validateMappings() {
        // Check if all required fields are mapped
        const requiredFields = ['38d50bb8c50daa8e83ed07a21a5f3f24']; // Short Bio is required
        for (const fieldId of requiredFields) {
            if (!this.mappings.has(fieldId)) {
                throw new Error(`${FIELD_MAPPINGS[fieldId]} is required`);
            }
        }
        return true;
    }
} 