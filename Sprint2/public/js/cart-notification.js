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
        if (!button.closest('form')) {
          e.preventDefault();
          
          // Get item details
          const itemContainer = button.closest('.menu-item') || button.closest('.item-container');
          const itemName = itemContainer.querySelector('.name').textContent;
          const itemPrice = itemContainer.querySelector('.price').textContent;
          
          // Add item to cart via AJAX (this uses the existing backend route)
          const itemId = button.dataset.itemId || button.closest('form').action.split('/').pop().split('?')[0];
          
          fetch(`/items/${itemId}/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            if (response.ok) {
              // Show notification
              showCartNotification(itemName);
            }
          })
          .catch(error => {
            console.error('Error adding to cart:', error);
          });
        } else {
          // For form submission, we'll show the notification after form submits
          setTimeout(() => {
            const itemName = button.closest('form').querySelector('input[name="name"]')?.value || 'Item';
            showCartNotification(itemName);
          }, 100);
        }
      });
    });
  });
  
  // Function to show notification
  function showCartNotification(itemName) {
    const container = document.querySelector('.cart-notification-container');
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <div class="notification-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <div class="notification-content">
        <h4>Added to Cart</h4>
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