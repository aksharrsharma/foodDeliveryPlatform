// Cart notification functionality
document.addEventListener('DOMContentLoaded', function() {
  // Create notification container if it doesn't exist
  if (!document.querySelector('.cart-notification-container')) {
    const notificationContainer = document.createElement('div');
    notificationContainer.className = 'cart-notification-container';
    document.body.appendChild(notificationContainer);
  }

  // Update cart badge count
  updateCartBadge();

  // Add event listeners to all add to cart forms
  const addToCartForms = document.querySelectorAll('form[action*="/orders"]');
  
  addToCartForms.forEach(form => {
    // Skip if this form is for deleting (has DELETE method)
    if (form.action.includes('_method=DELETE')) return;
    
    form.addEventListener('submit', function(e) {
      e.preventDefault(); // Prevent form submission
      
      // Get item details
      const itemContainer = form.closest('.menu-item') || form.closest('.item-container');
      const itemName = itemContainer ? itemContainer.querySelector('.name').textContent : 'Item';
      const itemId = form.action.split('/').pop().split('?')[0];
      
      // Get quantity if available
      const quantityInput = itemContainer ? itemContainer.querySelector('.quantity-input') : null;
      const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
      
      // Add item to cart via fetch API
      fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: quantity })
      })
      .then(response => {
        if (response.ok) {
          // Show notification
          showCartNotification(itemName, quantity);
          
          // Reset quantity input to 1 if it exists
          if (quantityInput) {
            quantityInput.value = 1;
          }
          
          // Update cart badge
          updateCartBadge();
        } else {
          console.error('Error response from server');
        }
      })
      .catch(error => {
        console.error('Error adding to cart:', error);
      });
    });
  });
  
  // Also handle standalone add-to-cart buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn, button.add-to-cart');
  
  addToCartButtons.forEach(button => {
    // Skip if button is inside a form we already handled
    if (button.closest('form[action*="/orders"]')) return;
    
    button.addEventListener('click', function(e) {
      if (!button.dataset.itemId) return;
      
      e.preventDefault();
      
      // Get item details
      const itemContainer = button.closest('.menu-item') || button.closest('.item-container');
      const itemName = itemContainer ? itemContainer.querySelector('.name').textContent : 'Item';
      const itemId = button.dataset.itemId;
      
      // Get quantity if available
      const quantityInput = itemContainer ? itemContainer.querySelector('.quantity-input') : null;
      const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
      
      // Add item to cart via fetch API
      fetch(`/items/${itemId}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: quantity })
      })
      .then(response => {
        if (response.ok) {
          // Show notification
          showCartNotification(itemName, quantity);
          
          // Reset quantity input to 1 if it exists
          if (quantityInput) {
            quantityInput.value = 1;
          }
          
          // Update cart badge
          updateCartBadge();
        } else {
          console.error('Error response from server');
        }
      })
      .catch(error => {
        console.error('Error adding to cart:', error);
      });
    });
  });
  
  // Handle remove from cart buttons
  const removeButtons = document.querySelectorAll('form[action*="_method=DELETE"] button');
  
  removeButtons.forEach(button => {
    const form = button.closest('form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          // If we're on the cart page, reload to update the cart view
          if (window.location.pathname.includes('/mycart')) {
            window.location.reload();
          } else {
            // Update cart badge
            updateCartBadge();
          }
        }
      })
      .catch(error => {
        console.error('Error removing from cart:', error);
      });
    });
  });
});

// Function to show notification
function showCartNotification(itemName, quantity = 1) {
  const container = document.querySelector('.cart-notification-container');
  if (!container) return;
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.innerHTML = `
    <div class="notification-icon">
      <i class="fas fa-check-circle"></i>
    </div>
    <div class="notification-content">
      <p>${quantity > 1 ? quantity + ' x ' : ''}${itemName} added to your cart</p>
    </div>
    <button class="notification-close">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Add notification to container
  container.appendChild(notification);
  
  // Add close button event listener
  notification.querySelector('.notification-close').addEventListener('click', function() {
    notification.classList.add('notification-hiding');
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
  
  // Auto remove notification after 5 seconds
  setTimeout(() => {
    notification.classList.add('notification-hiding');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
  
  // Show notification with animation
  setTimeout(() => {
    notification.classList.add('notification-visible');
  }, 10);
}

// Function to update cart badge count
function updateCartBadge() {
  const cartBadge = document.querySelector('.cart-badge');
  if (!cartBadge) return;
  
  // Call API to get current cart count
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
    });
}