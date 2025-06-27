import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe"; // Ensure you have a Stripe instance set up      
import Stripe from "stripe";
import { prisma } from '@/lib/prisma'; // Ensure you have Prisma set up`

export async function POST(request: NextRequest) {

    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            webhookSecret
        );
    } catch (error: any) {
        console.error("Error constructing Stripe event:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }   

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCheckoutSessionCompleted(session);
            break;
        }
        case 'invoice.payment_failed': {
            // Handle payment failure logic here}
            const invoice = event.data.object as Stripe.Invoice;
            await handleInvoicePaymentFailed(invoice);
            break;
        }
        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionDeleted(subscription);
            break;
        }
        default: {
            console.warn(`Unhandled event type: ${event.type}`);
            return NextResponse.json({ received: true }, { status: 200 });
        }
    }
}

const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session
) => {
  const userId = session.metadata?.clerkUserId;
  console.log("Handling checkout.session.completed for user:", userId);

  if (!userId) {
    console.error("No userId found in session metadata.");
    return;
  }

  // Retrieve subscription ID from the session
  const subscriptionId = session.subscription as string;

  if (!subscriptionId) {
    console.error("No subscription ID found in session.");
    return;
  }

  console.log("HHHHEHHEHE");
  // Update Prisma with subscription details
  try {
    await prisma.profile.update({
      where: { userId },
      data: {
        stripeSubscriptionId: subscriptionId,
        subscriptionActive: true,
        subscriptionTier: session.metadata?.planType || null,
      },
    });
    console.log(`Subscription activated for user: ${userId}`);
  } catch (error: any) {
    console.error("Prisma Update Error:", error.message);
  }
};

// Handler for failed invoice payments
const handleInvoicePaymentFailed = async (invoice: Stripe.Invoice) => {
  const subscriptionId = invoice.id as string;
  console.log(
    "Handling invoice.payment_failed for subscription:",
    subscriptionId
  );

  if (!subscriptionId) {
    console.error("No subscription ID found in invoice.");
    return;
  }

  // Retrieve userId from subscription ID
  let userId: string | undefined;
  try {
    const profile = await prisma.profile.findFirst({
      where: { stripeSubscriptionId: subscriptionId },
      select: { userId: true },
    });

    if (!profile?.userId) {
      console.error("No profile found for this subscription ID.");
      return;
    }

    userId = profile.userId;
  } catch (error: any) {
    console.error("Prisma Query Error:", error.message);
    return;
  }

  // Update Prisma with payment failure
  try {
    await prisma.profile.update({
      where: { userId },
      data: {
        subscriptionActive: false,
      },
    });
    console.log(`Subscription payment failed for user: ${userId}`);
  } catch (error: any) {
    console.error("Prisma Update Error:", error.message);
  }
};

// Handler for subscription deletions (e.g., cancellations)
const handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
  const subscriptionId = subscription.id;
  console.log(
    "Handling customer.subscription.deleted for subscription:",
    subscriptionId
  );

  // Retrieve userId from subscription ID
  let userId: string | undefined;
  try {
    const profile = await prisma.profile.findFirst({
      where: { stripeSubscriptionId: subscriptionId },
      select: { userId: true },
    });

    if (!profile?.userId) {
      console.error("No profile found for this subscription ID.");
      return;
    }

    userId = profile.userId;
  } catch (error: any) {
    console.error("Prisma Query Error:", error.message);
    return;
  }

  // Update Prisma with subscription cancellation
  try {
    await prisma.profile.update({
      where: { userId },
      data: {
        subscriptionActive: false,
        stripeSubscriptionId: null,
      },
    });
    console.log(`Subscription canceled for user: ${userId}`);
  } catch (error: any) {
    console.error("Prisma Update Error:", error.message);
  }
};