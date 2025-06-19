// Medical Office Form Processor - Main JavaScript
class MedicalFormProcessor {
    constructor() {
        this.patients = [];
        this.currentPatientIndex = -1;
        this.apiKey = '';
        this.services = [
            'UV coating on glasses',
            'Eye exam',
            'Contact lens fitting',
            'Retinal screening',
            'Glaucoma testing',
            'Frame selection/adjustment'
        ];
        
        this.init();
    }

    // Initialize the application
    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.loadLastActivePatient();
        this.updateUI();
    }

    // Local Storage Management
    loadFromStorage() {
        try {
            const storedPatients = localStorage.getItem('medicalFormPatients');
            const storedApiKey = localStorage.getItem('medicalFormApiKey');
            const lastPatientIndex = localStorage.getItem('medicalFormLastPatient');

            if (storedPatients) {
                this.patients = JSON.parse(storedPatients);
            }

            if (storedApiKey) {
                this.apiKey = storedApiKey;
                document.getElementById('apiKey').value = this.apiKey;
            }

            if (lastPatientIndex !== null && this.patients.length > 0) {
                this.currentPatientIndex = Math.min(parseInt(lastPatientIndex), this.patients.length - 1);
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
            this.showStatus('Error loading saved data', 'error');
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('medicalFormPatients', JSON.stringify(this.patients));
            localStorage.setItem('medicalFormLastPatient', this.currentPatientIndex.toString());
            if (this.apiKey) {
                localStorage.setItem('medicalFormApiKey', this.apiKey);
            }
        } catch (error) {
            console.error('Error saving to storage:', error);
            this.showStatus('Error saving data', 'error');
        }
    }

    // Patient Management
    loadLastActivePatient() {
        if (this.patients.length > 0 && this.currentPatientIndex >= 0) {
            this.loadPatientToForm(this.currentPatientIndex);
        }
    }

    createNewPatient() {
        const newPatient = {
            id: Date.now().toString(),
            lastName: '',
            firstName: '',
            sex: '',
            dateOfBirth: '',
            patientId: '',
            appointmentDateTime: '',
            visitReason: '',
            lastVisitDate: '',
            overdueCharges: '',
            services: [],
            extractedNotes: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.patients.push(newPatient);
        this.currentPatientIndex = this.patients.length - 1;
        this.clearForm();
        this.updateUI();
        this.saveToStorage();
        this.showStatus('New patient created', 'success');
    }

    createNewPatientFromForm() {
        const form = document.getElementById('patientForm');
        const newPatient = {
            id: Date.now().toString(),
            lastName: '',
            firstName: '',
            sex: '',
            dateOfBirth: '',
            patientId: '',
            appointmentDateTime: '',
            visitReason: '',
            lastVisitDate: '',
            overdueCharges: '',
            services: [],
            extractedNotes: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Save basic information from current form
        const formData = new FormData(form);
        for (let [key, value] of formData.entries()) {
            if (key !== 'services' && newPatient.hasOwnProperty(key)) {
                newPatient[key] = value;
            }
        }

        // Save services from current form
        this.services.forEach((service, i) => {
            const checkbox = document.getElementById(`service${i + 1}`);
            if (checkbox && checkbox.checked) {
                newPatient.services.push(service);
            }
        });

        // Save AI extracted notes from current form
        const extractedNotes = document.getElementById('extractedNotes');
        if (extractedNotes && extractedNotes.value) {
            newPatient.extractedNotes = extractedNotes.value;
        }

        this.patients.push(newPatient);
        this.currentPatientIndex = this.patients.length - 1;
        this.updateUI();
        this.saveToStorage();
        this.showStatus('Patient information saved', 'success');
    }

    deleteCurrentPatient() {
        if (this.currentPatientIndex >= 0 && this.patients.length > 0) {
            const patient = this.patients[this.currentPatientIndex];
            const patientName = `${patient.firstName} ${patient.lastName}`.trim();
            
            if (confirm(`Are you sure you want to delete patient: ${patientName || 'Unnamed Patient'}?`)) {
                this.patients.splice(this.currentPatientIndex, 1);
                
                if (this.patients.length === 0) {
                    this.currentPatientIndex = -1;
                    this.clearForm();
                } else {
                    this.currentPatientIndex = Math.min(this.currentPatientIndex, this.patients.length - 1);
                    this.loadPatientToForm(this.currentPatientIndex);
                }
                
                this.updateUI();
                this.saveToStorage();
                this.showStatus('Patient deleted successfully', 'success');
            }
        }
    }

    navigateToPatient(direction) {
        if (this.patients.length === 0) return;

        if (direction === 'prev' && this.currentPatientIndex > 0) {
            this.currentPatientIndex--;
        } else if (direction === 'next' && this.currentPatientIndex < this.patients.length - 1) {
            this.currentPatientIndex++;
        }

        this.loadPatientToForm(this.currentPatientIndex);
        this.updateUI();
        this.saveToStorage();
    }

    selectPatient(index) {
        if (index >= 0 && index < this.patients.length) {
            this.currentPatientIndex = index;
            this.loadPatientToForm(this.currentPatientIndex);
            this.updateUI();
            this.saveToStorage();
        }
    }

    // Form Management
    loadPatientToForm(index) {
        if (index < 0 || index >= this.patients.length) return;

        const patient = this.patients[index];
        const form = document.getElementById('patientForm');
        
        // Load basic patient information
        Object.keys(patient).forEach(key => {
            const element = form.elements[key];
            if (element && typeof patient[key] !== 'object') {
                element.value = patient[key] || '';
            }
        });

        // Load services
        this.services.forEach((service, i) => {
            const checkbox = document.getElementById(`service${i + 1}`);
            if (checkbox) {
                checkbox.checked = patient.services?.includes(service) || false;
            }
        });

        // Load AI extracted notes if available
        if (patient.extractedNotes) {
            const notesField = document.getElementById('extractedNotes');
            if (notesField) {
                notesField.value = patient.extractedNotes;
            }
        }
    }

    saveCurrentPatient() {
        // If no patient exists, create one first
        if (this.currentPatientIndex < 0) {
            this.createNewPatientFromForm();
            return;
        }

        const form = document.getElementById('patientForm');
        const patient = this.patients[this.currentPatientIndex];

        // Save basic information
        const formData = new FormData(form);
        for (let [key, value] of formData.entries()) {
            if (key !== 'services') {
                patient[key] = value;
            }
        }

        // Save services
        patient.services = [];
        this.services.forEach((service, i) => {
            const checkbox = document.getElementById(`service${i + 1}`);
            if (checkbox && checkbox.checked) {
                patient.services.push(service);
            }
        });

        // Save AI extracted notes
        const extractedNotes = document.getElementById('extractedNotes');
        if (extractedNotes && extractedNotes.value) {
            patient.extractedNotes = extractedNotes.value;
        }

        patient.updatedAt = new Date().toISOString();
        
        this.updateUI();
        this.saveToStorage();
        this.showStatus('Patient information saved', 'success');
    }

    clearForm() {
        const form = document.getElementById('patientForm');
        form.reset();
        
        // Clear services
        this.services.forEach((_, i) => {
            const checkbox = document.getElementById(`service${i + 1}`);
            if (checkbox) checkbox.checked = false;
        });

        // Clear AI results
        this.hideAIResults();
    }

    // UI Updates
    updateUI() {
        this.updatePatientCounter();
        this.updateNavigationButtons();
        this.updatePatientSelect();
    }

    updatePatientCounter() {
        const counter = document.getElementById('patientCounter');
        if (this.patients.length === 0) {
            counter.textContent = 'No patients loaded';
        } else {
            counter.textContent = `Patient ${this.currentPatientIndex + 1} of ${this.patients.length}`;
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevPatient');
        const nextBtn = document.getElementById('nextPatient');
        const deleteBtn = document.getElementById('deletePatient');

        prevBtn.disabled = this.currentPatientIndex <= 0;
        nextBtn.disabled = this.currentPatientIndex >= this.patients.length - 1;
        deleteBtn.disabled = this.patients.length === 0;
    }

    updatePatientSelect() {
        const select = document.getElementById('patientSelect');
        select.innerHTML = '<option value="">Select Patient...</option>';

        this.patients.forEach((patient, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${patient.firstName} ${patient.lastName}`.trim() || `Patient ${index + 1}`;
            if (index === this.currentPatientIndex) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    }

    // Print Functionality
    generatePrintableForm() {
        if (this.currentPatientIndex < 0) {
            this.showStatus('Please save patient information first', 'warning');
            return;
        }

        const patient = this.patients[this.currentPatientIndex];
        const printTemplate = document.getElementById('printTemplate');
        
        // Update print date
        const printDate = printTemplate.querySelector('.print-date');
        printDate.textContent = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Update patient details
        const patientDetails = printTemplate.querySelector('.patient-details');
        patientDetails.innerHTML = `
            <div class="patient-detail"><strong>Last Name:</strong> <span>${patient.lastName || '_________________'}</span></div>
            <div class="patient-detail"><strong>First Name:</strong> <span>${patient.firstName || '_________________'}</span></div>
            <div class="patient-detail"><strong>Sex:</strong> <span>${patient.sex || '_________________'}</span></div>
            <div class="patient-detail"><strong>Date of Birth:</strong> <span>${this.formatDate(patient.dateOfBirth) || '_________________'}</span></div>
            <div class="patient-detail"><strong>Patient ID:</strong> <span>${patient.patientId || '_________________'}</span></div>
            <div class="patient-detail"><strong>Appointment:</strong> <span>${this.formatDateTime(patient.appointmentDateTime) || '_________________'}</span></div>
            <div class="patient-detail"><strong>Visit Reason:</strong> <span>${patient.visitReason || '_________________'}</span></div>
            <div class="patient-detail"><strong>Last Visit:</strong> <span>${this.formatDate(patient.lastVisitDate) || '_________________'}</span></div>
            <div class="patient-detail"><strong>Overdue Charges:</strong> <span>${patient.overdueCharges || '_________________'}</span></div>
        `;

        // Update services checklist
        const serviceOptions = printTemplate.querySelector('.service-options');
        serviceOptions.innerHTML = this.services.map(service => `
            <div class="service-option">
                <span class="service-checkbox"></span>
                <span>${service}</span>
            </div>
        `).join('');

        // Show print preview
        this.showPrintPreview();
    }

    showPrintPreview() {
        const confirmed = confirm('Print the patient form? Click OK to print or Cancel to return.');
        if (confirmed) {
            window.print();
        }
    }

    // AI Integration
    async saveApiKey() {
        const apiKeyInput = document.getElementById('apiKey');
        const key = apiKeyInput.value.trim();
        
        if (!key) {
            this.showStatus('Please enter an API key', 'warning');
            return;
        }

        this.apiKey = key;
        localStorage.setItem('medicalFormApiKey', this.apiKey);
        this.showStatus('API key saved successfully', 'success');
    }

    async processImage() {
        const imageInput = document.getElementById('formImage');
        const file = imageInput.files[0];

        if (!file) {
            this.showStatus('Please select an image file', 'warning');
            return;
        }

        if (!this.apiKey) {
            this.showStatus('Please save your API key first', 'warning');
            return;
        }

        const processBtn = document.getElementById('processImage');
        const originalText = processBtn.textContent;
        
        try {
            processBtn.disabled = true;
            processBtn.innerHTML = '<span class="loading-spinner"></span>Processing...';

            const base64Image = await this.fileToBase64(file);
            const result = await this.callGeminiAPI(base64Image);
            
            this.displayAIResults(result);
            this.showStatus('Image processed successfully', 'success');
            
        } catch (error) {
            console.error('Error processing image:', error);
            this.showStatus('Error processing image: ' + error.message, 'error');
        } finally {
            processBtn.disabled = false;
            processBtn.textContent = originalText;
        }
    }

    async callGeminiAPI(base64Image) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        {
                            text: `Analyze this medical form image and extract the following information:
                            1. Any circled or selected services from this list: ${this.services.join(', ')}
                            2. Any handwritten notes or additional information
                            
                            Please provide the response in the following format:
                            SERVICES: [list any selected services]
                            NOTES: [extract any handwritten notes or additional information]`
                        },
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: base64Image.split(',')[1]
                            }
                        }
                    ]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'API request failed');
        }

        const data = await response.json();
        return data.candidates[0]?.content?.parts[0]?.text || 'No content extracted';
    }

    displayAIResults(result) {
        const aiResults = document.getElementById('aiResults');
        const extractedServices = document.getElementById('extractedServices');
        const extractedNotes = document.getElementById('extractedNotes');

        // Parse the result
        const lines = result.split('\n');
        let services = '';
        let notes = '';
        let currentSection = '';

        lines.forEach(line => {
            if (line.toUpperCase().startsWith('SERVICES:')) {
                currentSection = 'services';
                services += line.substring(9).trim() + '\n';
            } else if (line.toUpperCase().startsWith('NOTES:')) {
                currentSection = 'notes';
                notes += line.substring(6).trim() + '\n';
            } else if (currentSection === 'services') {
                services += line + '\n';
            } else if (currentSection === 'notes') {
                notes += line + '\n';
            }
        });

        extractedServices.value = services.trim();
        extractedNotes.value = notes.trim();
        
        aiResults.style.display = 'block';
    }

    confirmAIResults() {
        const extractedNotes = document.getElementById('extractedNotes').value;
        
        if (this.currentPatientIndex >= 0) {
            this.patients[this.currentPatientIndex].extractedNotes = extractedNotes;
            this.patients[this.currentPatientIndex].updatedAt = new Date().toISOString();
            this.saveToStorage();
        }

        this.showStatus('AI results confirmed and saved', 'success');
    }

    hideAIResults() {
        const aiResults = document.getElementById('aiResults');
        aiResults.style.display = 'none';
        
        const extractedServices = document.getElementById('extractedServices');
        const extractedNotes = document.getElementById('extractedNotes');
        extractedServices.value = '';
        extractedNotes.value = '';
    }

    // Export Functionality
    exportCurrentPatient() {
        if (this.currentPatientIndex < 0) {
            this.showStatus('No patient selected for export', 'warning');
            return;
        }

        const patient = this.patients[this.currentPatientIndex];
        const filename = this.generateFilename(patient);
        this.downloadJSON(patient, filename);
        this.showStatus('Patient data exported successfully', 'success');
    }

    exportAllPatients() {
        if (this.patients.length === 0) {
            this.showStatus('No patients to export', 'warning');
            return;
        }

        const exportData = {
            exportDate: new Date().toISOString(),
            patientCount: this.patients.length,
            patients: this.patients
        };

        const filename = `AllPatients_${new Date().toISOString().split('T')[0]}.json`;
        this.downloadJSON(exportData, filename);
        this.showStatus(`${this.patients.length} patients exported successfully`, 'success');
    }

    generateFilename(patient) {
        const name = `${patient.firstName}_${patient.lastName}`.replace(/[^a-zA-Z0-9]/g, '_');
        const date = new Date().toISOString().split('T')[0];
        return `${name || 'Patient'}_${date}.json`;
    }

    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Settings and Data Management
    clearAllPatientData() {
        if (confirm('Are you sure you want to delete ALL patient data? This cannot be undone.')) {
            this.patients = [];
            this.currentPatientIndex = -1;
            localStorage.removeItem('medicalFormPatients');
            localStorage.removeItem('medicalFormLastPatient');
            this.clearForm();
            this.updateUI();
            this.showStatus('All patient data cleared', 'success');
        }
    }

    clearApiKey() {
        if (confirm('Are you sure you want to clear the saved API key?')) {
            this.apiKey = '';
            document.getElementById('apiKey').value = '';
            localStorage.removeItem('medicalFormApiKey');
            this.showStatus('API key cleared', 'success');
        }
    }

    // Utility Functions
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    formatDate(dateString) {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US');
    }

    formatDateTime(dateTimeString) {
        if (!dateTimeString) return '';
        return new Date(dateTimeString).toLocaleString('en-US');
    }

    showStatus(message, type = 'info') {
        // Remove existing status messages
        const existingMessages = document.querySelectorAll('.status-message');
        existingMessages.forEach(msg => msg.remove());

        // Create new status message
        const statusDiv = document.createElement('div');
        statusDiv.className = `status-message ${type}`;
        statusDiv.textContent = message;
        document.body.appendChild(statusDiv);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (statusDiv.parentNode) {
                statusDiv.parentNode.removeChild(statusDiv);
            }
        }, 3000);
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Patient Navigation
        document.getElementById('prevPatient').addEventListener('click', () => this.navigateToPatient('prev'));
        document.getElementById('nextPatient').addEventListener('click', () => this.navigateToPatient('next'));
        document.getElementById('patientSelect').addEventListener('change', (e) => {
            if (e.target.value) {
                this.selectPatient(parseInt(e.target.value));
            }
        });

        // Patient Management
        document.getElementById('newPatient').addEventListener('click', () => this.createNewPatient());
        document.getElementById('deletePatient').addEventListener('click', () => this.deleteCurrentPatient());
        document.getElementById('savePatient').addEventListener('click', () => this.saveCurrentPatient());

        // Print Functionality
        document.getElementById('generateForm').addEventListener('click', () => this.generatePrintableForm());

        // AI Processing
        document.getElementById('saveApiKey').addEventListener('click', () => this.saveApiKey());
        document.getElementById('processImage').addEventListener('click', () => this.processImage());
        document.getElementById('confirmResults').addEventListener('click', () => this.confirmAIResults());
        document.getElementById('reprocessImage').addEventListener('click', () => this.processImage());

        // File Upload Preview
        document.getElementById('formImage').addEventListener('change', (e) => this.handleImageUpload(e));

        // Export Functions
        document.getElementById('exportPatient').addEventListener('click', () => this.exportCurrentPatient());
        document.getElementById('exportAll').addEventListener('click', () => this.exportAllPatients());

        // Settings
        document.getElementById('clearPatientData').addEventListener('click', () => this.clearAllPatientData());
        document.getElementById('clearApiKey').addEventListener('click', () => this.clearApiKey());

        // Auto-save form changes
        const form = document.getElementById('patientForm');
        form.addEventListener('input', () => {
            // Debounce auto-save
            clearTimeout(this.autoSaveTimeout);
            this.autoSaveTimeout = setTimeout(() => {
                if (this.currentPatientIndex >= 0) {
                    this.saveCurrentPatient();
                }
            }, 2000);
        });
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        const preview = document.getElementById('imagePreview');
        const processBtn = document.getElementById('processImage');

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `<img src="${e.target.result}" alt="Form Preview">`;
                processBtn.disabled = false;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = '<span class="empty">No image selected</span>';
            preview.classList.add('empty');
            processBtn.disabled = true;
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.medicalFormProcessor = new MedicalFormProcessor();
}); 