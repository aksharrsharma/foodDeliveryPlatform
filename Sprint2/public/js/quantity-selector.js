document.addEventListener('DOMContentLoaded', function() {
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
      if (addToCartForm) {
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
      
      // Update form submission
      const addToCartForm = itemContainer.querySelector('form');
      if (addToCartForm) {
        addToCartForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const quantity = parseInt(quantityInput.value);
          const itemId = addToCartForm.action.split('/').pop().split('?')[0];
          
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
    }
  });