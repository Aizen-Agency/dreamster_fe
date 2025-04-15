// Initialize Stripe with your publishable key
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Helper function to format amount for Stripe (converts dollars to cents)
export const formatAmountForStripe = (amount: number): number => {
    return Math.round(amount * 100);
};

// Helper function to format amount from Stripe (converts cents to dollars)
export const formatAmountFromStripe = (amount: number): number => {
    return amount / 100;
}; 