
// KrishiChain Application JavaScript - Backend Integrated Version
class KrishiChainApp {
    constructor() {
        this.currentPage = 'home';
        this.currentUser = null;
        this.apiBase = 'https://krishichainbackend-production.up.railway.app/api';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupHomePageCards();
        this.setupForms();
        this.setupModalHandlers();
        this.checkAuthStatus();
        this.navigateToPage('home');
    }

    // Check if user is authenticated
    async checkAuthStatus() {
        try {
            const response = await fetch(`${this.apiBase}/health`);
            if (response.ok) {
                console.log('Backend connection successful');
            }
        } catch (error) {
            console.warn('Backend not connected, using localStorage fallback');
            this.initSampleData(); // Fallback to localStorage if backend not available
        }
    }

    // Fallback sample data for when backend is not available
    initSampleData() {
        if (!localStorage.getItem('krishichain-products')) {
            const sampleProducts = [
                {
                    qr: 'QR-RICE001',
                    stage: 'customer',
                    farmer: {
                        productName: 'Basmati Rice',
                        quantity: '100kg',
                        farmerPrice: 80,
                        farmLocation: 'Punjab',
                        harvestDate: '2025-09-15',
                        farmerName: 'Rajesh Kumar'
                    },
                    distributor: {
                        distributorName: 'Punjab Grains Ltd',
                        storageLocation: 'Delhi Warehouse',
                        distributorMargin: 15,
                        transportDate: '2025-09-17'
                    },
                    retailer: {
                        shopName: 'Fresh Mart',
                        finalPrice: 120,
                        retailLocation: 'Mumbai Central'
                    },
                    timestamp: Date.now()
                }
            ];
            localStorage.setItem('krishichain-products', JSON.stringify(sampleProducts));
        }
    }

    // API call wrapper
    async apiCall(endpoint, method = 'GET', data = null) {
        try {
            const config = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include' // For session cookies
            };

            if (data) {
                config.body = JSON.stringify(data);
            }

            const response = await fetch(`${this.apiBase}${endpoint}`, config);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'API request failed');
            }

            return result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Navigation setup
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = link.getAttribute('data-page');
                if (targetPage) {
                    this.navigateToPage(targetPage);
                }
            });
        });

        const navBrand = document.querySelector('.nav-brand');
        if (navBrand) {
            navBrand.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToPage('home');
            });
        }
    }

    // Setup home page cards
    setupHomePageCards() {
        const homeCards = document.querySelectorAll('.home-card');
        homeCards.forEach(card => {
            const clickHandler = (e) => {
                e.preventDefault();
                const role = card.getAttribute('data-role');
                if (role) {
                    this.navigateToPage(role);
                }
            };
            card.addEventListener('click', clickHandler);

            const button = card.querySelector('.card-button');
            if (button) {
                button.addEventListener('click', clickHandler);
            }
        });

        const backToHomeButtons = document.querySelectorAll('.back-to-home');
        backToHomeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToPage('home');
            });
        });
    }

    // Navigation method
    navigateToPage(pageName) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const activeNavLink = document.querySelector(`[data-page="${pageName}"]`);
        if (activeNavLink) {
            activeNavLink.classList.add('active');
        }

        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });

        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.style.display = 'block';
        }

        this.currentPage = pageName;

        // Load dashboard data for specific roles
        if (['farmer', 'distributor', 'retailer'].includes(pageName)) {
            this.loadDashboard(pageName);
        }
    }

    // Load dashboard data
    async loadDashboard(role) {
        try {
            const data = await this.apiCall(`/dashboard/${role}`);
            this.displayDashboardData(role, data.products);
        } catch (error) {
            console.warn('Using fallback data for dashboard');
            this.loadFallbackDashboard(role);
        }
    }

    // Display dashboard data
    displayDashboardData(role, products) {
        const container = document.getElementById(`${role}-products`);
        if (!container) return;

        if (products.length === 0) {
            container.innerHTML = `
                <div class="no-products">
                    <p>No products found. Register your first product!</p>
                </div>
            `;
            return;
        }

        const productsHtml = products.map(product => {
            if (role === 'farmer') {
                return `
                    <div class="product-card">
                        <h4>${product.product_name}</h4>
                        <p><strong>QR Code:</strong> ${product.qr_code}</p>
                        <p><strong>Quantity:</strong> ${product.quantity}</p>
                        <p><strong>Price:</strong> ₹${product.farmer_price}/kg</p>
                        <p><strong>Harvest Date:</strong> ${product.harvest_date}</p>
                        <div class="qr-code">${product.qr_code}</div>
                    </div>
                `;
            } else if (role === 'distributor') {
                return `
                    <div class="product-card">
                        <h4>${product.product_name}</h4>
                        <p><strong>QR Code:</strong> ${product.qr_code}</p>
                        <p><strong>Distributor:</strong> ${product.distributor_name}</p>
                        <p><strong>Storage:</strong> ${product.storage_location}</p>
                        <p><strong>Transport Date:</strong> ${product.transport_date}</p>
                    </div>
                `;
            } else if (role === 'retailer') {
                return `
                    <div class="product-card">
                        <h4>${product.product_name}</h4>
                        <p><strong>QR Code:</strong> ${product.qr_code}</p>
                        <p><strong>Shop:</strong> ${product.shop_name}</p>
                        <p><strong>Final Price:</strong> ₹${product.final_price}</p>
                        <p><strong>Location:</strong> ${product.retail_location}</p>
                    </div>
                `;
            }
            return '';
        }).join('');

        container.innerHTML = productsHtml;
    }

    // Setup forms
    setupForms() {
        // Farmer form
        const farmerForm = document.getElementById('farmer-form');
        if (farmerForm) {
            farmerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFarmerSubmission();
            });
        }

        // Distributor form
        const distributorForm = document.getElementById('distributor-form');
        if (distributorForm) {
            distributorForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleDistributorSubmission();
            });
        }

        // Retailer form
        const retailerForm = document.getElementById('retailer-form');
        if (retailerForm) {
            retailerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRetailerSubmission();
            });
        }

        // QR scanning buttons
        const scanFarmerBtn = document.getElementById('scan-farmer-qr');
        if (scanFarmerBtn) {
            scanFarmerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scanFarmerQR();
            });
        }

        const scanDistributorBtn = document.getElementById('scan-distributor-qr');
        if (scanDistributorBtn) {
            scanDistributorBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scanDistributorQR();
            });
        }

        const verifyBtn = document.getElementById('verify-product');
        if (verifyBtn) {
            verifyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.verifyProduct();
            });
        }
    }

    // Handle farmer form submission
    async handleFarmerSubmission() {
        const formData = {
            product_name: document.getElementById('product-name')?.value?.trim(),
            quantity: document.getElementById('quantity')?.value?.trim(),
            farmer_price: parseFloat(document.getElementById('farmer-price')?.value?.trim()),
            farm_location: document.getElementById('farm-location')?.value?.trim(),
            harvest_date: document.getElementById('harvest-date')?.value?.trim(),
            category: 'Grains', // Default category
            unit: 'kg'
        };

        if (!formData.product_name || !formData.quantity || !formData.farmer_price || 
            !formData.farm_location || !formData.harvest_date) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const result = await this.apiCall('/farmer/register-product', 'POST', formData);

            this.showSuccessModal(
                'Product Registered Successfully!',
                'Your produce has been added to the blockchain. Share this QR code with distributors:',
                result.qr_code
            );

            document.getElementById('farmer-form').reset();
            this.loadDashboard('farmer');

        } catch (error) {
            alert('Error registering product: ' + error.message);
        }
    }

    // Handle distributor form submission
    async handleDistributorSubmission() {
        const qrCode = document.getElementById('distributor-qr-input')?.value?.trim();

        const formData = {
            qr_code: qrCode,
            distributor_name: document.getElementById('distributor-name')?.value?.trim(),
            storage_location: document.getElementById('storage-location')?.value?.trim(),
            distributor_margin: parseFloat(document.getElementById('distributor-margin')?.value?.trim()),
            transport_date: document.getElementById('transport-date')?.value?.trim(),
            transport_method: 'Standard Truck'
        };

        if (!qrCode || !formData.distributor_name || !formData.storage_location || 
            !formData.distributor_margin || !formData.transport_date) {
            alert('Please fill in all fields');
            return;
        }

        try {
            await this.apiCall('/distributor/add-record', 'POST', formData);

            this.showSuccessModal(
                'Distributor Record Added!',
                'Product has been updated in the supply chain.',
                qrCode
            );

            document.getElementById('distributor-form').reset();
            this.loadDashboard('distributor');

        } catch (error) {
            alert('Error adding distributor record: ' + error.message);
        }
    }

    // Handle retailer form submission
    async handleRetailerSubmission() {
        const qrCode = document.getElementById('retailer-qr-input')?.value?.trim();

        const formData = {
            qr_code: qrCode,
            shop_name: document.getElementById('shop-name')?.value?.trim(),
            final_price: parseFloat(document.getElementById('final-price')?.value?.trim()),
            retail_location: document.getElementById('retail-location')?.value?.trim()
        };

        if (!qrCode || !formData.shop_name || !formData.final_price || !formData.retail_location) {
            alert('Please fill in all fields');
            return;
        }

        try {
            await this.apiCall('/retailer/add-record', 'POST', formData);

            this.showSuccessModal(
                'Retailer Record Added!',
                'Product is now ready for customers.',
                qrCode
            );

            document.getElementById('retailer-form').reset();
            this.loadDashboard('retailer');

        } catch (error) {
            alert('Error adding retailer record: ' + error.message);
        }
    }

    // Verify product
    async verifyProduct() {
        const qrCode = document.getElementById('verify-qr-input')?.value?.trim();

        if (!qrCode) {
            alert('Please enter a QR code');
            return;
        }

        try {
            const result = await this.apiCall(`/verify-product/${qrCode}`);
            this.displayProductVerification(result);

        } catch (error) {
            alert('Error verifying product: ' + error.message);
        }
    }

    // Display product verification results
    displayProductVerification(data) {
        const container = document.getElementById('verification-result');
        if (!container) return;

        let html = `
            <div class="verification-success">
                <h3>✅ Product Verified: ${data.product_name}</h3>
                <p><strong>QR Code:</strong> ${data.qr_code}</p>
                <p><strong>Current Stage:</strong> ${data.current_stage}</p>
                <p><strong>Category:</strong> ${data.category}</p>
            </div>
        `;

        if (data.farmer) {
            html += `
                <div class="supply-stage">
                    <h4>🌾 Farmer Details</h4>
                    <p><strong>Farmer:</strong> ${data.farmer.farmer_name}</p>
                    <p><strong>Quantity:</strong> ${data.farmer.quantity} ${data.farmer.unit}</p>
                    <p><strong>Price:</strong> ₹${data.farmer.farmer_price}/${data.farmer.unit}</p>
                    <p><strong>Location:</strong> ${data.farmer.farm_location}</p>
                    <p><strong>Harvest Date:</strong> ${data.farmer.harvest_date}</p>
                    <p><strong>Method:</strong> ${data.farmer.farming_method}</p>
                </div>
            `;
        }

        if (data.distributor) {
            html += `
                <div class="supply-stage">
                    <h4>🚚 Distributor Details</h4>
                    <p><strong>Company:</strong> ${data.distributor.distributor_name}</p>
                    <p><strong>Storage:</strong> ${data.distributor.storage_location}</p>
                    <p><strong>Margin:</strong> ₹${data.distributor.distributor_margin}</p>
                    <p><strong>Transport Date:</strong> ${data.distributor.transport_date}</p>
                </div>
            `;
        }

        if (data.retailer) {
            html += `
                <div class="supply-stage">
                    <h4>🏪 Retailer Details</h4>
                    <p><strong>Shop:</strong> ${data.retailer.shop_name}</p>
                    <p><strong>Final Price:</strong> ₹${data.retailer.final_price}</p>
                    <p><strong>Location:</strong> ${data.retailer.retail_location}</p>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    // QR scanning simulation
    scanFarmerQR() {
        const input = prompt('Enter Farmer QR Code:');
        if (input) {
            document.getElementById('distributor-qr-input').value = input;
        }
    }

    scanDistributorQR() {
        const input = prompt('Enter Distributor QR Code:');
        if (input) {
            document.getElementById('retailer-qr-input').value = input;
        }
    }

    // Modal handlers
    setupModalHandlers() {
        const modal = document.getElementById('success-modal');
        const closeBtn = document.querySelector('.modal-close');

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (modal) {
                    modal.classList.add('hidden');
                }
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        }
    }

    // Show success modal
    showSuccessModal(title, message, qrCode) {
        const modal = document.getElementById('success-modal');
        const titleEl = modal?.querySelector('.modal-title');
        const messageEl = modal?.querySelector('.modal-message');
        const qrDisplay = modal?.querySelector('.qr-display');

        if (titleEl) titleEl.textContent = title;
        if (messageEl) messageEl.textContent = message;
        if (qrDisplay && qrCode) {
            qrDisplay.innerHTML = `<div class="qr-code">${qrCode}</div>`;
        } else if (qrDisplay) {
            qrDisplay.innerHTML = '';
        }

        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    // Fallback methods for when backend is not available
    loadFallbackDashboard(role) {
        // Use the existing localStorage implementation as fallback
        if (role === 'farmer') {
            this.loadFarmerProducts();
        }
    }

    loadFarmerProducts() {
        const products = this.getProducts();
        const farmerProducts = products.filter(p => p.stage === 'farmer');
        const container = document.getElementById('farmer-products');

        if (!container) return;

        if (farmerProducts.length === 0) {
            container.innerHTML = `
                <div class="no-products">
                    <p>No products registered yet. Use the form to register your first produce.</p>
                </div>
            `;
        } else {
            const productsHtml = farmerProducts.map(product => `
                <div class="product-card">
                    <h4>${product.farmer.productName}</h4>
                    <p><strong>QR Code:</strong> ${product.qr}</p>
                    <p><strong>Quantity:</strong> ${product.farmer.quantity}</p>
                    <p><strong>Price:</strong> ₹${product.farmer.farmerPrice}/kg</p>
                    <p><strong>Harvest Date:</strong> ${product.farmer.harvestDate}</p>
                    <div class="qr-code">${product.qr}</div>
                </div>
            `).join('');

            container.innerHTML = productsHtml;
        }
    }

    // Fallback localStorage methods
    getProducts() {
        try {
            const products = localStorage.getItem('krishichain-products');
            return products ? JSON.parse(products) : [];
        } catch (e) {
            console.error('Error parsing products:', e);
            return [];
        }
    }

    saveProducts(products) {
        try {
            localStorage.setItem('krishichain-products', JSON.stringify(products));
        } catch (e) {
            console.error('Error saving products:', e);
        }
    }

    generateQR(prefix = 'QR') {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = prefix + '-';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing KrishiChain app with backend integration...');
    window.krishiChainApp = new KrishiChainApp();
});
