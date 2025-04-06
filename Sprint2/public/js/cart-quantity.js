document.addEventListener('DOMContentLoaded', function() {
  const cartItems = document.querySelectorAll('.cart-item');
  
  cartItems.forEach(item => {
    const decreaseBtn = item.querySelector('.decrease');
    const increaseBtn = item.querySelector('.increase');
    const quantityEl = item.querySelector('.quantity-value');
    const itemPrice = parseFloat(item.querySelector('.item-price')?.textContent.replace('$', '')) || 0;
    const subtotalElement = item.querySelector('.item-subtotal');
    const itemId = item.dataset.itemId;
    
    if (!decreaseBtn || !increaseBtn || !quantityEl || !subtotalElement || !itemId) return;
    
    // Update subtotal text with correct formatting
    function updateSubtotal(quantity) {
      const subtotal = itemPrice * quantity;
      subtotalElement.textContent = '$' + subtotal.toFixed(2);
      
      // Also update the cart total
      updateCartTotal();
    }
    
    // Handle decrease button click
    decreaseBtn.addEventListener('click', function() {
      let currentQuantity = parseInt(quantityEl.textContent);
      if (currentQuantity > 1) {
        currentQuantity--;
        quantityEl.textContent = currentQuantity;
        updateSubtotal(currentQuantity);
        
        // Call API to update cart
        updateCartItemQuantity(itemId, 'decrease');
      }
    });
    
    // Handle increase button click
    increaseBtn.addEventListener('click', function(e) {
      // Prevent the default action to avoid multiple handlers
      e.stopPropagation();
      
      let currentQuantity = parseInt(quantityEl.textContent);
      if (currentQuantity < 10) {
        currentQuantity++;
        quantityEl.textContent = currentQuantity;
        updateSubtotal(currentQuantity);
        
        // Call API to update cart
        updateCartItemQuantity(itemId, 'increase');
      }
    });
  });
  
  // Update cart badge on page load
  updateCartBadge();
});

// Update cart total when quantity changes
function updateCartTotal() {
  const subtotalElements = document.querySelectorAll('.item-subtotal');
  if (subtotalElements.length === 0) return;
  
  let total = 0;
  subtotalElements.forEach(element => {
    const amount = parseFloat(element.textContent.replace('$', '')) || 0;
    total += amount;
  });
  
  const taxRate = 0.08; // 8% tax
  const tax = total * taxRate;
  const finalTotal = total + tax;
  
  // Update the display
  const subtotalDisplay = document.querySelector('.subtotal .amount');
  const taxDisplay = document.querySelector('.tax .amount');
  const totalDisplay = document.querySelector('.total .amount');
  
  if (subtotalDisplay) subtotalDisplay.textContent = '$' + total.toFixed(2);
  if (taxDisplay) taxDisplay.textContent = '$' + tax.toFixed(2);
  if (totalDisplay) totalDisplay.textContent = '$' + finalTotal.toFixed(2);
  
  // Update cart badge count if exists
  updateCartBadge();
}

// Function to update cart item quantity on the server
function updateCartItemQuantity(itemId, action) {
  // This should match your backend route for updating cart
  const url = action === 'increase' 
    ? `/items/${itemId}/orders` 
    : `/items/${itemId}/orders?_method=DELETE`;
  
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .catch(error => {
    console.error('Error updating cart:', error);
  });
}

// Update cart badge count
function updateCartBadge() {
  const cartBadge = document.querySelector('.cart-badge');
  if (!cartBadge) return;
  
  // For cart page
  const cartItems = document.querySelectorAll('.cart-item');
  if (cartItems.length > 0) {
    let totalItems = 0;
    cartItems.forEach(item => {
      const quantityElement = item.querySelector('.quantity-value');
      if (quantityElement) {
        totalItems += parseInt(quantityElement.textContent);
      } else {
        totalItems += 1; // Default to 1 if quantity element not found
      }
    });
    
    cartBadge.setAttribute('data-count', totalItems);
    cartBadge.classList.add('has-items');
    return;
  }
  
  // For other pages, call API to get cart count
  fetch('/profile/mycart/count')
    .then(response => {
      if (response.ok) return response.json();
      return { count: 0 };
    })
    .then(data => {
      if (data.count > 0) {
        cartBadge.setAttribute('data-count', data.count);
        cartBadge.classList.add('has-items');
      } else {
        cartBadge.setAttribute('data-count', '0');
        cartBadge.classList.remove('has-items');
      }
    })
    .catch(error => {
      console.error('Error getting cart count:', error);
      cartBadge.setAttribute('data-count', '0');
      cartBadge.classList.remove('has-items');
    });
}