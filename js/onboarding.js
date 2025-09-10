document.addEventListener('DOMContentLoaded', function () {
    initializeOnboarding();
});

function initializeOnboarding() {
    // Step Navigation
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const steps = document.querySelectorAll('.step');
    const onboardingSteps = document.querySelectorAll('.onboarding-step');

    // Next Step Buttons
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = parseInt(button.getAttribute('data-next')) - 1;
            const nextStep = parseInt(button.getAttribute('data-next'));

            // Validate current step before proceeding
            if (currentStep === 0) {
                if (!validateStep1()) return;
            }

            // Update sidebar steps
            steps.forEach(step => step.classList.remove('active'));
            steps[nextStep - 1].classList.add('active');
            steps[currentStep].classList.add('completed');

            // Show next step content
            onboardingSteps.forEach(step => step.classList.remove('active'));
            document.getElementById(`step${nextStep}`).classList.add('active');

            // If this is the final step, save all data
            if (nextStep === 4) {
                saveOnboardingData();
            }
        });
    });

    // Previous Step Buttons
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            const prevStep = parseInt(button.getAttribute('data-prev'));

            // Update sidebar steps
            steps.forEach(step => step.classList.remove('active'));
            steps[prevStep - 1].classList.add('active');

            // Show previous step content
            onboardingSteps.forEach(step => step.classList.remove('active'));
            document.getElementById(`step${prevStep}`).classList.add('active');
        });
    });

    // Radio Option Selection
    const radioOptions = document.querySelectorAll('.radio-option');
    radioOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Find all radio options in the same group
            const name = option.querySelector('input').getAttribute('name');
            const siblings = document.querySelectorAll(`.radio-option input[name="${name}"]`);

            // Remove selected class from all options in this group
            siblings.forEach(input => {
                input.closest('.radio-option').classList.remove('selected');
            });

            // Add selected class to clicked option
            option.classList.add('selected');

            // Check the radio input
            option.querySelector('input').checked = true;
        });
    });

    // Initialize selected state for checked radio buttons
    document.querySelectorAll('.radio-option input:checked').forEach(input => {
        input.closest('.radio-option').classList.add('selected');
    });
}

function validateStep1() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!fullName || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return false;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return false;
    }

    if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return false;
    }

    return true;
}

function saveOnboardingData() {
    // Get user data
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value; // In a real app, this would be hashed

    // Get financial profile data
    const financialGoal = document.querySelector('input[name="financialGoal"]:checked').value;
    const monthlyIncome = document.getElementById('monthlyIncome').value;
    const financialKnowledge = document.querySelector('input[name="financialKnowledge"]:checked').value;

    // Get preferences
    const focusAreas = Array.from(document.querySelectorAll('input[name="focus"]:checked')).map(cb => cb.value);
    const reviewFrequency = document.querySelector('input[name="reviewFrequency"]:checked').value;
    const currency = document.getElementById('currency').value;

    // Create user data object
    const userData = {
        user: {
            name: fullName,
            email: email,
            // In a real app, we would never store the password in localStorage
            // This is just for demo purposes
        },
        financialProfile: {
            goal: financialGoal,
            monthlyIncome: parseFloat(monthlyIncome),
            knowledgeLevel: financialKnowledge
        },
        preferences: {
            focusAreas,
            reviewFrequency,
            currency
        },
        isPremium: false,
        transactions: [],
        createdAt: new Date().toISOString()
    };

    // Save to localStorage (in a real app, this would be sent to a server)
    localStorage.setItem('moneywise_user_data', JSON.stringify(userData));
}
