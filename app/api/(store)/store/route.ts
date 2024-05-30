import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Store from "@/lib/models/store";

export const GET = async () => {
  try {
    await connect();
    const stores = await Store.find();

    return new NextResponse(
      JSON.stringify({ message: "Stores fetched successfully!", data: stores }),
      { status: 200 }
    );
  } catch (err) {
    return new NextResponse("Error in fetching all stores" + err, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();
    const newStore = new Store(body);
    await newStore.save();
    return new NextResponse(
      JSON.stringify({
        message: "Store created successfully!",
        data: newStore,
      }),
      {
        status: 201,
      }
    );
  } catch (err) {
    return new NextResponse("Error in creating store" + err, { status: 500 });
  }
};
