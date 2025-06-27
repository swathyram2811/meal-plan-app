import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure you have Prisma set up

export async function GET() {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const profile = await prisma.profile.findUnique({
            where: { userId: clerkUser.id }
        });

        if (!profile) {
            return NextResponse.json({ susbscription: null });
        }

        return NextResponse.json({ subscription: profile });
    }
    catch (error: any) {
            console.error("Error in subscription status route:", error);
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
    }
