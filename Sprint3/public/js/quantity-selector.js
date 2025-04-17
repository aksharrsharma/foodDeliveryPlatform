document.addEventListener('DOMContentLoaded', function() {
  // Handle quantity controls
  initQuantitySelectors();
});

function initQuantitySelectors() {
  // Get all quantity selectors
  const selectors = document.querySelectorAll('.quantity-selector');
  
  selectors.forEach(selector => {
    const decreaseBtn = selector.querySelector('.decrease');
    const increaseBtn = selector.querySelector('.increase');
    const input = selector.querySelector('.quantity-input');
    
    if (!decreaseBtn || !increaseBtn || !input) return;
    
    // Decrease quantity
    decreaseBtn.addEventListener('click', function() {
      const currentValue = parseInt(input.value);
      if (currentValue > 1) {
        input.value = currentValue - 1;
      }
    });
    
    // Increase quantity
    increaseBtn.addEventListener('click', function() {
      const currentValue = parseInt(input.value);
      if (currentValue < 10) {
        input.value = currentValue + 1;
      }
    });
  });
}