import { FIELD_MAPPINGS } from './config.js';

export class DataProcessor {
    processDataWithMappings(jsonData, mappings) {
        if (jsonData.length < 2) {
            throw new Error('Invalid file format: File must contain at least 2 rows');
        }

        const values = jsonData[1];
        return {
            version: 72,
            data: this.mapDataWithMappings(values, mappings)
        };
    }

    mapDataWithMappings(values, mappings) {
        const processedData = {};

        // Process each mapping
        for (const [fieldId, columnIndex] of mappings.entries()) {
            const value = values[columnIndex] || '';
            processedData[fieldId] = this.processFieldValue(fieldId, value.toString());
        }

        return processedData;
    }

    processFieldValue(fieldId, value) {
        // Special processing for certain fields can be added here
        if (fieldId === 'e21d14f85206fd595cfd97dd23f6beca') { // Certifications
            return value.split(',').map(cert => cert.trim()).join(',');
        }
        return value;
    }

    decodeHtmlEntities(text) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    }
} 