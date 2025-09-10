// Install: npm install stripe

// Create js/payment.js
import { loadStripe } from 'https://cdn.jsdelivr.net/npm/@stripe/stripe-js@1.54.0/dist/stripe.js';

const stripePublicKey = 'pk_test_YOUR_STRIPE_PUBLIC_KEY';
const stripe = await loadStripe(stripePublicKey);

async function startPremiumSubscription() {
    try {
        // Call your backend to create a subscription session
        const response = await fetch('/api/create-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                priceId: 'price_MONTHLY_SUBSCRIPTION_ID',
            }),
        });

        const session = await response.json();

        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });

        if (result.error) {
            console.error(result.error.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Connect to upgrade buttons
document.querySelectorAll('.btn-upgrade, .btn-upgrade-large').forEach(button => {
    button.addEventListener('click', startPremiumSubscription);
});
