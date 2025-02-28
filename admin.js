// Mock admin credentials (replace with proper authentication in production)
const ADMIN_CREDENTIALS = {
    username: 'arafatislam',
    password: 'arafat2468'
};

// Store products and orders in localStorage for demo purposes
let products = JSON.parse(localStorage.getItem('products')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// DOM Elements
const loginForm = document.getElementById('loginForm');
const adminDashboard = document.getElementById('adminDashboard');
const addProductForm = document.getElementById('addProductForm');
const productList = document.getElementById('productList');
const orderList = document.getElementById('orderList');
const logoutBtn = document.getElementById('logoutBtn');

// Handle Login
document.getElementById('adminLogin').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Set login state
        localStorage.setItem('isLoggedIn', 'true');
        
        // Show dashboard
        loginForm.style.display = 'none';
        adminDashboard.style.display = 'block';
        
        // Load dashboard data
        loadDashboard();
    } else {
        alert('Invalid credentials! Please try again.');
    }
});

// Handle Logout
logoutBtn.addEventListener('click', () => {
    loginForm.style.display = 'block';
    adminDashboard.style.display = 'none';
    document.getElementById('adminLogin').reset();
    localStorage.setItem('isLoggedIn', 'false');
});

// Add Product
addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productDescription = document.getElementById('productDescription').value;
    const productImage = document.getElementById('productImage').files[0];

    try {
        // Convert image to base64 for demo purposes
        const base64Image = await convertToBase64(productImage);

        const newProduct = {
            id: Date.now(),
            name: productName,
            price: parseFloat(productPrice),
            description: productDescription || '',
            image: base64Image
        };

        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        
        addProductForm.reset();
        displayProducts();
        
        // Update dashboard stats
        loadDashboard();
        
        // Reset form title to "Add New Product"
        resetAddProductForm();
        
        // Show success message
        alert('Product added successfully!');
    } catch (error) {
        console.error('Error adding product:', error);
        alert('Failed to add product. Please try again.');
    }
});

// Convert image to base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Display products in admin panel
function displayProducts() {
    productList.innerHTML = '';
    
    // Update total products count
    document.getElementById('totalProducts').textContent = products.length;
    
    if (products.length === 0) {
        productList.innerHTML = '<p class="no-products">No products available. Add your first product!</p>';
        return;
    }
    
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item fade-in';
        
        // Handle missing image with a placeholder
        let imageSrc = 'images/placeholder.jpg';
        try {
            if (product.image && product.image.startsWith('data:image')) {
                imageSrc = product.image;
            } else if (product.image) {
                imageSrc = product.image;
            }
        } catch (error) {
            console.error('Error with product image:', error);
        }
        
        productItem.innerHTML = `
            <div class="product-image-container">
                <img src="${imageSrc}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                <div class="image-overlay"></div>
            </div>
            <div class="product-item-info">
                <h3>${product.name}</h3>
                <span class="price">৳${product.price}</span>
                <p>${product.description || ''}</p>
                <div class="product-item-actions">
                    <button class="edit-btn" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${product.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
        
        productList.appendChild(productItem);
        
        // Add event listeners to buttons
        productItem.querySelector('.delete-btn').addEventListener('click', () => {
            deleteProduct(product.id);
        });
        
        productItem.querySelector('.edit-btn').addEventListener('click', () => {
            editProduct(product.id);
        });
        
        // Add event listener for viewing larger image
        productItem.querySelector('.product-image-container').addEventListener('click', () => {
            showLargerImage(product);
        });
    });
}

// Show larger image in a modal
function showLargerImage(product) {
    // Create modal dynamically
    const modal = document.createElement('div');
    modal.className = 'modal image-modal';
    modal.style.display = 'block';
    
    // Handle missing image with a placeholder
    let imageSrc = 'images/placeholder.jpg';
    try {
        if (product.image && product.image.startsWith('data:image')) {
            imageSrc = product.image;
        } else if (product.image) {
            imageSrc = product.image;
        }
    } catch (error) {
        console.error('Error with product image:', error);
    }
    
    modal.innerHTML = `
        <div class="modal-content image-modal-content fade-in">
            <span class="close">&times;</span>
            <div class="large-image-container">
                <img src="${imageSrc}" alt="${product.name}" class="large-product-image">
            </div>
            <div class="product-details">
                <h2>${product.name}</h2>
                <span class="price">৳${product.price}</span>
                <p>${product.description || ''}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listener to close button
    modal.querySelector('.close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Display Orders
function displayOrders() {
    orderList.innerHTML = orders.map(order => `
        <div class="order-item fade-in">
            <h4>Order #${order.id}</h4>
            <div class="order-details">
                <p><strong>Customer:</strong> ${order.name}</p>
                <p><strong>Phone:</strong> ${order.phone}</p>
                <p><strong>Address:</strong> ${order.address}</p>
                <p><strong>Product:</strong> ${order.productName}</p>
                <p><strong>Price:</strong> ৳${order.price}</p>
            </div>
        </div>
    `).join('');
}

// Delete Product
function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        // Convert id to number if it's a string
        id = typeof id === 'string' ? parseInt(id) : id;
        
        products = products.filter(product => product.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        displayProducts();
        
        // Update dashboard stats
        document.getElementById('totalProducts').textContent = products.length;
        
        // Show success message
        alert('Product deleted successfully!');
    }
}

// Edit Product
function editProduct(id) {
    // Convert id to number if it's a string
    id = typeof id === 'string' ? parseInt(id) : id;
    
    const product = products.find(p => p.id === id);
    if (product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productDescription').value = product.description || '';
        
        // Scroll to the add product form
        document.querySelector('.admin-section:nth-child(2)').scrollIntoView({ behavior: 'smooth' });
        
        // Add a message to indicate editing mode
        const formTitle = document.querySelector('.admin-section:nth-child(2) h2');
        formTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Product';
        
        // Remove the product and let the user add the updated version
        products = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        displayProducts();
        
        // Show message
        alert('Please update the product details and submit the form to save changes.');
    }
}

// Reset Add Product Form
function resetAddProductForm() {
    const formTitle = document.querySelector('.admin-section:nth-child(2) h2');
    formTitle.innerHTML = '<i class="fas fa-plus-circle"></i> Add New Product';
    addProductForm.reset();
}

// Load Dashboard
function loadDashboard() {
    // Refresh products and orders from localStorage
    products = JSON.parse(localStorage.getItem('products')) || [];
    orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Update stats
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalOrders').textContent = orders.length;
    
    // Display products and orders
    displayProducts();
    displayOrders();
}

// Initialize
if (localStorage.getItem('isLoggedIn') === 'true') {
    loginForm.style.display = 'none';
    adminDashboard.style.display = 'block';
    loadDashboard();
}

// Add event listener for reset form button
document.getElementById('resetFormBtn').addEventListener('click', () => {
    resetAddProductForm();
});
