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
    
  /**
   * Initialize transaction sorting functionality
   */
  function initTransactionSorting() {
    const sortSelect = document.getElementById('transactionSort');
    const transactionItems = document.querySelectorAll('.transaction-item');
    
    if (!sortSelect || transactionItems.length === 0) return;
    
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
      });
      
      card.addEventListener('mouseleave', function() {
        // Remove highlight class
        this.classList.remove('highlight');
      });
    });
  }
    
    // Initialize transaction sorting if on the transactions page
    if (document.querySelector('.transactions-container')) {
      initTransactionSorting();
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
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                precision: 0
              }
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