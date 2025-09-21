// QR Code Extension for KrishiChain - Add QR generation functionality
// This file extends the existing KrishiChain application without modifying current files

class QRCodeExtension {
    constructor(appInstance) {
        this.app = appInstance;
        this.qrCodeInstances = new Map(); // Store QR code instances
        this.init();
    }

    init() {
        this.loadQRCodeLibrary();
        this.enhanceExistingModal();
        this.addVisualQRCodes();
    }

    // Load QRCode.js library dynamically
    loadQRCodeLibrary() {
        if (window.QRCode) {
            console.log('QRCode.js already loaded');
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
            script.onload = () => {
                console.log('QRCode.js library loaded successfully');
                resolve();
            };
            script.onerror = () => {
                console.error('Failed to load QRCode.js library');
                reject(new Error('Failed to load QRCode library'));
            };
            document.head.appendChild(script);
        });
    }

    // Enhance existing modal to show visual QR codes
    enhanceExistingModal() {
        const modal = document.getElementById('success-modal');
        if (!modal) return;

        // Add visual QR container to modal if not exists
        const modalBody = modal.querySelector('.modal-body');
        if (!modalBody) return;

        // Check if QR visual container already exists
        let qrVisualContainer = modalBody.querySelector('#qr-visual-container');
        if (!qrVisualContainer) {
            qrVisualContainer = document.createElement('div');
            qrVisualContainer.id = 'qr-visual-container';
            qrVisualContainer.className = 'qr-visual-container';
            qrVisualContainer.style.cssText = `
                background: var(--color-bg-3);
                border: 2px solid var(--color-success);
                border-radius: var(--radius-base);
                padding: var(--space-16);
                text-align: center;
                margin-top: var(--space-16);
                display: none;
            `;
            modalBody.appendChild(qrVisualContainer);
        }
    }

    // Generate visual QR code with text displayed on top
    generateVisualQRCode(containerId, qrText, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with id '${containerId}' not found`);
            return null;
        }

        // Clear existing QR code
        container.innerHTML = '';

        try {
            const defaultOptions = {
                text: qrText,
                width: 200,
                height: 200,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: window.QRCode ? window.QRCode.CorrectLevel.M : 0
            };

            const qrOptions = { ...defaultOptions, ...options };
            
            // Create text display above QR code
            const qrTextDisplay = document.createElement('div');
            qrTextDisplay.className = 'qr-text-display';
            qrTextDisplay.style.cssText = `
                font-family: monospace;
                font-size: 14px;
                font-weight: bold;
                color: var(--color-success, #10b981);
                background: rgba(var(--color-success-rgb, 16, 185, 129), 0.1);
                padding: 8px 12px;
                border-radius: 6px;
                margin-bottom: 12px;
                border: 1px solid var(--color-success, #10b981);
                word-break: break-all;
                line-height: 1.4;
                max-width: ${qrOptions.width}px;
                margin: 0 auto 12px auto;
            `;
            qrTextDisplay.textContent = qrText;
            container.appendChild(qrTextDisplay);

            if (!window.QRCode) {
                // Fallback: show larger text-based QR representation
                const fallbackDiv = document.createElement('div');
                fallbackDiv.style.cssText = `
                    font-family: monospace; 
                    font-size: 16px; 
                    font-weight: bold; 
                    color: var(--color-success); 
                    background: white; 
                    padding: 16px; 
                    border-radius: 8px; 
                    margin: 8px 0;
                    border: 2px dashed var(--color-success, #10b981);
                `;
                fallbackDiv.innerHTML = `
                    <div style="margin-bottom: 8px;">📱 QR Code (Library Loading...)</div>
                    <p style="font-size: 12px; color: var(--color-text-secondary);">
                        QR Code library loading... Visual QR will appear here.
                    </p>
                `;
                container.appendChild(fallbackDiv);
                return null;
            }

            // Create QR code container
            const qrCodeDiv = document.createElement('div');
            qrCodeDiv.className = 'qr-code-visual';
            qrCodeDiv.style.cssText = `
                display: inline-block;
                background: white;
                padding: 8px;
                border-radius: 8px;
                border: 1px solid #e5e5e5;
                margin-bottom: 16px;
            `;
            container.appendChild(qrCodeDiv);

            const qrCode = new window.QRCode(qrCodeDiv, qrOptions);
            
            // Store instance for future reference
            this.qrCodeInstances.set(containerId, qrCode);
            
            return qrCode;
        } catch (error) {
            console.error('Error generating QR code:', error);
            container.innerHTML = `
                <div style="color: var(--color-error); padding: 16px;">
                    <div style="font-family: monospace; font-weight: bold; margin-bottom: 8px; color: var(--color-success);">${qrText}</div>
                    <p>Error generating QR code</p>
                    <div style="font-family: monospace; font-size: 12px; background: white; color: black; padding: 8px; border-radius: 4px; margin-top: 8px;">
                        📱 QR Code generation failed - Text shown above
                    </div>
                </div>
            `;
            return null;
        }
    }

    // Update existing QR code
    updateQRCode(containerId, newText) {
        const qrInstance = this.qrCodeInstances.get(containerId);
        if (qrInstance && qrInstance.makeCode) {
            // Update the text display first
            const container = document.getElementById(containerId);
            const textDisplay = container?.querySelector('.qr-text-display');
            if (textDisplay) {
                textDisplay.textContent = newText;
            }
            
            // Update the QR code
            qrInstance.makeCode(newText);
        } else {
            // Regenerate if instance not found
            this.generateVisualQRCode(containerId, newText);
        }
    }

    // Add visual QR codes to product listings
    addVisualQRCodes() {
        // Wait for DOM and library to be ready
        setTimeout(() => {
            this.addQRToProductCards();
        }, 500);
    }

    // Add QR codes to product cards
    addQRToProductCards() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach((card, index) => {
            const qrCode = card.querySelector('.qr-code-text');
            if (qrCode) {
                const qrText = qrCode.textContent.trim();
                const qrContainer = document.createElement('div');
                qrContainer.id = `qr-visual-${index}`;
                qrContainer.className = 'qr-visual-inline';
                qrContainer.style.cssText = `
                    margin-top: var(--space-8);
                    text-align: center;
                    background: rgba(var(--color-bg-3), 0.5);
                    padding: var(--space-12);
                    border-radius: var(--radius-base);
                    border: 1px dashed var(--color-success);
                `;

                // Insert after the text QR code
                qrCode.parentNode.insertBefore(qrContainer, qrCode.nextSibling);

                // Generate small QR code for the card with text on top
                this.generateVisualQRCode(`qr-visual-${index}`, qrText, {
                    width: 120,
                    height: 120
                });

                // Add symmetric button container for product cards
                this.addSymmetricButtons(qrContainer, `qr-visual-${index}`, qrText, true);
            }
        });
    }

    // Create symmetric button layout
    addSymmetricButtons(parentContainer, qrContainerId, qrText, isSmall = false) {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'qr-button-container';
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-top: 12px;
            flex-wrap: wrap;
        `;

        // Download button
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'qr-action-btn qr-download-btn';
        downloadBtn.textContent = '⬇ Download QR Code';
        downloadBtn.style.cssText = `
            background: var(--color-success, #10b981);
            color: white;
            border: none;
            padding: ${isSmall ? '6px 12px' : '8px 16px'};
            border-radius: var(--radius-base, 6px);
            cursor: pointer;
            font-size: ${isSmall ? '12px' : '14px'};
            font-weight: 500;
            transition: all 0.2s ease;
            min-width: ${isSmall ? '100px' : '120px'};
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
        `;
        downloadBtn.onmouseover = () => {
            downloadBtn.style.background = 'var(--color-primary-hover, #059669)';
            downloadBtn.style.transform = 'translateY(-1px)';
        };
        downloadBtn.onmouseout = () => {
            downloadBtn.style.background = 'var(--color-success, #10b981)';
            downloadBtn.style.transform = 'translateY(0)';
        };
        downloadBtn.onclick = () => this.downloadQRCode(qrContainerId, qrText);

        // Copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'qr-action-btn qr-copy-btn';
        copyBtn.textContent = '📋 Copy Code';
        copyBtn.style.cssText = `
            background: transparent;
            color: var(--color-success, #10b981);
            border: 1px solid var(--color-success, #10b981);
            padding: ${isSmall ? '6px 12px' : '8px 16px'};
            border-radius: var(--radius-base, 6px);
            cursor: pointer;
            font-size: ${isSmall ? '12px' : '14px'};
            font-weight: 500;
            transition: all 0.2s ease;
            min-width: ${isSmall ? '100px' : '120px'};
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
        `;
        copyBtn.onmouseover = () => {
            copyBtn.style.background = 'var(--color-success, #10b981)';
            copyBtn.style.color = 'white';
            copyBtn.style.transform = 'translateY(-1px)';
        };
        copyBtn.onmouseout = () => {
            copyBtn.style.background = 'transparent';
            copyBtn.style.color = 'var(--color-success, #10b981)';
            copyBtn.style.transform = 'translateY(0)';
        };
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(qrText).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✅ Copied!';
                copyBtn.style.background = 'var(--color-success, #10b981)';
                copyBtn.style.color = 'white';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.background = 'transparent';
                    copyBtn.style.color = 'var(--color-success, #10b981)';
                }, 2000);
            }).catch(() => {
                alert('Failed to copy to clipboard');
            });
        };

        buttonContainer.appendChild(downloadBtn);
        buttonContainer.appendChild(copyBtn);
        parentContainer.appendChild(buttonContainer);
    }

    // Enhanced modal show function to display visual QR
    showModalWithVisualQR(title, message, qrText) {
        const modal = document.getElementById('success-modal');
        const modalTitle = modal.querySelector('.modal-header h3');
        const modalBody = modal.querySelector('.modal-body p');
        const qrDisplay = modal.querySelector('.qr-code-text');
        const qrVisualContainer = modal.querySelector('#qr-visual-container');

        if (modalTitle) modalTitle.textContent = title;
        if (modalBody) modalBody.textContent = message;
        if (qrDisplay) qrDisplay.textContent = qrText;

        // Show visual QR container
        if (qrVisualContainer) {
            qrVisualContainer.style.display = 'block';
            qrVisualContainer.innerHTML = ''; // Clear existing content
            
            // Add title for QR section
            const qrTitle = document.createElement('h4');
            qrTitle.textContent = 'QR Code for Product';
            qrTitle.style.cssText = `
                color: var(--color-success);
                margin-bottom: var(--space-12);
                font-size: var(--font-size-md);
            `;
            qrVisualContainer.appendChild(qrTitle);
            
            // Add container for QR code with text on top
            const qrCodeDiv = document.createElement('div');
            qrCodeDiv.id = 'modal-qr-visual';
            qrCodeDiv.style.cssText = `
                display: inline-block;
                background: white;
                padding: var(--space-16);
                border-radius: var(--radius-base);
                margin: var(--space-8) 0;
                border: 1px solid var(--color-border);
            `;
            qrVisualContainer.appendChild(qrCodeDiv);

            // Generate QR code with text display on top
            this.generateVisualQRCode('modal-qr-visual', qrText, {
                width: 200,
                height: 200
            });

            // Add symmetric buttons under QR code
            this.addSymmetricButtons(qrVisualContainer, 'modal-qr-visual', qrText, false);
        }

        modal.classList.remove('hidden');
    }

    // Download QR code as image
    downloadQRCode(containerId, filename = 'qr-code') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const canvas = container.querySelector('canvas');
        if (!canvas) {
            alert('QR code canvas not found. Please regenerate the QR code.');
            return;
        }

        try {
            // Create download link
            const link = document.createElement('a');
            link.download = `${filename.replace(/[^a-z0-9]/gi, '_')}.png`;
            link.href = canvas.toDataURL('image/png');
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading QR code:', error);
            alert('Error downloading QR code. Please try again.');
        }
    }

    // Add QR generation button to forms
    addQRGenerationButtons() {
        const forms = ['farmer-form', 'distributor-form', 'retailer-form'];
        
        forms.forEach(formId => {
            const form = document.getElementById(formId);
            if (!form) return;

            const submitBtn = form.querySelector('button[type="submit"]');
            if (!submitBtn) return;

            // Add QR preview button
            const qrPreviewBtn = document.createElement('button');
            qrPreviewBtn.type = 'button';
            qrPreviewBtn.className = 'btn btn--secondary';
            qrPreviewBtn.textContent = '👁 Preview QR Code';
            qrPreviewBtn.style.marginLeft = 'var(--space-12)';
            
            qrPreviewBtn.onclick = () => {
                const inputs = form.querySelectorAll('input, textarea, select');
                const formData = {};
                inputs.forEach(input => {
                    if (input.name && input.value) {
                        formData[input.name] = input.value;
                    }
                });
                
                const previewText = `PREVIEW-${formId.toUpperCase()}-${Date.now()}`;
                this.showModalWithVisualQR('QR Code Preview', 'This is how your QR code will look:', previewText);
            };

            submitBtn.parentNode.insertBefore(qrPreviewBtn, submitBtn.nextSibling);
        });
    }

    // Integrate with existing app methods
    integrateWithApp() {
        if (!this.app) return;

        // Override showSuccessModal to include visual QR
        const originalShowModal = this.app.showSuccessModal;
        if (originalShowModal) {
            this.app.showSuccessModal = (title, message, qrText) => {
                this.showModalWithVisualQR(title, message, qrText);
            };
        }
    }
}

// Initialize QR Extension when DOM is ready and app is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the main app to be initialized
    const initQRExtension = () => {
        if (window.krishiChainApp) {
            console.log('Initializing QR Code Extension...');
            
            // Create QR extension instance
            const qrExtension = new QRCodeExtension(window.krishiChainApp);
            
            // Wait for QR library to load before integrating
            qrExtension.loadQRCodeLibrary().then(() => {
                qrExtension.integrateWithApp();
                qrExtension.addQRGenerationButtons();
                
                // Store extension globally for access
                window.krishiChainQR = qrExtension;
                
                console.log('QR Code Extension initialized successfully!');
            }).catch(error => {
                console.error('Failed to initialize QR Extension:', error);
            });
        } else {
            // Retry after a short delay if app not ready
            setTimeout(initQRExtension, 100);
        }
    };
    
    // Start initialization
    initQRExtension();
});

// Utility functions for manual QR generation
window.generateQRForText = function(text, containerId = 'qr-container', options = {}) {
    if (window.krishiChainQR) {
        return window.krishiChainQR.generateVisualQRCode(containerId, text, options);
    } else {
        console.error('QR Extension not initialized');
        return null;
    }
};

window.downloadQRCode = function(containerId, filename) {
    if (window.krishiChainQR) {
        window.krishiChainQR.downloadQRCode(containerId, filename);
    } else {
        console.error('QR Extension not initialized');
    }
};