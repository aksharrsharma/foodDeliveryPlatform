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
        collapsible.addEventListener('click', function() {
            this.classList.toggle('active');
            
            const content = this.nextElementSibling;
            
            if (content.classList.contains('content')) {
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                    setTimeout(() => content.classList.remove('active'), 300);
                } else {
                    content.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            }
        });
    });
    
    // Open the first collapsible by default (optional)
    if (collapsibles.length > 0) {
        // Uncomment the next two lines if you want the first item expanded by default
        // collapsibles[0].classList.add('active');
        // collapsibles[0].nextElementSibling.style.maxHeight = collapsibles[0].nextElementSibling.scrollHeight + "px";
    }
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
            
            this.classList.toggle('active');
            
            if (details.style.maxHeight) {
                details.style.maxHeight = null;
                setTimeout(() => details.classList.remove('active'), 300);
            } else {
                details.classList.add('active');
                details.style.maxHeight = details.scrollHeight + "px";
            }
        });
    });
}