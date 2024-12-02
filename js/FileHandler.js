export class FileHandler {
    constructor(progressCallback = () => {}) {
        this.progressCallback = progressCallback;
    }

    async readXLSXFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    this.progressCallback(30);
                    const data = e.target.result;
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    this.progressCallback(60);
                    resolve(jsonData);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });
    }

    validateFile(file) {
        const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (!file || !validTypes.includes(file.type)) {
            throw new Error('Invalid file type. Please upload an XLSX file.');
        }
        return true;
    }
} 