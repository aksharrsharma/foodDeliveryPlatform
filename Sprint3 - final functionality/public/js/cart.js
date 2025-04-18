document.addEventListener('DOMContentLoaded', function() {
    // Handle quantity changes
    const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
    const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
    
    // Decrease quantity
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.closest('.cart-item').dataset.itemId;
            const quantityElement = this.nextElementSibling;
            let quantity = parseInt(quantityElement.textContent);
            
            if (quantity > 1) {
                quantity--;
                updateCartItem(itemId, quantity);
                quantityElement.textContent = quantity;
                updateSubtotal(this.closest('.cart-item'), quantity);
                updateCartTotal();
            }
        });
    });
    
    // Increase quantity
    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.closest('.cart-item').dataset.itemId;
            const quantityElement = this.previousElementSibling;
            let quantity = parseInt(quantityElement.textContent);
            
            quantity++;
            updateCartItem(itemId, quantity);
            quantityElement.textContent = quantity;
            updateSubtotal(this.closest('.cart-item'), quantity);
            updateCartTotal();
        });
    });
    
    // Update subtotal for an item
    function updateSubtotal(cartItem, quantity) {
        const priceElement = cartItem.querySelector('.item-price');
        const subtotalElement = cartItem.querySelector('.item-subtotal');
        const price = parseFloat(priceElement.textContent.replace('$', ''));
        
        const subtotal = price * quantity;
        subtotalElement.textContent = '$' + subtotal.toFixed(2);
    }
    
    // Update total cart amount
    function updateCartTotal() {
        const subtotalElements = document.querySelectorAll('.item-subtotal');
        let total = 0;
        
        subtotalElements.forEach(element => {
            total += parseFloat(element.textContent.replace('$', ''));
        });
        
        const tax = total * 0.08;
        const finalTotal = total + tax;
        
        document.querySelector('.subtotal .amount').textContent = '$' + total.toFixed(2);
        document.querySelector('.tax .amount').textContent = '$' + tax.toFixed(2);
        document.querySelector('.total .amount').textContent = '$' + finalTotal.toFixed(2);
    }
    
    // Send AJAX request to update cart
    function updateCartItem(itemId, quantity) {
        fetch('/cart/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                itemId: itemId,
                quantity: quantity 
            })
        })
        .catch(error => {
            console.error('Error updating cart:', error);
        });
    }
    
    // Add to cart buttons on product pages
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn, .add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!this.closest('form')) {
                e.preventDefault();
                const itemId = this.dataset.itemId;
                
                fetch('/items/' + itemId + '/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        showCartNotification('Item added to cart!');
                    }
                })
                .catch(error => {
                    console.error('Error adding to cart:', error);
                });
            }
        });
    });
    
    // Show notification when item is added to cart
    function showCartNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
});