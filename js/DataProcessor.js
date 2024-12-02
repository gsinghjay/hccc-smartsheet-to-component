import { FIELD_MAPPINGS } from './config.js';

export class DataProcessor {
    processData(jsonData) {
        if (jsonData.length < 2) {
            throw new Error('Invalid file format: File must contain at least 2 rows');
        }

        const headers = jsonData[0];
        const values = jsonData[1];
        
        return {
            version: 72,
            data: this.mapDataToFields(headers, values)
        };
    }

    mapDataToFields(headers, values) {
        const processedData = {};

        headers.forEach((header, index) => {
            const value = values[index] || '';
            const fieldId = this.findMatchingFieldId(header);

            if (fieldId) {
                processedData[fieldId] = this.processFieldValue(fieldId, value.toString());
            }
        });

        return processedData;
    }

    findMatchingFieldId(header) {
        return Object.entries(FIELD_MAPPINGS).find(([_, label]) => 
            label.toLowerCase() === header.toLowerCase()
        )?.[0];
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