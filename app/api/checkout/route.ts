import { getPriceIdFromType } from "@/lib/plans";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe"; // Ensure you have a Stripe instance set up

export async function POST(request: NextRequest) {

    try {
    const { planType, userId, email } = await request.json();
    
    if (!planType || !userId || !email) {
        return NextResponse.json({
            error: "Missing required fields: planType, userId, or email."
        }, {
            status: 400
        })
      
    }

    const allowedPlanTypes = ["week", "month", "year"];
    if (!allowedPlanTypes.includes(planType)) {
        return NextResponse.json({
            error: "Invalid plan type. Allowed values are: week, month, year."
        }, {
            status: 400
        });
    }

    const priceID = getPriceIdFromType(planType);
    if (!priceID) {
        return NextResponse.json({
            error: "Price ID not found for the specified plan type."
        }, {
            status: 400
        });
    }


    const sessions = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
            {
                price: priceID,
                quantity: 1,
            },
        ],
        customer_email: email,
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe`,
        metadata: {
            clerkUserId: userId,
            planType: planType,
        },
    });

    return NextResponse.json(
        { url: sessions.url },
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
    }
    catch(error: any) {
        console.error("Error creating checkout session:", error);
        return NextResponse.json(
            { error: "Internal Server Error." },
            { status: 500 }
        );
    }
    
}