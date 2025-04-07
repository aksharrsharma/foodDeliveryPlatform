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
      if (addToCartForm && !addToCartForm.action.includes('/edit') && !addToCartForm.action.includes('?_method=PUT')) {
        addToCartForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const quantity = parseInt(quantityInput.value);
          const itemId = addToCartForm.action.split('/').pop().split('?')[0];
          
          // We need to call the add to cart endpoint multiple times based on quantity
          const requests = [];
          for (let i = 0; i < quantity; i++) {
            requests.push(
              fetch(addToCartForm.action, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                }
              })
            );
          }
          
          Promise.all(requests)
            .then(() => {
              const itemName = item.querySelector('.name').textContent;
              showCartNotification(itemName, quantity);
              
              // Reset quantity to 1 after adding to cart
              quantityInput.value = 1;
              
              // Update the cart badge
              updateCartBadge();
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
      const forms = itemContainer.querySelectorAll('form');
      forms.forEach(form => {
        // Skip edit forms
        if (form.action.includes('/edit') || form.action.includes('?_method=PUT') || form.classList.contains('edit-form')) {
          return;
        }
        
        // Only handle add to cart forms
        if (form.querySelector('.add-to-cart')) {
          form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const quantity = parseInt(quantityInput.value);
            const itemId = form.action.split('/').pop().split('?')[0];
            
            const requests = [];
            for (let i = 0; i < quantity; i++) {
              requests.push(
                fetch(form.action, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                })
              );
            }
            
            Promise.all(requests)
              .then(() => {
                const itemName = itemContainer.querySelector('.name').textContent;
                showCartNotification(itemName, quantity);
                
                // Reset quantity to 1 after adding to cart
                quantityInput.value = 1;
                
                // Update the cart badge
                updateCartBadge();
              })
              .catch(error => {
                console.error('Error adding to cart:', error);
              });
          });
        }
      });
    }
  }
});

/**
 * Updated cart-notification.js
 * - Skip edit buttons and forms
 */
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is admin
  const isAdmin = document.body.classList.contains('admin-user') || 
                 document.querySelector('.topnav .links ul li a[href="/items/new"]') !== null;

  // Only set up cart functionality for non-admins
  if (!isAdmin) {
    // Create notification element if it doesn't exist
    if (!document.querySelector('.cart-notification-container')) {
      const notificationContainer = document.createElement('div');
      notificationContainer.className = 'cart-notification-container';
      document.body.appendChild(notificationContainer);
    }
  
    // Add event listeners to all add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn, .add-to-cart');
    
    addToCartButtons.forEach(button => {
      // Skip if inside an edit form
      if (button.closest('form[action*="edit"]') || 
          button.closest('form[action*="_method=PUT"]') ||
          button.closest('.edit-form')) {
        return;
      }
      
      button.addEventListener('click', function(e) {
        if (!button.closest('form')) {
          e.preventDefault();
          
          // Get item details
          const itemContainer = button.closest('.menu-item') || button.closest('.item-container');
          const itemName = itemContainer.querySelector('.name').textContent;
          
          // Add item to cart via AJAX
          const itemId = button.dataset.itemId || button.closest('a').href.split('/').pop().split('?')[0];
          
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
              
              // Update cart badge
              updateCartBadge();
            }
          })
          .catch(error => {
            console.error('Error adding to cart:', error);
          });
        }
      });
    });
  }
});