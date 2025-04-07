// Cart notification functionality
document.addEventListener('DOMContentLoaded', function() {
  // Create notification element if it doesn't exist
  if (!document.querySelector('.cart-notification-container')) {
    const notificationContainer = document.createElement('div');
    notificationContainer.className = 'cart-notification-container';
    document.body.appendChild(notificationContainer);
  }

  // Add event listeners to all add to cart buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn, .add-to-cart');
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Skip if button is already being handled by a form or another handler
      if (button.dataset.handlerAttached === 'true') return;
      
      // Mark this button as having a handler attached
      button.dataset.handlerAttached = 'true';
      
      // Only handle clicks on buttons that are not part of a form submission
      if (!button.closest('form') || e.preventDefault) {
        e.preventDefault();
        
        // Get item details
        const itemContainer = button.closest('.menu-item') || button.closest('.item-container');
        const itemName = itemContainer ? itemContainer.querySelector('.name').textContent : 'Item';
        
        // Add item to cart via AJAX (this uses the existing backend route)
        const itemId = button.dataset.itemId || 
                      (button.closest('a') ? button.closest('a').href.split('/').pop() : null) ||
                      (button.closest('form') ? button.closest('form').action.split('/').pop().split('?')[0] : null);
        
        if (itemId) {
          fetch(`/items/${itemId}/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: 1 })
          })
          .then(response => {
            if (response.ok) {
              // Show notification with the item name
              showCartNotification(itemName);
              
              // Wait briefly then reload the page to update cart count
              setTimeout(() => {
                window.location.href = '/profile/mycart';
              }, 1000);
            } else {
              console.error('Error response from server');
            }
          })
          .catch(error => {
            console.error('Error adding to cart:', error);
          });
        }
      }
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
      <p>${itemName} has been added to your cart</p>
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