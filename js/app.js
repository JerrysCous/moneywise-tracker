// ===== MONEYWISE APP - MAIN JAVASCRIPT =====

class MoneyWiseApp {
    constructor() {
        this.currentUser = {
            name: 'Demo User',
            email: 'demo@example.com'
        };
        this.isPremium = false;
        this.transactions = [];
        this.transactionLimit = 50; // Free plan limit

        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.updateUI();
        console.log('MoneyWise App Initialized! 🚀');
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Landing page buttons
        const getStartedBtn = document.getElementById('getStartedBtn');
        const startFreeBtn = document.getElementById('startFreeBtn');
        const startFreePricingBtn = document.getElementById('startFreePricingBtn');
        const startPremiumBtn = document.getElementById('startPremiumBtn');
        const finalCTABtn = document.getElementById('finalCTABtn');

        // Add event listeners to landing page buttons if they exist
        if (getStartedBtn) getStartedBtn.addEventListener('click', () => this.navigateToDashboard());
        if (startFreeBtn) startFreeBtn.addEventListener('click', () => this.navigateToDashboard());
        if (startFreePricingBtn) startFreePricingBtn.addEventListener('click', () => this.navigateToDashboard());
        if (startPremiumBtn) startPremiumBtn.addEventListener('click', () => this.showUpgradeModal());
        if (finalCTABtn) finalCTABtn.addEventListener('click', () => this.navigateToDashboard());

        // Dashboard navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                if (section) {
                    e.preventDefault();
                    this.handleNavigation(e);
                }
            });
        });

        // Transaction form
        const transactionForm = document.getElementById('transactionForm');
        if (transactionForm) {
            transactionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addTransaction();
            });
        }

        // Upgrade buttons
        const upgradeButtons = document.querySelectorAll('.btn-upgrade, .btn-upgrade-large');
        upgradeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.showUpgradeModal());
        });

        // Modal close buttons
        const modalCloseButtons = document.querySelectorAll('.modal-close');
        modalCloseButtons.forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });

        // Simulate payment button
        const simulatePaymentBtn = document.getElementById('simulatePayment');
        if (simulatePaymentBtn) {
            simulatePaymentBtn.addEventListener('click', () => this.upgradeToPremium());
        }

        // Filter transactions
        const filterType = document.getElementById('filterType');
        const filterCategory = document.getElementById('filterCategory');
        const filterDate = document.getElementById('filterDate');

        if (filterType) filterType.addEventListener('change', () => this.filterTransactions());
        if (filterCategory) filterCategory.addEventListener('change', () => this.filterTransactions());
        if (filterDate) filterDate.addEventListener('change', () => this.filterTransactions());

        // Settings buttons
        const saveAccountBtn = document.getElementById('saveAccountBtn');
        const clearDataBtn = document.getElementById('clearDataBtn');

        if (saveAccountBtn) saveAccountBtn.addEventListener('click', () => this.saveAccountSettings());
        if (clearDataBtn) clearDataBtn.addEventListener('click', () => this.showClearDataModal());

        // Clear data confirmation
        const confirmClearBtn = document.getElementById('confirmClearBtn');
        const cancelClearBtn = document.getElementById('cancelClearBtn');

        if (confirmClearBtn) confirmClearBtn.addEventListener('click', () => this.clearAllData());
        if (cancelClearBtn) cancelClearBtn.addEventListener('click', () => this.closeAllModals());
    }

    // ===== NAVIGATION =====
    navigateToDashboard() {
        window.location.href = 'public/dashboard.html';
    }

    handleNavigation(e) {
        const section = e.currentTarget.dataset.section;

        // Check if premium feature
        if (e.currentTarget.classList.contains('premium-locked') && !this.isPremium) {
            this.showUpgradeModal();
            return;
        }

        this.showSection(section);
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        const activeNavItem = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
    }

    // ===== TRANSACTIONS =====
    addTransaction() {
        const amountInput = document.getElementById('amount');
        const typeInput = document.getElementById('type');
        const categoryInput = document.getElementById('category');
        const descriptionInput = document.getElementById('description');

        if (!amountInput || !typeInput || !categoryInput || !descriptionInput) return;

        const amount = parseFloat(amountInput.value);
        const type = typeInput.value;
        const category = categoryInput.value;
        const description = descriptionInput.value;

        // Check transaction limit for free users
        if (!this.isPremium && this.getMonthlyTransactionCount() >= this.transactionLimit) {
            alert(`You've reached the limit of ${this.transactionLimit} transactions this month. Upgrade to Premium for unlimited transactions.`);
            return;
        }

        const transaction = {
            id: Date.now(),
            amount: type === 'expense' ? -amount : amount,
            type,
            category,
            description,
            date: new Date().toISOString()
        };

        this.transactions.unshift(transaction); // Add to beginning of array
        this.saveUserData();
        this.updateUI();

        // Reset form
        amountInput.value = '';
        descriptionInput.value = '';

        // Show success message
        alert('Transaction added successfully!');
    }

    deleteTransaction(id) {
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.saveUserData();
        this.updateUI();
    }

    getMonthlyTransactionCount() {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        return this.transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate >= firstDayOfMonth;
        }).length;
    }

    filterTransactions() {
        const filterType = document.getElementById('filterType');
        const filterCategory = document.getElementById('filterCategory');
        const filterDate = document.getElementById('filterDate');

        if (!filterType || !filterCategory || !filterDate) return;

        const typeFilter = filterType.value;
        const categoryFilter = filterCategory.value;
        const dateFilter = filterDate.value;

        let filteredTransactions = [...this.transactions];

        // Filter by type
        if (typeFilter !== 'all') {
            filteredTransactions = filteredTransactions.filter(t => t.type === typeFilter);
        }

        // Filter by category
        if (categoryFilter !== 'all') {
            filteredTransactions = filteredTransactions.filter(t => t.category === categoryFilter);
        }

        // Filter by date
        const now = new Date();
        if (dateFilter === 'thisMonth') {
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            filteredTransactions = filteredTransactions.filter(t => new Date(t.date) >= firstDayOfMonth);
        } else if (dateFilter === 'lastMonth') {
            const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            filteredTransactions = filteredTransactions.filter(t => {
                const date = new Date(t.date);
                return date >= firstDayLastMonth && date < firstDayThisMonth;
            });
        } else if (dateFilter === 'last3Months') {
            const firstDay3MonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
            filteredTransactions = filteredTransactions.filter(t => new Date(t.date) >= firstDay3MonthsAgo);
        }

        this.renderTransactionsList(filteredTransactions);
    }

    // ===== PREMIUM FEATURES =====
    showUpgradeModal() {
        const modal = document.getElementById('upgradeModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }

    upgradeToPremium() {
        this.isPremium = true;
        this.saveUserData();
        this.updateUI();
        this.closeAllModals();
        alert('Congratulations! You have upgraded to Premium. All features are now unlocked!');
    }

    // ===== SETTINGS =====
    saveAccountSettings() {
        const nameInput = document.getElementById('userName');
        const emailInput = document.getElementById('userEmail');

        if (!nameInput || !emailInput) return;

        this.currentUser.name = nameInput.value;
        this.currentUser.email = emailInput.value;

        this.saveUserData();
        alert('Account settings saved successfully!');
    }

    showClearDataModal() {
        const modal = document.getElementById('clearDataModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    clearAllData() {
        this.transactions = [];
        this.saveUserData();
        this.updateUI();
        this.closeAllModals();
        alert('All data has been cleared successfully.');
    }

    // ===== DATA MANAGEMENT =====
    loadUserData() {
        const userData = localStorage.getItem('moneywise_user_data');
        if (userData) {
            const data = JSON.parse(userData);
            this.currentUser = data.user || this.currentUser;
            this.isPremium = data.isPremium || false;
            this.transactions = data.transactions || [];
        }
    }

    saveUserData() {
        const userData = {
            user: this.currentUser,
            isPremium: this.isPremium,
            transactions: this.transactions,
            lastUpdated: new Date().toISOString()
        };

        localStorage.setItem('moneywise_user_data', JSON.stringify(userData));
    }

    // ===== UI UPDATES =====
    updateUI() {
        this.updatePlanBadge();
        this.updateTransactionCount();
        this.updateBalanceStats();
        this.renderTransactions();
        this.updatePremiumFeatures();
        this.updateSettingsUI();
    }

    updatePlanBadge() {
        const planBadge = document.getElementById('userPlan');
        if (planBadge) {
            planBadge.textContent = this.isPremium ? 'PREMIUM PLAN' : 'FREE PLAN';
            planBadge.className = this.isPremium ? 'plan-badge premium' : 'plan-badge';
        }
    }

    updateTransactionCount() {
        const countElement = document.getElementById('transactionCount');
        const limitElement = document.getElementById('transactionLimit');

        if (countElement) {
            const monthlyCount = this.getMonthlyTransactionCount();
            countElement.textContent = monthlyCount;

            if (limitElement) {
                if (this.isPremium) {
                    limitElement.textContent = 'Unlimited (Premium Plan)';
                } else {
                    limitElement.textContent = `Limit: ${this.transactionLimit}/month (Free Plan)`;

                    // Warn if approaching limit
                    if (monthlyCount >= this.transactionLimit * 0.8) {
                        limitElement.style.color = 'var(--warning-color)';
                    } else {
                        limitElement.style.color = 'var(--text-secondary)';
                    }
                }
            }
        }
    }

    updateBalanceStats() {
        const totalBalanceElement = document.getElementById('totalBalance');
        const monthExpensesElement = document.getElementById('monthExpenses');
        const monthIncomeElement = document.getElementById('monthIncome');

        if (!totalBalanceElement || !monthExpensesElement || !monthIncomeElement) return;

        // Calculate total balance
        const totalBalance = this.transactions.reduce((sum, t) => sum + t.amount, 0);
        totalBalanceElement.textContent = this.formatCurrency(totalBalance);

        // Calculate monthly stats
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const monthlyTransactions = this.transactions.filter(t => new Date(t.date) >= firstDayOfMonth);

        const monthExpenses = monthlyTransactions
            .filter(t => t.amount < 0)
            .reduce((sum, t) => sum + t.amount, 0);

        const monthIncome = monthlyTransactions
            .filter(t => t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0);

        monthExpensesElement.textContent = this.formatCurrency(Math.abs(monthExpenses));
        monthIncomeElement.textContent = this.formatCurrency(monthIncome);
    }

    renderTransactions() {
        // Render recent transactions (for overview)
        const recentList = document.getElementById('recentTransactionsList');
        if (recentList) {
            const recentTransactions = this.transactions.slice(0, 5); // Get 5 most recent
            this.renderTransactionsList(recentTransactions, recentList);
        }

        // Render all transactions (for transactions tab)
        const allList = document.getElementById('transactionsList');
        if (allList) {
            this.renderTransactionsList(this.transactions, allList);
        }
    }

    renderTransactionsList(transactions, container = null) {
        const listContainer = container || document.getElementById('transactionsList');
        if (!listContainer) return;

        if (transactions.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-receipt"></i>
                    <p>No transactions yet. Add your first one!</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = '';

        transactions.forEach(transaction => {
            const isExpense = transaction.amount < 0;
            const formattedAmount = this.formatCurrency(Math.abs(transaction.amount));
            const formattedDate = this.formatDate(transaction.date);

            const transactionEl = document.createElement('div');
            transactionEl.className = 'transaction-item';

            transactionEl.innerHTML = `
                <div class="transaction-icon ${transaction.category}">
                    <i class="fas ${this.getCategoryIcon(transaction.category)}"></i>
                </div>
                <div class="transaction-details">
                    <h4>${transaction.description}</h4>
                    <p>${this.getCategoryName(transaction.category)}</p>
                </div>
                <div class="transaction-amount ${isExpense ? 'expense' : 'income'}">
                    ${isExpense ? '-' : '+'}${formattedAmount}
                </div>
                <div class="transaction-date">
                    ${formattedDate}
                </div>
            `;

            listContainer.appendChild(transactionEl);
        });
    }

    updatePremiumFeatures() {
        // Update premium-locked navigation items
        const premiumItems = document.querySelectorAll('.premium-locked');
        premiumItems.forEach(item => {
            if (this.isPremium) {
                item.classList.remove('premium-locked');
            }
        });

        // Update premium sections
        const premiumSections = document.querySelectorAll('.premium-section');
        premiumSections.forEach(section => {
            if (this.isPremium) {
                const overlay = section.querySelector('.premium-overlay');
                if (overlay) overlay.style.display = 'none';
            }
        });

        // Update export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.disabled = !this.isPremium;
        }

        // Update upgrade buttons visibility
        const upgradeButtons = document.querySelectorAll('.btn-upgrade, .btn-upgrade-large');
        upgradeButtons.forEach(btn => {
            btn.style.display = this.isPremium ? 'none' : 'flex';
        });
    }

    updateSettingsUI() {
        const nameInput = document.getElementById('userName');
        const emailInput = document.getElementById('userEmail');
        const currentPlanInfo = document.getElementById('currentPlanInfo');
        const upgradeSettingsBtn = document.getElementById('upgradeSettingsBtn');

        if (nameInput) nameInput.value = this.currentUser.name;
        if (emailInput) emailInput.value = this.currentUser.email;

        if (currentPlanInfo) {
            const planName = this.isPremium ? 'Premium' : 'Free';
            const planDetails = this.isPremium
                ? 'Unlimited transactions and all premium features'
                : 'Up to 50 transactions per month';

            currentPlanInfo.innerHTML = `
                <h3>Current Plan: <span class="plan-name">${planName}</span></h3>
                <p>${planDetails}</p>
            `;
        }

        if (upgradeSettingsBtn) {
            upgradeSettingsBtn.style.display = this.isPremium ? 'none' : 'block';
        }
    }

    // ===== UTILITY FUNCTIONS =====
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);

        if (date.toDateString() === now.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric'
            }).format(date);
        }
    }

    getCategoryIcon(category) {
        const icons = {
            food: 'fa-utensils',
            transport: 'fa-car',
            utilities: 'fa-bolt',
            entertainment: 'fa-film',
            shopping: 'fa-shopping-bag',
            housing: 'fa-home',
            income: 'fa-money-bill-wave',
            other: 'fa-receipt'
        };

        return icons[category] || 'fa-receipt';
    }

    getCategoryName(category) {
        const names = {
            food: 'Food & Dining',
            transport: 'Transportation',
            utilities: 'Utilities',
            entertainment: 'Entertainment',
            shopping: 'Shopping',
            housing: 'Housing',
            income: 'Income',
            other: 'Other'
        };

        return names[category] || 'Other';
    }
}

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', () => {
    window.moneyWiseApp = new MoneyWiseApp();
});

console.log('MoneyWise JavaScript Loaded! 💰');
