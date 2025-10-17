// Charts, marketplace, planner, notifications, smooth scrolling
document.addEventListener('DOMContentLoaded', function() {
  // Health Chart
  const healthCanvas = document.getElementById('healthChart');
  if (healthCanvas && window.Chart) {
    const healthCtx = healthCanvas.getContext('2d');
    new Chart(healthCtx, {
      type: 'doughnut',
      data: {
        labels: ['Excellent', 'Good', 'Needs Attention'],
        datasets: [{
          data: [60, 30, 10],
          backgroundColor: ['#2E7D32', '#8BC34A', '#F44336'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  // Soil Chart
  const soilCanvas = document.getElementById('soilChart');
  if (soilCanvas && window.Chart) {
    const soilCtx = soilCanvas.getContext('2d');
    new Chart(soilCtx, {
      type: 'bar',
      data: {
        labels: ['Moisture', 'pH Level', 'Nutrients', 'Temperature'],
        datasets: [{
          label: 'Current Levels',
          data: [75, 65, 80, 70],
          backgroundColor: '#2E7D32',
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, max: 100 } }
      }
    });
  }

  // Growth Chart
  const growthCanvas = document.getElementById('growthChart');
  if (growthCanvas && window.Chart) {
    const growthCtx = growthCanvas.getContext('2d');
    new Chart(growthCtx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        datasets: [{
          label: 'Tomatoes',
          data: [10, 25, 40, 60, 75, 90],
          borderColor: '#2E7D32',
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          tension: 0.3,
          fill: true
        }, {
          label: 'Carrots',
          data: [5, 15, 30, 45, 65, 80],
          borderColor: '#8BC34A',
          backgroundColor: 'rgba(139, 195, 74, 0.1)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, max: 100 } }
      }
    });
  }

 
  // Shopping cart state
  let cart = [];
  let currentTool = 'select';

  function initializeMarketplace() {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;

    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <div class="product-image" style="background-color: ${product.color}20; color: ${product.color}">
          <i class="${product.image}"></i>
        </div>
        <div class="product-info">
          <div class="product-name">${product.name}</div>
          <div class="product-seller">by ${product.seller}</div>
          <div class="product-price">$${product.price.toFixed(2)}</div>
          <div class="product-rating"><i class="fas fa-star"></i><span>${product.rating}</span></div>
          <div class="cart-controls">
            <div class="quantity-controls">
              <button class="quantity-btn minus" data-id="${product.id}">-</button>
              <input type="text" class="quantity-input" value="1" data-id="${product.id}" readonly>
              <button class="quantity-btn plus" data-id="${product.id}">+</button>
            </div>
            <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
          </div>
        </div>`;
      productsContainer.appendChild(productCard);
    });

    // Quantity controls
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        const input = document.querySelector(`.quantity-input[data-id="${id}"]`);
        if (!input) return;
        const value = parseInt(input.value);
        if (value > 1) input.value = value - 1;
      });
    });

    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        const input = document.querySelector(`.quantity-input[data-id="${id}"]`);
        if (!input) return;
        const value = parseInt(input.value);
        input.value = value + 1;
      });
    });

    // Add to cart
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        const product = products.find(p => p.id === id);
        const qtyInput = document.querySelector(`.quantity-input[data-id="${id}"]`);
        const quantity = qtyInput ? parseInt(qtyInput.value) : 1;
        addToCart(product, quantity);
      });
    });

    const categoryFilter = document.getElementById('category-filter');
    const locationFilter = document.getElementById('location-filter');
    const sortFilter = document.getElementById('sort-filter');
    if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);
    if (locationFilter) locationFilter.addEventListener('change', filterProducts);
    if (sortFilter) sortFilter.addEventListener('change', sortProducts);
  }

  function filterProducts() {
    const categoryEl = document.getElementById('category-filter');
    const locationEl = document.getElementById('location-filter');
    const category = categoryEl ? categoryEl.value : 'all';
    const location = locationEl ? locationEl.value : 'all';
    document.querySelectorAll('.product-card').forEach(card => {
      const productId = parseInt(card.querySelector('.add-to-cart').getAttribute('data-id'));
      const product = products.find(p => p.id === productId);
      let show = true;
      if (category !== 'all' && product.category !== category) show = false;
      if (location !== 'all' && product.location !== location) show = false;
      card.style.display = show ? 'block' : 'none';
    });
  }

  function sortProducts() {
    const sortEl = document.getElementById('sort-filter');
    if (!sortEl) return;
    const sortBy = sortEl.value;
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;
    const productCards = Array.from(document.querySelectorAll('.product-card'));
    productCards.sort((a, b) => {
      const aId = parseInt(a.querySelector('.add-to-cart').getAttribute('data-id'));
      const bId = parseInt(b.querySelector('.add-to-cart').getAttribute('data-id'));
      const productA = products.find(p => p.id === aId);
      const productB = products.find(p => p.id === bId);
      switch (sortBy) {
        case 'price-low': return productA.price - productB.price;
        case 'price-high': return productB.price - productA.price;
        case 'rating': return productB.rating - productA.rating;
        default: return 0;
      }
    });
    productsContainer.innerHTML = '';
    productCards.forEach(card => productsContainer.appendChild(card));
  }

  function addToCart(product, quantity) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ id: product.id, name: product.name, price: product.price, quantity, image: product.image, color: product.color });
    }
    updateCart();
    showNotification(`${product.name} added to cart!`);
  }

  function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');
    if (!cartItems || !cartTotalPrice) return;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    cartItems.innerHTML = '';
    let totalPrice = 0;
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <div class="cart-item-image" style="background-color: ${item.color}20; color: ${item.color}">
          <i class="${item.image}"></i>
        </div>
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn minus" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn plus" data-id="${item.id}">+</button>
            <button class="btn btn-outline remove-item" data-id="${item.id}" style="margin-left: 10px; padding: 2px 8px;">Remove</button>
          </div>
        </div>`;
      cartItems.appendChild(cartItem);
    });
    cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;

    // Controls
    document.querySelectorAll('.cart-item .quantity-btn.minus').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        const item = cart.find(item => item.id === id);
        if (!item) return;
        if (item.quantity > 1) item.quantity--; else cart = cart.filter(i => i.id !== id);
        updateCart();
      });
    });
    document.querySelectorAll('.cart-item .quantity-btn.plus').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        const item = cart.find(item => item.id === id);
        if (!item) return;
        item.quantity++;
        updateCart();
      });
    });
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        cart = cart.filter(item => item.id !== id);
        updateCart();
      });
    });
  }

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `position: fixed; top: 100px; right: 20px; background-color: var(--primary); color: white; padding: 12px 20px; border-radius: 4px; box-shadow: var(--shadow); z-index: 1002; transition: transform 0.3s, opacity 0.3s;`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  function initializePlanner() {
    const gardenGrid = document.getElementById('garden-grid');
    if (!gardenGrid) return;
    for (let i = 0; i < 80; i++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.setAttribute('data-index', i);
      gardenGrid.appendChild(cell);
    }
    document.querySelectorAll('.tool-item').forEach(tool => {
      tool.addEventListener('click', function() {
        document.querySelectorAll('.tool-item').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        currentTool = this.getAttribute('data-tool');
      });
    });
    document.querySelectorAll('.plant-option').forEach(plant => {
      plant.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', this.getAttribute('data-plant'));
      });
    });
    document.querySelectorAll('.grid-cell').forEach(cell => {
      cell.addEventListener('dragover', e => e.preventDefault());
      cell.addEventListener('drop', function(e) {
        e.preventDefault();
        if (currentTool === 'plant') {
          const plantType = e.dataTransfer.getData('text/plain');
          if (!this.classList.contains('occupied')) {
            this.classList.add('occupied');
            this.innerHTML = `<div class="placed-plant"><i class="${getPlantIcon(plantType)}" style="color: ${getPlantColor(plantType)}"></i><span>${capitalizeFirst(plantType)}</span></div><button class="remove-plant">&times;</button>`;
            this.querySelector('.remove-plant').addEventListener('click', function(ev) {
              ev.stopPropagation();
              cell.classList.remove('occupied');
              cell.innerHTML = '';
            });
          }
        }
      });
      cell.addEventListener('click', function() {
        if (currentTool === 'delete' && this.classList.contains('occupied')) {
          this.classList.remove('occupied');
          this.innerHTML = '';
        }
      });
    });
    const clearBtn = document.getElementById('clear-garden');
    if (clearBtn) clearBtn.addEventListener('click', function() {
      document.querySelectorAll('.grid-cell').forEach(cell => { cell.classList.remove('occupied'); cell.innerHTML = ''; });
    });
    const saveBtn = document.getElementById('save-garden');
    if (saveBtn) saveBtn.addEventListener('click', function() { showNotification('Garden layout saved successfully!'); });
  }

  function getPlantIcon(plantType) {
    const icons = { tomato: 'fas fa-apple-alt', carrot: 'fas fa-carrot', lettuce: 'fas fa-leaf', pepper: 'fas fa-pepper-hot', herbs: 'fas fa-seedling', strawberry: 'fas fa-stroopwafel' };
    return icons[plantType] || 'fas fa-seedling';
  }
  function getPlantColor(plantType) {
    const colors = { tomato: '#2E7D32', carrot: '#8BC34A', lettuce: '#7CB342', pepper: '#2E7D32', herbs: '#8BC34A', strawberry: '#2E7D32' };
    return colors[plantType] || '#2E7D32';
  }
  function capitalizeFirst(string) { return string.charAt(0).toUpperCase() + string.slice(1); }

  // Modal open/close
  const addPlantBtn = document.getElementById('add-plant-btn');
  if (addPlantBtn) addPlantBtn.addEventListener('click', () => { const m = document.getElementById('add-plant-modal'); if (m) m.style.display = 'flex'; });
  const signupBtn = document.getElementById('cta-signup');
  if (signupBtn) signupBtn.addEventListener('click', () => { const m = document.getElementById('signup-modal'); if (m) m.style.display = 'flex'; });
  document.querySelectorAll('.close-modal').forEach(button => {
    button.addEventListener('click', () => { document.querySelectorAll('.modal').forEach(modal => { modal.style.display = 'none'; }); });
  });
  window.addEventListener('click', (e) => { if (e.target.classList && e.target.classList.contains('modal')) e.target.style.display = 'none'; });

  const addPlantForm = document.getElementById('add-plant-form');
  if (addPlantForm) addPlantForm.addEventListener('submit', (e) => { e.preventDefault(); alert('Plant added successfully!'); const m = document.getElementById('add-plant-modal'); if (m) m.style.display = 'none'; });

  // Task completion
  document.querySelectorAll('.task-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const row = this.parentElement && this.parentElement.parentElement;
      if (!row) return;
      if (this.checked) {
        row.style.opacity = '0.6';
        row.style.textDecoration = 'line-through';
      } else {
        row.style.opacity = '1';
        row.style.textDecoration = 'none';
      }
    });
  });

  // Smooth scrolling
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href') || '';
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
      }
    });
  });

  // Initialize optional modules if their elements exist
  initializeMarketplace();
  initializePlanner();
});

// Auth/profile management (relies on firebase-cdn.js exposing FirebaseAuth and firebase)
function updateUserProfile(user) {
  const authLink = document.getElementById('auth-link');
  const userProfileContainer = document.getElementById('user-profile-container');
  const userInitials = document.getElementById('user-initials');
  if (user) {
    if (authLink) authLink.style.display = 'none';
    if (userProfileContainer) userProfileContainer.style.display = 'block';
    const email = user.email || '';
    const displayName = user.displayName || '';
    let initials = '';
    if (displayName) {
      const names = displayName.split(' ');
      initials = names.map(name => name.charAt(0)).join('').substring(0, 2);
    } else if (email) {
      initials = email.substring(0, 2);
    }
    if (userInitials) userInitials.textContent = initials.toUpperCase();
    createProfileDropdown(user);
  } else {
    if (authLink) authLink.style.display = 'block';
    if (userProfileContainer) userProfileContainer.style.display = 'none';
  }
}

function createProfileDropdown(user) {
  const profileContainer = document.getElementById('user-profile-container');
  const profileIcon = document.getElementById('user-profile-icon');
  if (!profileContainer || !profileIcon) return;
  const existingDropdown = profileContainer.querySelector('.profile-dropdown');
  if (existingDropdown) existingDropdown.remove();
  const dropdown = document.createElement('div');
  dropdown.className = 'profile-dropdown';
  dropdown.innerHTML = `
    <div class="profile-dropdown-item">
      <div class="user-email">${user.email}</div>
      <div style="font-size: 12px; color: #999;">Signed in</div>
    </div>
    <div class="profile-dropdown-item logout-btn" onclick="handleLogout()">
      <i class="fas fa-sign-out-alt" style="margin-right: 8px;"></i>Sign out
    </div>`;
  profileContainer.appendChild(dropdown);
  profileIcon.addEventListener('click', function(e) { e.stopPropagation(); dropdown.classList.toggle('show'); });
  document.addEventListener('click', function() { dropdown.classList.remove('show'); });
}

async function handleLogout() {
  try {
    if (window.FirebaseAuth && FirebaseAuth.signOutUser) {
      const result = await FirebaseAuth.signOutUser();
      if (result.success) { updateUserProfile(null); } else { alert('Error logging out. Please try again.'); }
    }
  } catch (error) {
    console.error('Logout error:', error);
    alert('Error logging out. Please try again.');
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  try {
    if (window.FirebaseAuth && FirebaseAuth.initializeAuth) {
      await FirebaseAuth.initializeAuth();
      if (window.firebase && firebase.auth) {
        firebase.auth().onAuthStateChanged((user) => { updateUserProfile(user); });
      }
    }
  } catch (error) {
    console.error('Authentication initialization error:', error);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  // Constants from the Java program
  const VEGETATION_PER_PLANT = 3.7;
  const FERTILIZER_COVERAGE_PER_AREA = 35;
  const SEEDS_COVERAGE_PER_AREA = 75;
  const CROPS_PER_AREA = 16.2;
  const SERVINGS_PER_DAY = 3.0;

  // DOM Elements
  const farmingOptions = document.querySelectorAll('.farming-option');
  const cropFarmingSection = document.getElementById('crop-farming');
  const fishFarmingSection = document.getElementById('fish-farming');
  const cropResults = document.getElementById('crop-results');
  const calculateBtn = document.getElementById('calculate-btn');

  // Input fields
  const lengthInput = document.getElementById('length');
  const widthInput = document.getElementById('width');
  const populationInput = document.getElementById('population');
  const seedsCostInput = document.getElementById('seeds-cost');
  const fertilizerCostInput = document.getElementById('fertilizer-cost');

  // Error messages
  const lengthError = document.getElementById('length-error');
  const widthError = document.getElementById('width-error');
  const populationError = document.getElementById('population-error');
  const seedsError = document.getElementById('seeds-error');
  const fertilizerError = document.getElementById('fertilizer-error');

  // Result elements
  const resultArea = document.getElementById('result-area');
  const resultPlants = document.getElementById('result-plants');
  const resultVegetation = document.getElementById('result-vegetation');
  const resultDays = document.getElementById('result-days');
  const resultSeedsNeeded = document.getElementById('result-seeds-needed');
  const resultSeedsCost = document.getElementById('result-seeds-cost');
  const resultFertilizersNeeded = document.getElementById('result-fertilizers-needed');
  const resultFertilizersCost = document.getElementById('result-fertilizers-cost');
  const resultTotal = document.getElementById('result-total');

  // Farming type selection
  farmingOptions.forEach(option => {
    option.addEventListener('click', () => {
      farmingOptions.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');

      const type = option.getAttribute('data-type');

      if (type === 'crop') {
        if (cropFarmingSection) cropFarmingSection.classList.add('active');
        if (fishFarmingSection) fishFarmingSection.classList.remove('active');
        if (cropResults) cropResults.classList.remove('active');
      } else {
        if (cropFarmingSection) cropFarmingSection.classList.remove('active');
        if (fishFarmingSection) fishFarmingSection.classList.add('active');
        if (cropResults) cropResults.classList.remove('active');
      }
    });
  });

  // Validation functions
  function validateInput(input, errorElement) {
    const value = parseFloat(input.value);
    if (isNaN(value) || value <= 0) {
      if (errorElement) errorElement.style.display = 'block';
      if (input) input.style.borderColor = '#f44336';
      return false;
    } else {
      if (errorElement) errorElement.style.display = 'none';
      if (input) input.style.borderColor = '#4caf50';
      return true;
    }
  }

  // Input validation on change
  if (lengthInput) lengthInput.addEventListener('input', () => validateInput(lengthInput, lengthError));
  if (widthInput) widthInput.addEventListener('input', () => validateInput(widthInput, widthError));
  if (populationInput) populationInput.addEventListener('input', () => validateInput(populationInput, populationError));
  if (seedsCostInput) seedsCostInput.addEventListener('input', () => validateInput(seedsCostInput, seedsError));
  if (fertilizerCostInput) fertilizerCostInput.addEventListener('input', () => validateInput(fertilizerCostInput, fertilizerError));

  // Calculate button click
  if (calculateBtn) {
    calculateBtn.addEventListener('click', () => {
      // Validate all inputs
      const isLengthValid = validateInput(lengthInput, lengthError);
      const isWidthValid = validateInput(widthInput, widthError);
      const isPopulationValid = validateInput(populationInput, populationError);
      const isSeedsCostValid = validateInput(seedsCostInput, seedsError);
      const isFertilizerCostValid = validateInput(fertilizerCostInput, fertilizerError);

      if (isLengthValid && isWidthValid && isPopulationValid && isSeedsCostValid && isFertilizerCostValid) {
        // Get input values
        const length = parseFloat(lengthInput.value);
        const width = parseFloat(widthInput.value);
        const population = parseInt(populationInput.value);
        const seedsCost = parseFloat(seedsCostInput.value);
        const fertilizerCost = parseFloat(fertilizerCostInput.value);

        // Calculations (based on Java program logic)
        const area = length * width;
        const crops = Math.floor(area * CROPS_PER_AREA);

        // Random environmental issues between 4% and 20%
        const environmentalIssues = (4 + Math.floor(Math.random() * 17)) / 100.0;
        const deadPlants = Math.floor(crops * environmentalIssues);
        const totalPlants = crops - deadPlants;
        const vegetation = Math.floor(totalPlants * VEGETATION_PER_PLANT);
        const servings = population * SERVINGS_PER_DAY;
        const days = Math.floor(vegetation / servings);

        // Cost calculations
        const seedsNeeded = Math.ceil(area / SEEDS_COVERAGE_PER_AREA);
        const totalSeedCosts = seedsCost * seedsNeeded;

        const fertilizersNeeded = Math.ceil(area / FERTILIZER_COVERAGE_PER_AREA);
        const totalFertCosts = fertilizerCost * fertilizersNeeded;

        const totalAmount = totalSeedCosts + totalFertCosts;

        // Format currency
        const formatCurrency = (amount) => `R ${amount.toFixed(2)}`;

        // Update results
        if (resultArea) resultArea.textContent = `${area.toFixed(2)} m²`;
        if (resultPlants) resultPlants.textContent = totalPlants;
        if (resultVegetation) resultVegetation.textContent = vegetation;
        if (resultDays) resultDays.textContent = `${days} days`;
        if (resultSeedsNeeded) resultSeedsNeeded.textContent = seedsNeeded;
        if (resultSeedsCost) resultSeedsCost.textContent = formatCurrency(totalSeedCosts);
        if (resultFertilizersNeeded) resultFertilizersNeeded.textContent = fertilizersNeeded;
        if (resultFertilizersCost) resultFertilizersCost.textContent = formatCurrency(totalFertCosts);
        if (resultTotal) resultTotal.textContent = formatCurrency(totalAmount);

        // Show results
        if (cropResults) cropResults.classList.add('active');

        // Scroll to results
        if (cropResults) cropResults.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});
