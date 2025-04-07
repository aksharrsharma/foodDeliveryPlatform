document.addEventListener('DOMContentLoaded', function() {
  // Check if user is admin
  const isAdmin = document.body.classList.contains('admin-user') || 
                  document.querySelector('.topnav .links ul li a[href="/items/new"]') !== null;
  
  // Only add quantity selectors if not admin
  if (!isAdmin) {
    // Add quantity selectors to menu items
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
      // Don't add if there's already a quantity selector
      if (item.querySelector('.quantity-selector')) return;
      
      // Create quantity selector
      const quantitySelector = document.createElement('div');
      quantitySelector.className = 'quantity-selector';
      quantitySelector.innerHTML = `
        <button type="button" class="quantity-btn decrease">
          <i class="fas fa-minus"></i>
        </button>
        <input type="number" name="quantity" value="1" min="1" max="10" class="quantity-input" readonly>
        <button type="button" class="quantity-btn increase">
          <i class="fas fa-plus"></i>
        </button>
      `;
      
      // Find where to insert the selector
      const priceElement = item.querySelector('.price');
      if (priceElement) {
        priceElement.insertAdjacentElement('afterend', quantitySelector);
      }
      
      // Add event listeners to quantity buttons
      const decreaseBtn = quantitySelector.querySelector('.decrease');
      const increaseBtn = quantitySelector.querySelector('.increase');
      const quantityInput = quantitySelector.querySelector('.quantity-input');
      
      decreaseBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
          quantityInput.value = currentValue - 1;
        }
      });
      
      increaseBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 10) {
          quantityInput.value = currentValue + 1;
        }
      });
      
      // Update form submission to include quantity
      const addToCartForm = item.querySelector('form');
      if (addToCartForm && !addToCartForm.querySelector('.delete-button') && 
          !addToCartForm.action.includes('/edit') && 
          !addToCartForm.action.includes('?_method=PUT')) {
        
        // Remove any existing event listeners by cloning the element
        const newForm = addToCartForm.cloneNode(true);
        addToCartForm.parentNode.replaceChild(newForm, addToCartForm);
        
        newForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const quantity = parseInt(quantityInput.value);
          const itemId = newForm.action.split('/').pop().split('?')[0];
          
          // Just make one request with the quantity
          fetch(newForm.action, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: quantity })
          })
          .then(response => {
            if (response.ok) {
              const itemName = item.querySelector('.name').textContent;
              showCartNotification(itemName, quantity);
              
              // Reset quantity to 1 after adding to cart
              quantityInput.value = 1;
              
              // Redirect to cart page
              window.location.href = '/profile/mycart';
            }
          })
          .catch(error => {
            console.error('Error adding to cart:', error);
          });
        });
      }
    });
    
    // Also add quantity selector to the item detail page
    const itemContainer = document.querySelector('.item-container');
    if (itemContainer && !itemContainer.querySelector('.quantity-selector')) {
      const quantitySelector = document.createElement('div');
      quantitySelector.className = 'quantity-selector';
      quantitySelector.innerHTML = `
        <button type="button" class="quantity-btn decrease">
          <i class="fas fa-minus"></i>
        </button>
        <input type="number" name="quantity" value="1" min="1" max="10" class="quantity-input" readonly>
        <button type="button" class="quantity-btn increase">
          <i class="fas fa-plus"></i>
        </button>
      `;
      
      const priceElement = itemContainer.querySelector('.price');
      if (priceElement) {
        priceElement.insertAdjacentElement('afterend', quantitySelector);
      }
      
      // Add event listeners
      const decreaseBtn = quantitySelector.querySelector('.decrease');
      const increaseBtn = quantitySelector.querySelector('.increase');
      const quantityInput = quantitySelector.querySelector('.quantity-input');
      
      decreaseBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
          quantityInput.value = currentValue - 1;
        }
      });
      
      increaseBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 10) {
          quantityInput.value = currentValue + 1;
        }
      });
      
      // Update form submission - but exclude edit forms
      const addToCartForm = itemContainer.querySelector('form:not([action*="edit"]):not([action*="_method=PUT"])');
      if (addToCartForm && addToCartForm.querySelector('.add-to-cart')) {
        
        // Remove any existing event listeners by cloning the element
        const newForm = addToCartForm.cloneNode(true);
        addToCartForm.parentNode.replaceChild(newForm, addToCartForm);
        
        newForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const quantity = parseInt(quantityInput.value);
          const itemId = newForm.action.split('/').pop().split('?')[0];
          
          fetch(newForm.action, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: quantity })
          })
          .then(response => {
            if (response.ok) {
              const itemName = itemContainer.querySelector('.name').textContent;
              showCartNotification(itemName, quantity);
              
              // Reset quantity to 1 after adding to cart
              quantityInput.value = 1;
              
              // Redirect to cart page
              window.location.href = '/profile/mycart';
            }
          })
          .catch(error => {
            console.error('Error adding to cart:', error);
          });
        });
      }
    }
  }
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
      <p>${quantity} x ${itemName} added to your cart</p>
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