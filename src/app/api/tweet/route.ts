import { tweetTable } from "@/db/schema";
import { db } from "@/index";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:Request) {
    try {
        const tweet = await db
    .select()
	.from(tweetTable)
	
    return NextResponse.json({
        tweet,
        message: "tweet Fetched successfully"
    }, {status: 201})
    } catch (error) {
        console.log("Error inorder to fetching the tweet");
        
    }
    
}