/**
 * Dashboard and Admin Experience Enhancements for Silver Spoon
 * 
 * This script enhances the dashboard and admin transaction pages with visualizations,
 * sorting capabilities, and improved UI interactions.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard charts if on the dashboard page
    if (document.querySelector('.dashboard-container')) {
      initDashboardCharts();
    }
    
    // Initialize transaction filters and sorting if on the transactions page
    if (document.querySelector('.transactions-container')) {
      initTransactionFilters();
    }
    
    // Add hover effects to all sales cards
    initSalesCardEffects();
  });
  
  /**
   * Initializes charts for the dashboard to visualize sales data
   */
  function initDashboardCharts() {
    // Only proceed if sales data is available on the page
    const itemSalesElements = document.querySelectorAll('.item-sales-card');
    if (itemSalesElements.length === 0) return;
    
    // Collect data from the DOM to create chart
    const itemNames = [];
    const quantitySold = [];
    const revenue = [];
    
    itemSalesElements.forEach(item => {
      const nameElement = item.querySelector('.item-sales-name');
      const quantityElement = item.querySelector('.stat-value[data-type="quantity"]');
      const revenueElement = item.querySelector('.stat-value[data-type="revenue"]');
      
      if (nameElement && quantityElement && revenueElement) {
        itemNames.push(nameElement.textContent.trim());
        quantitySold.push(parseInt(quantityElement.textContent));
        revenue.push(parseFloat(revenueElement.textContent.replace('$', '')));
      }
    });
    
    // Create sales overview chart if container exists
    const salesChartContainer = document.getElementById('salesChart');
    if (salesChartContainer && itemNames.length > 0) {
      const ctx = salesChartContainer.getContext('2d');
      
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: itemNames,
          datasets: [{
            label: 'Quantity Sold',
            data: quantitySold,
            backgroundColor: 'rgba(0, 128, 128, 0.7)',
            borderColor: 'rgba(0, 128, 128, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Product Sales Overview'
            },
            legend: {
              position: 'top',
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
    
    // Create revenue chart if container exists
    const revenueChartContainer = document.getElementById('revenueChart');
    if (revenueChartContainer && itemNames.length > 0) {
      const ctx = revenueChartContainer.getContext('2d');
      
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: itemNames,
          datasets: [{
            label: 'Revenue',
            data: revenue,
            backgroundColor: [
              'rgba(0, 128, 128, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
              'rgba(255, 159, 64, 0.7)',
              'rgba(255, 99, 132, 0.7)'
            ],
            borderColor: [
              'rgba(0, 128, 128, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Revenue by Product'
            },
            legend: {
              position: 'right',
            }
          }
        }
      });
    }
  }
  
  /**
   * Initialize transaction filters and sorting functionality
   */
  function initTransactionFilters() {
    const filterSelect = document.getElementById('transactionFilter');
    const sortSelect = document.getElementById('transactionSort');
    const transactionItems = document.querySelectorAll('.transaction-item');
    
    if (!filterSelect || !sortSelect || transactionItems.length === 0) return;
    
    // Filter transactions
    filterSelect.addEventListener('change', function() {
      const filterValue = this.value;
      
      transactionItems.forEach(item => {
        if (filterValue === 'all') {
          item.style.display = '';
        } else {
          const status = item.dataset.status;
          item.style.display = status === filterValue ? '' : 'none';
        }
      });
    });
    
    // Sort transactions
    sortSelect.addEventListener('change', function() {
      const sortValue = this.value;
      const transactionContainer = document.querySelector('.transaction-list');
      
      const itemsArray = Array.from(transactionItems);
      
      itemsArray.sort((a, b) => {
        if (sortValue === 'date-new') {
          return new Date(b.dataset.date) - new Date(a.dataset.date);
        } else if (sortValue === 'date-old') {
          return new Date(a.dataset.date) - new Date(b.dataset.date);
        } else if (sortValue === 'amount-high') {
          return parseFloat(b.dataset.amount) - parseFloat(a.dataset.amount);
        } else if (sortValue === 'amount-low') {
          return parseFloat(a.dataset.amount) - parseFloat(b.dataset.amount);
        }
        return 0;
      });
      
      // Re-append sorted items
      itemsArray.forEach(item => {
        transactionContainer.appendChild(item);
      });
    });
  }
  
  /**
   * Add interactive effects to sales cards
   */
  function initSalesCardEffects() {
    const salesCards = document.querySelectorAll('.item-sales-card');
    
    salesCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        // Add highlight class
        this.classList.add('highlight');
        
        // Create and show quick stat popup if not already present
        if (!this.querySelector('.quick-stats')) {
          const quickStats = document.createElement('div');
          quickStats.className = 'quick-stats';
          
          const itemName = this.querySelector('.item-sales-name').textContent;
          const quantitySold = this.querySelector('.stat-value[data-type="quantity"]').textContent;
          const revenue = this.querySelector('.stat-value[data-type="revenue"]').textContent;
          
          quickStats.innerHTML = `
            <div class="quick-stats-header">${itemName}</div>
            <div class="quick-stats-body">
              <div class="quick-stat">
                <span class="quick-stat-label">Sold</span>
                <span class="quick-stat-value">${quantitySold}</span>
              </div>
              <div class="quick-stat">
                <span class="quick-stat-label">Revenue</span>
                <span class="quick-stat-value">${revenue}</span>
              </div>
            </div>
          `;
          
          this.appendChild(quickStats);
          
          // Animate in
          setTimeout(() => {
            quickStats.style.opacity = '1';
            quickStats.style.transform = 'translateY(0)';
          }, 10);
        }
      });
      
      card.addEventListener('mouseleave', function() {
        // Remove highlight class
        this.classList.remove('highlight');
        
        // Remove quick stat popup
        const quickStats = this.querySelector('.quick-stats');
        if (quickStats) {
          quickStats.style.opacity = '0';
          quickStats.style.transform = 'translateY(10px)';
          
          setTimeout(() => {
            quickStats.remove();
          }, 300);
        }
      });
    });
  }
  
  /**
   * Function to format currency values consistently
   */
  function formatCurrency(value) {
    return '$' + parseFloat(value).toFixed(2);
  }
  
  /**
   * Function to format dates in a user-friendly way
   */
  function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }