// Cart notification functionality
document.addEventListener('DOMContentLoaded', function() {
  // Create notification container if it doesn't exist
  if (!document.querySelector('.cart-notification-container')) {
    const notificationContainer = document.createElement('div');
    notificationContainer.className = 'cart-notification-container';
    document.body.appendChild(notificationContainer);
  }

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
      
      // Submit form using fetch API
      fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          // Show notification with item name
          showCartNotification(itemName);
          
          // Redirect to the same page after a short delay
          setTimeout(() => {
            window.location.href = window.location.href;
          }, 1000);
        } else {
          console.error('Error response from server');
        }
      })
      .catch(error => {
        console.error('Error adding to cart:', error);
      });
    });
  });
  
  // Also handle standalone add-to-cart buttons that aren't in forms
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
      
      // Add item to cart via fetch API
      fetch(`/items/${itemId}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          // Show notification with item name
          showCartNotification(itemName);
        } else {
          console.error('Error response from server');
        }
      })
      .catch(error => {
        console.error('Error adding to cart:', error);
      });
    });
  });
});

// Function to show notification
function showCartNotification(itemName) {
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
      <p>${itemName} added to your cart</p>
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