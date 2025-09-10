// js/analytics.js
function initializeAnalytics() {
    // Spending by Category Chart
    const categoryCtx = document.getElementById('spendingByCategoryChart').getContext('2d');
    const categoryChart = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: ['Food & Dining', 'Transportation', 'Housing', 'Entertainment', 'Utilities', 'Shopping', 'Other'],
            datasets: [{
                data: [350, 120, 800, 150, 200, 280, 100],
                backgroundColor: [
                    '#f97316', '#8b5cf6', '#6366f1', '#ec4899', '#06b6d4', '#14b8a6', '#64748b'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'Monthly Spending by Category'
                }
            }
        }
    });

    // Monthly Trend Chart
    const trendCtx = document.getElementById('monthlyTrendChart').getContext('2d');
    const trendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Income',
                data: [3200, 3200, 3400, 3200, 3200, 3500],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true
            }, {
                label: 'Expenses',
                data: [2800, 2600, 2900, 2700, 2500, 2400],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Income vs Expenses (6 Months)'
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAnalytics);
