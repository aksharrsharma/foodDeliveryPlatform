/**
 * Enhanced Collapsible Components for Silver Spoon Restaurant
 * 
 * This script improves the collapsible elements on the receipt and transaction pages
 * by adding smooth animations, visual indicators, and improved UX.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all collapsible elements
    initCollapsibles();
    
    // Initialize the cart quantity buttons if they exist
    initCartQuantityButtons();
    
    // Initialize transaction details toggles
    initTransactionDetails();
  });
  
  /**
   * Initialize collapsible elements with improved animation and styling
   */
  function initCollapsibles() {
    const collapsibles = document.querySelectorAll('.collapsible');
    
    collapsibles.forEach(collapsible => {
      // Set initial state (first item open by default if desired)
      const content = collapsible.nextElementSibling;
      
      // Add click event listener
      collapsible.addEventListener('click', function() {
        this.classList.toggle('active');
        
        const content = this.nextElementSibling;
        
        if (content.style.maxHeight) {
          content.style.maxHeight = null;
          content.classList.remove('active');
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
          content.classList.add('active');
        }
      });
    });
  }
  
  /**
   * Initialize cart quantity buttons
   */
  function initCartQuantityButtons() {
    const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
    const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
    
    if (!decreaseButtons.length && !increaseButtons.length) return;
    
    // Decrease quantity
    decreaseButtons.forEach(button => {
      button.addEventListener('click', function() {
        const cartItem = this.closest('.cart-item');
        if (!cartItem) return;
        
        const itemId = cartItem.dataset.itemId;
        const quantityElement = this.nextElementSibling;
        if (!quantityElement) return;
        
        let quantity = parseInt(quantityElement.textContent);
        
        if (quantity > 1) {
          quantity--;
          quantityElement.textContent = quantity;
          updateSubtotal(cartItem, quantity);
          updateCartTotal();
          
          // Send AJAX request to update cart
          if (itemId) {
            updateCartItem(itemId, 'decrease');
          }
        }
      });
    });
    
    // Increase quantity
    increaseButtons.forEach(button => {
      button.addEventListener('click', function() {
        const cartItem = this.closest('.cart-item');
        if (!cartItem) return;
        
        const itemId = cartItem.dataset.itemId;
        const quantityElement = this.previousElementSibling;
        if (!quantityElement) return;
        
        let quantity = parseInt(quantityElement.textContent);
        
        quantity++;
        quantityElement.textContent = quantity;
        updateSubtotal(cartItem, quantity);
        updateCartTotal();
        
        // Send AJAX request to update cart
        if (itemId) {
          updateCartItem(itemId, 'increase');
        }
      });
    });
  }
  
  /**
   * Update subtotal for an item
   */
  function updateSubtotal(cartItem, quantity) {
    const priceElement = cartItem.querySelector('.item-price');
    const subtotalElement = cartItem.querySelector('.item-subtotal');
    
    if (!priceElement || !subtotalElement) return;
    
    const price = parseFloat(priceElement.textContent.replace('$', ''));
    
    const subtotal = price * quantity;
    subtotalElement.textContent = '$' + subtotal.toFixed(2);
  }
  
  /**
   * Update total cart amount
   */
  function updateCartTotal() {
    const subtotalElements = document.querySelectorAll('.item-subtotal');
    const subtotalDisplay = document.querySelector('.subtotal .amount');
    const taxDisplay = document.querySelector('.tax .amount');
    const totalDisplay = document.querySelector('.total .amount');
    
    if (!subtotalElements.length || !subtotalDisplay || !taxDisplay || !totalDisplay) return;
    
    let total = 0;
    
    subtotalElements.forEach(element => {
      total += parseFloat(element.textContent.replace('$', ''));
    });
    
    const tax = total * 0.08;
    const finalTotal = total + tax;
    
    subtotalDisplay.textContent = '$' + total.toFixed(2);
    taxDisplay.textContent = '$' + tax.toFixed(2);
    totalDisplay.textContent = '$' + finalTotal.toFixed(2);
  }
  
  /**
   * Update cart item through AJAX request
   */
  function updateCartItem(itemId, action) {
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
  
  /**
   * Initialize transaction details toggles for admin pages
   */
  function initTransactionDetails() {
    const transactionHeaders = document.querySelectorAll('.transaction-header');
    
    transactionHeaders.forEach(header => {
      header.addEventListener('click', function() {
        const details = this.nextElementSibling;
        if (!details) return;
        
        const isActive = details.classList.contains('active');
        
        // Close all other open transaction details
        document.querySelectorAll('.transaction-details.active').forEach(item => {
          if (item !== details) {
            item.style.maxHeight = null;
            item.classList.remove('active');
            
            const header = item.previousElementSibling;
            if (header) {
              header.classList.remove('active');
            }
          }
        });
        
        // Toggle current transaction details
        this.classList.toggle('active');
        details.classList.toggle('active');
        
        if (!isActive) {
          details.style.maxHeight = details.scrollHeight + "px";
        } else {
          details.style.maxHeight = null;
        }
      });
    });
  }