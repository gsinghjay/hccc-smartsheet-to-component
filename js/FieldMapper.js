import { FIELD_MAPPINGS } from './config.js';

export class FieldMapper {
    constructor(container, rowSelector) {
        this.container = container;
        this.rowSelector = rowSelector;
        this.mappings = new Map();
        this.excelHeaders = [];
        this.allData = [];
        this.selectedRowIndex = 1; // Default to first data row
    }

    setData(jsonData) {
        if (jsonData.length < 2) {
            throw new Error('Invalid file format: File must contain at least 2 rows');
        }

        this.excelHeaders = jsonData[0];
        this.allData = jsonData.slice(1); // Store all data rows
        this.populateRowSelector();
        this.createMappingInterface();
    }

    populateRowSelector() {
        this.rowSelector.innerHTML = '';
        
        // Add options for each data row
        this.allData.forEach((row, index) => {
            const option = document.createElement('option');
            option.value = index;
            
            // Create a preview of the row using the first few fields
            const preview = this.createRowPreview(row);
            option.textContent = `Row ${index + 1}: ${preview}`;
            
            this.rowSelector.appendChild(option);
        });

        // Handle row selection change
        this.rowSelector.addEventListener('change', (e) => {
            this.selectedRowIndex = parseInt(e.target.value);
            this.updateAllPreviews();
        });
    }

    createRowPreview(row) {
        // Use the first non-empty value as preview
        const previewValue = row.find(cell => cell && cell.toString().trim() !== '') || 'Empty row';
        return this.truncateText(previewValue.toString(), 40);
    }

    createMappingInterface() {
        this.container.innerHTML = '';
        
        // Create mapping rows for each field
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

        const previewValue = this.allData[this.selectedRowIndex][columnIndex];
        previewElement.textContent = previewValue ? 
            `Preview: ${this.truncateText(previewValue.toString(), 30)}` : 
            'No preview available';
    }

    updateAllPreviews() {
        // Update all preview elements when row selection changes
        const mappingRows = this.container.querySelectorAll('.mapping-row');
        mappingRows.forEach(row => {
            const select = row.querySelector('select');
            const preview = row.querySelector('.mapping-preview');
            if (select.value) {
                this.updatePreview(preview, select.value);
            }
        });
    }

    truncateText(text, maxLength) {
        return text.length > maxLength ? 
            text.substring(0, maxLength) + '...' : 
            text;
    }

    getMappings() {
        return this.mappings;
    }

    getSelectedData() {
        return this.allData[this.selectedRowIndex];
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