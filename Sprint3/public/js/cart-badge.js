// Cart badge update functionality
document.addEventListener('DOMContentLoaded', function() {
    updateCartBadge();

    // Add event listeners to all add to cart forms and buttons
    const addToCartForms = document.querySelectorAll('form[action*="/orders"]');
    addToCartForms.forEach(form => {
        // Skip if this form is for deleting (has DELETE method)
        if (form.action.includes('_method=DELETE')) return;
        
        form.addEventListener('submit', function() {
            // After a small delay to allow the server to process
            setTimeout(updateCartBadge, 500);
        });
    });
    
    // Standalone buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn, button.add-to-cart');
    addToCartButtons.forEach(button => {
        // Skip if button is inside a form we already handled
        if (button.closest('form[action*="/orders"]')) return;
        
        button.addEventListener('click', function() {
            // After a small delay to allow the server to process
            setTimeout(updateCartBadge, 500);
        });
    });
    
    // Handle quantity changes in cart
    const quantityButtons = document.querySelectorAll('.quantity-btn');
    quantityButtons.forEach(button => {
        button.addEventListener('click', function() {
            // After a small delay to allow the server to process
            setTimeout(updateCartBadge, 500);
        });
    });
});

// Function to update cart badge
function updateCartBadge() {
    const cartBadge = document.querySelector('.cart-badge');
    if (!cartBadge) return;
    
    // For cart page - count items directly if we're on the cart page
    const cartItems = document.querySelectorAll('.cart-item');
    if (cartItems.length > 0) {
        let totalItems = 0;
        cartItems.forEach(item => {
            const quantityElement = item.querySelector('.quantity-value');
            if (quantityElement) {
                totalItems += parseInt(quantityElement.textContent);
            } else {
                totalItems += 1; // Default to 1 if quantity element not found
            }
        });
        
        if (totalItems > 0) {
            cartBadge.setAttribute('data-count', totalItems);
            cartBadge.classList.add('has-items');
        } else {
            cartBadge.setAttribute('data-count', '0');
            cartBadge.classList.remove('has-items');
        }
        return;
    }
    
    // Otherwise fetch cart count from server
    fetch('/profile/mycart/count')
        .then(response => {
            if (response.ok) return response.json();
            return { count: 0 };
        })
        .then(data => {
            if (data.count && data.count > 0) {
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