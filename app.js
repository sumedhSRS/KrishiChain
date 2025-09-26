// KrishiChain Application JavaScript - Enhanced Version with Fixed Navigation

class KrishiChainApp {
  constructor() {
    this.currentPage = 'home';
    this.currentProduct = null;
    this.init();
  }

  init() {
    this.initSampleData();
    this.setupNavigation();
    this.setupHomePageCards();
    this.setupForms();
    this.setupModalHandlers();
    this.loadFarmerProducts();
    
    // Initialize the home page as active
    this.navigateToPage('home');
  }

  // Initialize with sample data
  initSampleData() {
    if (!localStorage.getItem('krishichain-products')) {
      const sampleProducts = [
        {
          qr: 'QR-RICE001',
          stage: 'customer',
          farmer: {
            productName: 'Basmati Rice',
            quantity: '100kg',
    
            farmLocation: 'Punjab',
            harvestDate: '2025-09-15',
            farmerName: 'Rajesh Kumar'
          },
          distributor: {
            distributorName: 'Punjab Grains Ltd',
            storageLocation: 'Delhi Warehouse',
            productRating: 5,
            transportDate: '2025-09-17'
          },
          retailer: {
            shopName: 'Fresh Mart',
            finalPrice: 120,
            retailLocation: 'Mumbai Central'
          },
          timestamp: Date.now()
        },
        {
          qr: 'QR-WHEAT002', 
          stage: 'retailer',
          farmer: {
            productName: 'Wheat',
            quantity: '200kg',
    
            farmLocation: 'Haryana',
            harvestDate: '2025-09-10',
            farmerName: 'Priya Sharma'
          },
          distributor: {
            distributorName: 'Haryana Distributors',
            storageLocation: 'Gurgaon Hub',
            productRating: 4,
            transportDate: '2025-09-12'
          },
          timestamp: Date.now()
        }
      ];
      localStorage.setItem('krishichain-products', JSON.stringify(sampleProducts));
    }
  }

  // Setup home page card navigation - Fixed
  setupHomePageCards() {
    const homeCards = document.querySelectorAll('.home-card');
    homeCards.forEach(card => {
      const clickHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const role = card.getAttribute('data-role');
        if (role) {
          this.navigateToPage(role);
        }
      };
      
      card.addEventListener('click', clickHandler);
      
      // Also handle button clicks within cards
      const button = card.querySelector('.card-button');
      if (button) {
        button.addEventListener('click', clickHandler);
      }
    });

    // Setup back to home buttons - Fixed
    const backToHomeButtons = document.querySelectorAll('.back-to-home');
    backToHomeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.navigateToPage('home');
      });
    });
  }

  // Navigation handling - Fixed
  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const targetPage = link.getAttribute('data-page');
        if (targetPage) {
          this.navigateToPage(targetPage);
        }
      });
    });

    // Setup brand navigation to home
    const navBrand = document.querySelector('.nav-brand');
    if (navBrand) {
      navBrand.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.navigateToPage('home');
      });
      navBrand.style.cursor = 'pointer';
    }
  }

  // Fixed navigation method
  navigateToPage(pageName) {
    console.log('Navigating to:', pageName);
    
    // Update navigation active state
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    
    const activeNavLink = document.querySelector(`[data-page="${pageName}"]`);
    if (activeNavLink) {
      activeNavLink.classList.add('active');
    }

    // Update page visibility - Fixed logic
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
  }

  // Form setup - Enhanced and Fixed
  setupForms() {
    // Farmer form - Fixed
    const farmerForm = document.getElementById('farmer-form');
    if (farmerForm) {
      farmerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleFarmerSubmission();
      });
    }

    // Distributor form
    const distributorForm = document.getElementById('distributor-form');
    if (distributorForm) {
      distributorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleDistributorSubmission();
      });
    }

    // Retailer form  
    const retailerForm = document.getElementById('retailer-form');
    if (retailerForm) {
      retailerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
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

  // Generate QR code
  generateQR(prefix = 'QR') {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = prefix + '-';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Get products from localStorage
  getProducts() {
    try {
      const products = localStorage.getItem('krishichain-products');
      return products ? JSON.parse(products) : [];
    } catch (e) {
      console.error('Error parsing products:', e);
      return [];
    }
  }

  // Save products to localStorage
  saveProducts(products) {
    try {
      localStorage.setItem('krishichain-products', JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products:', e);
    }
  }

  
  // Helper function to display star rating
  getStarRating(rating) {
    const stars = '⭐'.repeat(rating);
    const ratingText = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating];
    return `${stars} (${ratingText})`;
  }

  // Handle farmer form submission - Fixed
  handleFarmerSubmission() {
    console.log('Handling farmer submission');
    
    // Get form values
    const productName = document.getElementById('product-name')?.value?.trim();
    const quantity = document.getElementById('quantity')?.value?.trim();
    const farmLocation = document.getElementById('farm-location')?.value?.trim();
    const harvestDate = document.getElementById('harvest-date')?.value?.trim();

    // Validate inputs
    if (!productName || !quantity || !farmLocation || !harvestDate) {
      alert('Please fill in all fields');
      return;
    }

    const formData = {
      productName: productName,
      quantity: quantity,
      farmLocation: farmLocation,
      harvestDate: harvestDate,
      farmerName: 'Current Farmer'
    };

    const qr = this.generateQR('FARM');
    const products = this.getProducts();
    
    const newProduct = {
      qr: qr,
      stage: 'farmer',
      farmer: formData,
      timestamp: Date.now()
    };

    products.push(newProduct);
    this.saveProducts(products);

    // Show success modal
    this.showSuccessModal('Product Registered Successfully!', 
      'Your produce has been added to the blockchain. Share this QR code with distributors:', qr);

    // Reset form and reload products
    const form = document.getElementById('farmer-form');
    if (form) {
      form.reset();
    }
    this.loadFarmerProducts();
  }

  // Load farmer products - Fixed
  loadFarmerProducts() {
    const products = this.getProducts();
    const farmerProducts = products.filter(p => p.stage === 'farmer');
    const container = document.getElementById('farmer-products');

    if (!container) return;

    if (farmerProducts.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📦</div>
          <p>No products registered yet. Use the form to register your first produce.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = farmerProducts.map(product => `
      <div class="product-item">
        <div class="product-header">
          <h4 class="product-title">${product.farmer.productName}</h4>
          <div class="qr-code-display">${product.qr}</div>
        </div>
        <div class="product-details">
          <div class="product-detail"><strong>Quantity:</strong> <span>${product.farmer.quantity}</span></div>
          <div class="product-detail"><strong>Location:</strong> <span>${product.farmer.farmLocation}</span></div>
          <div class="product-detail"><strong>Harvest Date:</strong> <span>${product.farmer.harvestDate}</span></div>
        </div>
      </div>
    `).join('');
  }

  // Scan farmer QR - Enhanced
  scanFarmerQR() {
    const qrInput = document.getElementById('farmer-qr');
    if (!qrInput) return;
    
    const qr = qrInput.value.trim();
    if (!qr) {
      alert('Please enter a QR code');
      return;
    }

    const products = this.getProducts();
    const product = products.find(p => p.qr === qr && p.stage === 'farmer');

    if (!product) {
      alert('Invalid QR code or product not found');
      return;
    }

    this.currentProduct = product;
    const detailsDiv = document.getElementById('farmer-details');
    if (detailsDiv) {
      detailsDiv.innerHTML = `
        <div class="alert alert-success">✅ Valid farmer product found!</div>
        <div class="journey-stage">
          <div class="stage-header">
            <h4 class="stage-title">👨‍🌾 Farmer Details</h4>
          </div>
          <div class="stage-details">
            <div class="stage-detail"><strong>Product:</strong> <span>${product.farmer.productName}</span></div>
            <div class="stage-detail"><strong>Quantity:</strong> <span>${product.farmer.quantity}</span></div>
            
            <div class="stage-detail"><strong>Farm Location:</strong> <span>${product.farmer.farmLocation}</span></div>
            <div class="stage-detail"><strong>Harvest Date:</strong> <span>${product.farmer.harvestDate}</span></div>
            <div class="stage-detail"><strong>Farmer:</strong> <span>${product.farmer.farmerName}</span></div>
          </div>
        </div>
      `;
      detailsDiv.classList.remove('hidden');
    }

    // Enable distributor form
    const submitBtn = document.querySelector('#distributor-form button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
    }
  }

  // Handle distributor submission - Enhanced
  handleDistributorSubmission() {
    if (!this.currentProduct) {
      alert('Please scan a farmer QR code first');
      return;
    }

    const distributorName = document.getElementById('distributor-name')?.value?.trim();
    const storageLocation = document.getElementById('storage-location')?.value?.trim();
    const productRating = document.getElementById('product-rating')?.value?.trim();
    const transportDate = document.getElementById('transport-date')?.value?.trim();

    if (!distributorName || !storageLocation || !productRating || !transportDate) {
      alert('Please fill in all fields');
      return;
    }

    const distributorData = {
      distributorName: distributorName,
      storageLocation: storageLocation,
      productRating: parseInt(productRating),
      transportDate: transportDate
    };

    const products = this.getProducts();
    const productIndex = products.findIndex(p => p.qr === this.currentProduct.qr);
    
    if (productIndex !== -1) {
      const newQR = this.generateQR('DIST');
      products[productIndex].distributor = distributorData;
      products[productIndex].stage = 'distributor';
      products[productIndex].qr = newQR;
      
      this.saveProducts(products);
      
      this.showSuccessModal('Distribution Added!', 
        'Product updated with distribution details. New QR code for retailers:', newQR);

      // Reset form and UI
      const form = document.getElementById('distributor-form');
      if (form) form.reset();
      
      const farmerDetails = document.getElementById('farmer-details');
      if (farmerDetails) {
        farmerDetails.classList.add('hidden');
      }
      const farmerQrInput = document.getElementById('farmer-qr');
      if (farmerQrInput) farmerQrInput.value = '';
      
      const submitBtn = document.querySelector('#distributor-form button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
      }
      this.currentProduct = null;
    }
  }

  // Scan distributor QR - Enhanced  
  scanDistributorQR() {
    const qrInput = document.getElementById('distributor-qr');
    if (!qrInput) return;
    
    const qr = qrInput.value.trim();
    if (!qr) {
      alert('Please enter a QR code');
      return;
    }

    const products = this.getProducts();
    const product = products.find(p => p.qr === qr && p.stage === 'distributor');

    if (!product) {
      alert('Invalid QR code or product not found');
      return;
    }

    this.currentProduct = product;
    const journeyDiv = document.getElementById('product-journey');
    if (journeyDiv) {
      journeyDiv.innerHTML = `
        <div class="alert alert-success">✅ Valid distributor product found!</div>
        
        <div class="journey-stage">
          <div class="stage-header">
            <h4 class="stage-title">👨‍🌾 Origin - Farmer</h4>
          </div>
          <div class="stage-details">
            <div class="stage-detail"><strong>Product:</strong> <span>${product.farmer.productName}</span></div>
            <div class="stage-detail"><strong>Quantity:</strong> <span>${product.farmer.quantity}</span></div>
            
            <div class="stage-detail"><strong>Farm Location:</strong> <span>${product.farmer.farmLocation}</span></div>
            <div class="stage-detail"><strong>Harvest Date:</strong> <span>${product.farmer.harvestDate}</span></div>
            <div class="stage-detail"><strong>Farmer:</strong> <span>${product.farmer.farmerName}</span></div>
          </div>
        </div>

        <div class="journey-stage">
          <div class="stage-header">
            <h4 class="stage-title">🚚 Current Stage - Distributor</h4>
          </div>
          <div class="stage-details">
            <div class="stage-detail"><strong>Distributor:</strong> <span>${product.distributor.distributorName}</span></div>
            <div class="stage-detail"><strong>Storage:</strong> <span>${product.distributor.storageLocation}</span></div>
            <div class="stage-detail"><strong>Product Rating:</strong> <span>${this.getStarRating(product.distributor.productRating)}</span></div>
            <div class="stage-detail"><strong>Transport Date:</strong> <span>${product.distributor.transportDate}</span></div>
          </div>
        </div>
      `;
      journeyDiv.classList.remove('hidden');
    }

    // Enable retailer form
    const submitBtn = document.querySelector('#retailer-form button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
    }
  }

  // Handle retailer submission - Enhanced
  handleRetailerSubmission() {
    if (!this.currentProduct) {
      alert('Please scan a distributor QR code first');
      return;
    }

    const shopName = document.getElementById('shop-name')?.value?.trim();
    const finalPriceValue = document.getElementById('final-price')?.value?.trim();
    const retailLocation = document.getElementById('retail-location')?.value?.trim();

    if (!shopName || !finalPriceValue || !retailLocation) {
      alert('Please fill in all fields');
      return;
    }

    const retailerData = {
      shopName: shopName,
      finalPrice: parseFloat(finalPriceValue),
      retailLocation: retailLocation
    };

    const products = this.getProducts();
    const productIndex = products.findIndex(p => p.qr === this.currentProduct.qr);
    
    if (productIndex !== -1) {
      const newQR = this.generateQR('FINAL');
      products[productIndex].retailer = retailerData;
      products[productIndex].stage = 'customer';
      products[productIndex].qr = newQR;
      
      this.saveProducts(products);
      
      this.showSuccessModal('Ready for Customers!', 
        'Product is now ready for customer verification. Final QR code:', newQR);

      // Reset form and UI
      const form = document.getElementById('retailer-form');
      if (form) form.reset();
      
      const productJourney = document.getElementById('product-journey');
      if (productJourney) {
        productJourney.classList.add('hidden');
      }
      const distributorQrInput = document.getElementById('distributor-qr');
      if (distributorQrInput) distributorQrInput.value = '';
      
      const submitBtn = document.querySelector('#retailer-form button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
      }
      this.currentProduct = null;
    }
  }

  // Verify product for customers - Updated with Product Breakdown and Ratings
verifyProduct() {
  const qrInput = document.getElementById('customer-qr');
  if (!qrInput) return;
  
  const qr = qrInput.value.trim();
  if (!qr) {
    alert('Please enter a QR code');
    return;
  }

  const products = this.getProducts();
  const product = products.find(p => p.qr === qr && p.stage === 'customer');

  if (!product) {
    alert('Invalid QR code or product not found');
    return;
  }

  const resultDiv = document.getElementById('verification-result');
  const journeyDiv = document.getElementById('complete-journey');

  if (!resultDiv || !journeyDiv) return;

  const finalPrice = product.retailer.finalPrice;
  const productRating = product.distributor.productRating || 5;

  journeyDiv.innerHTML = `
    <div class="journey-stage">
      <div class="stage-header">
        <h4 class="stage-title">👨‍🌾 Farm Origin</h4>
        <div class="status status--success">Verified</div>
      </div>
      <div class="stage-details">
        <div class="stage-detail"><strong>Product:</strong> <span>${product.farmer.productName}</span></div>
        <div class="stage-detail"><strong>Quantity:</strong> <span>${product.farmer.quantity}</span></div>
        <div class="stage-detail"><strong>Farm Location:</strong> <span>${product.farmer.farmLocation}</span></div>
        <div class="stage-detail"><strong>Harvest Date:</strong> <span>${product.farmer.harvestDate}</span></div>
        <div class="stage-detail"><strong>Farmer:</strong> <span>${product.farmer.farmerName}</span></div>
      </div>
    </div>

    <div class="journey-stage">
      <div class="stage-header">
        <h4 class="stage-title">🚚 Distribution</h4>
        <div class="status status--success">Verified</div>
      </div>
      <div class="stage-details">
        <div class="stage-detail"><strong>Distributor:</strong> <span>${product.distributor.distributorName}</span></div>
        <div class="stage-detail"><strong>Storage:</strong> <span>${product.distributor.storageLocation}</span></div>
        <div class="stage-detail"><strong>Product Rating:</strong> <span>${this.getStarRating(productRating)}</span></div>
        <div class="stage-detail"><strong>Transport Date:</strong> <span>${product.distributor.transportDate}</span></div>
      </div>
    </div>

    <div class="journey-stage">
      <div class="stage-header">
        <h4 class="stage-title">🏪 Retail</h4>
        <div class="status status--success">Verified</div>
      </div>
      <div class="stage-details">
        <div class="stage-detail"><strong>Shop:</strong> <span>${product.retailer.shopName}</span></div>
        <div class="stage-detail"><strong>Location:</strong> <span>${product.retailer.retailLocation}</span></div>
        <div class="stage-detail"><strong>Final Price:</strong> <span>₹${finalPrice}</span></div>
      </div>
    </div>

    <div class="price-breakdown">
      <h4>📊 Product Breakdown</h4>
      <div class="price-item">
        <span>Product Quality:</span>
        <span>${this.getStarRating(productRating)}</span>
      </div>
      <div class="price-item total">
        <span>Final Price:</span>
        <span>₹${finalPrice}</span>
      </div>
    </div>

    <div class="map-placeholder">
      🗺️ Journey Map: ${product.farmer.farmLocation} → ${product.distributor.storageLocation} → ${product.retailer.retailLocation}
    </div>
  `;

  resultDiv.classList.remove('hidden');
}


  // Show success modal - Enhanced
  showSuccessModal(title, message, qr) {
    const modal = document.getElementById('success-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const qrDisplay = document.getElementById('qr-display');
    
    if (!modal || !modalTitle || !modalMessage || !qrDisplay) return;
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    if (qr) {
      qrDisplay.innerHTML = `
        <div class="qr-code-text">${qr}</div>
        <p style="margin-top: 8px; font-size: 12px; color: var(--color-text-secondary);">
          Copy this QR code for the next stage
        </p>
      `;
    } else {
      qrDisplay.innerHTML = '';
    }
    
    modal.classList.remove('hidden');
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing KrishiChain app with bilingual branding...');
  window.krishiChainApp = new KrishiChainApp();
});
