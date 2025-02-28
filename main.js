// Initialize products from localStorage or use default products
let products = JSON.parse(localStorage.getItem('products')) || [
    {
        id: 1,
        name: "Classic Black T-Shirt",
        price: 349,
        image: "images/product1.jpg",
        description: "Premium quality cotton t-shirt in classic black"
    },
    {
        id: 2,
        name: "White Graphic T-Shirt",
        price: 399,
        image: "images/product2.jpg",
        description: "Comfortable white t-shirt with modern graphic design"
    },
    {
        id: 3,
        name: "Navy Blue Polo",
        price: 449,
        image: "images/product3.jpg",
        description: "Stylish navy blue polo shirt for a smart casual look"
    },
    {
        id: 4,
        name: "Red Printed T-Shirt",
        price: 379,
        image: "images/product4.jpg",
        description: "Vibrant red t-shirt with trendy printed design"
    },
    {
        id: 5,
        name: "Grey Melange T-Shirt",
        price: 329,
        image: "images/product5.jpg",
        description: "Soft and comfortable grey melange t-shirt"
    },
    {
        id: 6,
        name: "Striped Polo T-Shirt",
        price: 469,
        image: "images/product6.jpg",
        description: "Elegant striped polo t-shirt for a casual look"
    }
];

// Initialize orders array from localStorage
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// DOM Elements
const productGrid = document.querySelector('.product-grid');
const orderModal = document.getElementById('orderModal');
const orderForm = document.getElementById('orderForm');
const closeBtn = document.querySelector('.close');
const productIdInput = document.getElementById('productId');

// Display products on page load
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    
    // Add event listeners
    closeBtn.addEventListener('click', closeModal);
    orderForm.addEventListener('submit', placeOrder);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === orderModal) {
            closeModal();
        }
    });
});

// Display products in the grid
function displayProducts() {
    productGrid.innerHTML = '';
    
    // Get latest products from localStorage
    products = JSON.parse(localStorage.getItem('products')) || products;
    
    if (products.length === 0) {
        productGrid.innerHTML = '<p class="no-products">No products available at the moment.</p>';
        return;
    }
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card fade-in';
        
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
        
        productCard.innerHTML = `
            <div class="product-image-container">
                <img src="${imageSrc}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'" class="product-image">
                <div class="image-overlay"></div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <span class="price">৳${product.price}</span>
                <p>${product.description || ''}</p>
                <button class="glow-button order-btn" data-id="${product.id}">Order Now</button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
        
        // Add event listener to order button
        productCard.querySelector('.order-btn').addEventListener('click', () => {
            openOrderModal(product.id);
        });
        
        // Add event listener to product image for larger view
        productCard.querySelector('.product-image-container').addEventListener('click', () => {
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
                <button class="glow-button order-modal-btn" data-id="${product.id}">Order Now</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listener to close button
    modal.querySelector('.close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Add event listener to order button
    modal.querySelector('.order-modal-btn').addEventListener('click', () => {
        document.body.removeChild(modal);
        openOrderModal(product.id);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Open order modal for a specific product
function openOrderModal(productId) {
    productIdInput.value = productId;
    orderModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Close the modal
function closeModal() {
    orderModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
    orderForm.reset();
}

// Place an order
function placeOrder(e) {
    e.preventDefault();
    
    const productId = parseInt(productIdInput.value);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showNotification('Product not found!', 'error');
        return;
    }
    
    const order = {
        id: Date.now(),
        productId: productId,
        productName: product.name,
        price: product.price,
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        date: new Date().toLocaleString(),
        status: 'Pending'
    };
    
    // Add order to array and save to localStorage
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Show success notification
    showNotification('Order placed successfully!', 'success');
    
    // Close modal and reset form
    closeModal();
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    if (type === 'success') {
        notification.style.backgroundColor = 'var(--success-color)';
    } else {
        notification.style.backgroundColor = 'var(--error-color)';
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
