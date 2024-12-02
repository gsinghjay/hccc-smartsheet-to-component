import { FIELD_MAPPINGS, UI_ELEMENTS } from './config.js';

export class UIRenderer {
    constructor() {
        this.initializeElements();
    }

    initializeElements() {
        this.profileInfo = document.getElementById(UI_ELEMENTS.profileInfo);
        this.progressBar = document.querySelector(UI_ELEMENTS.progressBar);
        this.progressBarInner = document.querySelector(UI_ELEMENTS.progressBarInner);
    }

    showProgress(percent) {
        this.progressBar.style.display = 'block';
        this.progressBarInner.style.width = `${percent}%`;
        this.progressBarInner.setAttribute('aria-valuenow', percent);
    }

    hideProgress() {
        this.progressBar.style.display = 'none';
    }

    displayProfile(data) {
        let html = '';

        // Display pronouns at the top
        if (data.data['704b75b17a1871a4283bb57871a5ccc1']) {
            html += this.createPronouns(data.data['704b75b17a1871a4283bb57871a5ccc1']);
        }

        // Display quote if available
        if (data.data['962a606485a6fe685f8e26b238b17c7c']) {
            html += this.createQuote(data.data['962a606485a6fe685f8e26b238b17c7c']);
        }

        // Display short bio
        if (data.data['38d50bb8c50daa8e83ed07a21a5f3f24']) {
            html += this.createProfileField('Summary', data.data['38d50bb8c50daa8e83ed07a21a5f3f24']);
        }

        // Display other fields
        html += this.createRemainingFields(data);

        this.profileInfo.innerHTML = html;
    }

    createPronouns(pronouns) {
        return `<span class="pronouns mb-3">${pronouns}</span>`;
    }

    createQuote(quote) {
        return `<div class="quote">${this.decodeHtmlEntities(quote)}</div>`;
    }

    createProfileField(label, value) {
        if (!value) return '';
        
        return `
            <div class="profile-field">
                <div class="profile-field-label">${label}</div>
                <div class="profile-field-value">${value}</div>
            </div>
        `;
    }

    createCertificationsList(certifications) {
        const certList = certifications.split(',').map(cert => `<li>${cert.trim()}</li>`).join('');
        return `
            <div class="profile-field">
                <div class="profile-field-label">${FIELD_MAPPINGS['e21d14f85206fd595cfd97dd23f6beca']}</div>
                <ul class="profile-field-value">${certList}</ul>
            </div>
        `;
    }

    createRemainingFields(data) {
        let html = '';
        for (const [key, value] of Object.entries(data.data)) {
            if (FIELD_MAPPINGS[key] && value && 
                !['704b75b17a1871a4283bb57871a5ccc1', '962a606485a6fe685f8e26b238b17c7c', '38d50bb8c50daa8e83ed07a21a5f3f24'].includes(key)) {
                
                if (key === 'e21d14f85206fd595cfd97dd23f6beca') {
                    html += this.createCertificationsList(value);
                } else {
                    html += this.createProfileField(FIELD_MAPPINGS[key], value);
                }
            }
        }
        return html;
    }

    decodeHtmlEntities(text) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    }

    showError(message) {
        alert(message);
        console.error(message);
    }
} 