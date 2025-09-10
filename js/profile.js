document.addEventListener('DOMContentLoaded', function () {
    // Initialize Profile Page
    initializeProfilePage();
});

function initializeProfilePage() {
    // Tab Navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Show selected tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Personal Info Form
    const personalInfoForm = document.getElementById('personalInfoForm');
    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('fullName').value;
            const email = document.getElementById('profileEmailInput').value;
            const phone = document.getElementById('phoneNumber').value;
            const dob = document.getElementById('dateOfBirth').value;

            // Update profile display
            document.getElementById('profileName').textContent = name;
            document.getElementById('profileEmail').textContent = email;

            // Save to localStorage (in a real app, this would be sent to a server)
            const userData = JSON.parse(localStorage.getItem('moneywise_user_data') || '{}');
            userData.user = {
                ...userData.user,
                name,
                email,
                phone,
                dob
            };
            localStorage.setItem('moneywise_user_data', JSON.stringify(userData));

            // Show success message
            alert('Profile information updated successfully!');
        });
    }

    // Change Password Form
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validate passwords
            if (!currentPassword || !newPassword || !confirmPassword) {
                alert('Please fill in all password fields.');
                return;
            }

            if (newPassword !== confirmPassword) {
                alert('New passwords do not match.');
                return;
            }

            // In a real app, this would verify the current password and update with the new one
            // For this demo, we'll just show a success message
            alert('Password updated successfully!');

            // Reset form
            changePasswordForm.reset();
        });
    }

    // Preferences
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        // Check if dark mode is enabled
        const isDarkMode = localStorage.getItem('moneywise_dark_mode') === 'true';
        darkModeToggle.checked = isDarkMode;

        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }

        darkModeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('moneywise_dark_mode', darkModeToggle.checked);
        });
    }

    // Save Preferences
    const savePreferencesBtn = document.getElementById('savePreferencesBtn');
    if (savePreferencesBtn) {
        savePreferencesBtn.addEventListener('click', () => {
            const currency = document.getElementById('currencySelect').value;
            const dateFormat = document.getElementById('dateFormatSelect').value;
            const emailNotifications = document.getElementById('emailNotificationsToggle').checked;
            const budgetAlerts = document.getElementById('budgetAlertsToggle').checked;

            // Save preferences to localStorage
            const userData = JSON.parse(localStorage.getItem('moneywise_user_data') || '{}');
            userData.preferences = {
                currency,
                dateFormat,
                emailNotifications,
                budgetAlerts
            };
            localStorage.setItem('moneywise_user_data', JSON.stringify(userData));

            alert('Preferences saved successfully!');
        });
    }

    // Clear Data Button
    const clearDataBtn = document.getElementById('clearDataBtn');
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', () => {
            const clearDataModal = document.getElementById('clearDataModal');
            clearDataModal.style.display = 'block';
        });
    }

    // Delete Account Button
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
            const deleteAccountModal = document.getElementById('deleteAccountModal');
            deleteAccountModal.style.display = 'block';
        });
    }

    // Modal Close Buttons
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    // Confirm Clear Data
    const confirmClearBtn = document.getElementById('confirmClearBtn');
    if (confirmClearBtn) {
        confirmClearBtn.addEventListener('click', () => {
            // Clear transactions but keep user data
            const userData = JSON.parse(localStorage.getItem('moneywise_user_data') || '{}');
            userData.transactions = [];
            localStorage.setItem('moneywise_user_data', JSON.stringify(userData));

            // Close modal
            document.getElementById('clearDataModal').style.display = 'none';

            alert('All transaction data has been cleared.');
        });
    }

    // Cancel Clear Data
    const cancelClearBtn = document.getElementById('cancelClearBtn');
    if (cancelClearBtn) {
        cancelClearBtn.addEventListener('click', () => {
            document.getElementById('clearDataModal').style.display = 'none';
        });
    }

    // Delete Account Confirmation
    const deleteConfirmationInput = document.getElementById('deleteConfirmation');
    const confirmDeleteAccountBtn = document.getElementById('confirmDeleteAccountBtn');

    if (deleteConfirmationInput && confirmDeleteAccountBtn) {
        deleteConfirmationInput.addEventListener('input', () => {
            confirmDeleteAccountBtn.disabled = deleteConfirmationInput.value !== 'DELETE';
        });

        confirmDeleteAccountBtn.addEventListener('click', () => {
            if (deleteConfirmationInput.value === 'DELETE') {
                // Clear all user data
                localStorage.removeItem('moneywise_user_data');

                // Redirect to home page
                window.location.href = '../index.html';
            }
        });
    }

    // Cancel Delete Account
    const cancelDeleteAccountBtn = document.getElementById('cancelDeleteAccountBtn');
    if (cancelDeleteAccountBtn) {
        cancelDeleteAccountBtn.addEventListener('click', () => {
            document.getElementById('deleteAccountModal').style.display = 'none';
        });
    }

    // Load user data from localStorage
    loadUserData();
}

function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('moneywise_user_data') || '{}');
    const user = userData.user || {};
    const isPremium = userData.isPremium || false;

    // Update profile information
    if (user.name) {
        document.getElementById('profileName').textContent = user.name;
        document.getElementById('fullName').value = user.name;
    }

    if (user.email) {
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('profileEmailInput').value = user.email;
    }

    if (user.phone) {
        document.getElementById('phoneNumber').value = user.phone;
    }

    if (user.dob) {
        document.getElementById('dateOfBirth').value = user.dob;
    }

    // Update subscription status
    const subscriptionStatus = document.getElementById('subscriptionStatus');
    if (subscriptionStatus) {
        subscriptionStatus.textContent = isPremium ? 'Premium Plan' : 'Free Plan';
    }

    // Update member since date
    const memberSince = document.getElementById('memberSince');
    if (memberSince) {
        const joinDate = userData.createdAt ? new Date(userData.createdAt) : new Date();
        memberSince.textContent = joinDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    }

    // Update plan badge
    const userPlan = document.getElementById('userPlan');
    if (userPlan) {
        userPlan.textContent = isPremium ? 'PREMIUM PLAN' : 'FREE PLAN';
        userPlan.className = isPremium ? 'plan-badge premium' : 'plan-badge';
    }

    // Update preferences
    const preferences = userData.preferences || {};

    if (preferences.currency) {
        const currencySelect = document.getElementById('currencySelect');
        if (currencySelect) {
            currencySelect.value = preferences.currency;
        }
    }

    if (preferences.dateFormat) {
        const dateFormatSelect = document.getElementById('dateFormatSelect');
        if (dateFormatSelect) {
            dateFormatSelect.value = preferences.dateFormat;
        }
    }

    if (preferences.emailNotifications !== undefined) {
        const emailNotificationsToggle = document.getElementById('emailNotificationsToggle');
        if (emailNotificationsToggle) {
            emailNotificationsToggle.checked = preferences.emailNotifications;
        }
    }

    if (preferences.budgetAlerts !== undefined) {
        const budgetAlertsToggle = document.getElementById('budgetAlertsToggle');
        if (budgetAlertsToggle) {
            budgetAlertsToggle.checked = preferences.budgetAlerts;
        }
    }
}
