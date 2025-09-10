document.addEventListener('DOMContentLoaded', function () {
    // Initialize Portfolio Page
    initializePortfolioPage();
});

function initializePortfolioPage() {
    // Initialize Charts
    initializeCharts();

    // Add Account Button
    const addAccountBtn = document.getElementById('addAccountBtn');
    if (addAccountBtn) {
        addAccountBtn.addEventListener('click', () => {
            const modal = document.getElementById('addAccountModal');
            modal.style.display = 'block';
        });
    }

    // Add Investment Button
    const addInvestmentBtn = document.getElementById('addInvestmentBtn');
    if (addInvestmentBtn) {
        addInvestmentBtn.addEventListener('click', () => {
            const modal = document.getElementById('addInvestmentModal');
            modal.style.display = 'block';
        });
    }

    // Modal Close Buttons
    const modalCloseButtons = document.querySelectorAll('.modal-close, .modal-cancel');
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    // Add Account Form
    const addAccountForm = document.getElementById('addAccountForm');
    if (addAccountForm) {
        addAccountForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('accountName').value;
            const type = document.getElementById('accountType').value;
            const balance = parseFloat(document.getElementById('accountBalance').value);
            const institution = document.getElementById('accountInstitution').value;

            // Create new account card
            const accountsGrid = document.querySelector('.accounts-grid');
            const newAccount = document.createElement('div');
            newAccount.className = balance < 0 ? 'account-card negative' : 'account-card';

            // Get icon based on account type
            const icon = getAccountIcon(type);

            newAccount.innerHTML = `
                <div class="account-
