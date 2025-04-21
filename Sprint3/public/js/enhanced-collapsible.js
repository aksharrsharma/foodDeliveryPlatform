/**
 * Enhanced Collapsible Components for Silver Spoon Restaurant
 * 
 * This script improves the collapsible elements on the receipt and transaction pages
 * by adding smooth animations, visual indicators, and improved UX.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all collapsible elements
    initCollapsibles();
    
    // Initialize transaction details toggles
    initTransactionDetails();
});
  
/**
 * Initialize collapsible elements with improved animation and styling
 */
function initCollapsibles() {
    const collapsibles = document.querySelectorAll('.collapsible');
    
    collapsibles.forEach(collapsible => {
        // Add click event listener
        collapsible.addEventListener('click', function(e) {
            // Prevent event bubbling to avoid conflicts
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle active class
            this.classList.toggle('active');
            
            const content = this.nextElementSibling;
            
            if (content && content.classList.contains('content')) {
                // If content is already open, close it
                if (content.classList.contains('active')) {
                    content.classList.remove('active');
                    content.style.maxHeight = null;
                } else {
                    // Otherwise, open it
                    content.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            }
        });
    });
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
        header.addEventListener('click', function(e) {
            // Prevent event bubbling to avoid conflicts
            e.preventDefault();
            e.stopPropagation();
            
            const details = this.nextElementSibling;
            if (!details) return;
            
            // Toggle active class
            this.classList.toggle('active');
            
            // Toggle details visibility
            if (details.classList.contains('active')) {
                details.classList.remove('active');
                details.style.maxHeight = null;
            } else {
                details.classList.add('active');
                details.style.maxHeight = details.scrollHeight + "px";
            }
        });
    });
}