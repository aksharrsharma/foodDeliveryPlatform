/**
 * Fix for Transaction Details in Silver Spoon Admin Dashboard
 * This script adds direct event listeners to transaction items
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded - applying transaction details fix');
  
  // Get all transaction items
  const transactionItems = document.querySelectorAll('.transaction-item');
  console.log('Found transaction items:', transactionItems.length);
  
  // Add click handlers to each transaction item
  transactionItems.forEach(item => {
    const header = item.querySelector('.transaction-header');
    const details = item.querySelector('.transaction-details');
    
    if (header && details) {
      // Log that we found a valid transaction item
      console.log('Setting up transaction item:', item.querySelector('.transaction-id')?.textContent);
      
      // Add click handler to the header
      header.addEventListener('click', function(e) {
        console.log('Transaction header clicked');
        e.preventDefault();
        
        // Toggle active class on details element
        const isActive = details.classList.toggle('active');
        
        // Update header active state
        header.classList.toggle('active', isActive);
        
        // Apply inline styles for animation
        if (isActive) {
          console.log('Opening transaction details');
          // Force layout reflow to get accurate scrollHeight
          details.style.display = 'block';
          details.style.height = 'auto';
          const height = details.scrollHeight;
          details.style.height = '0';
          
          // Set timeout to trigger animation
          setTimeout(() => {
            details.style.height = height + 'px';
            details.style.padding = '1.5rem';
            details.style.opacity = '1';
          }, 10);
        } else {
          console.log('Closing transaction details');
          details.style.height = '0';
          details.style.padding = '0';
          details.style.opacity = '0';
          
          // Clean up styles after animation completes
          setTimeout(() => {
            if (!details.classList.contains('active')) {
              details.style.display = 'none';
            }
          }, 300);
        }
      });
      
      // Initialize details to be hidden
      details.style.display = 'none';
      details.style.height = '0';
      details.style.opacity = '0';
      details.style.overflow = 'hidden';
      details.style.transition = 'height 0.3s ease, opacity 0.3s ease, padding 0.3s ease';
    }
  });
  
  // Add console log to help diagnose issues
  if (transactionItems.length === 0) {
    console.warn('No transaction items found on the page. Check your HTML structure.');
  }
});