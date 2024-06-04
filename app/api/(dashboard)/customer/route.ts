import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Customer from "@/lib/models/customer";
import Store from "@/lib/models/store";
import { Types } from "mongoose";

// get all customers api routes
export const GET = async (request: Request) => {
  try {
    // extract the store id from the search params
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId");

    // check if the storeId exist and is valid
    if (!storeId || !Types.ObjectId.isValid(storeId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing storeId!" }),
        { status: 400 }
      );
    }

    // establish a connection with database
    await connect();

    // check if the store exists in the database
    const store = await Store.findById(storeId);
    if (!store) {
      return new NextResponse(
        JSON.stringify({ message: "Store does not exist!" }),
        { status: 400 }
      );
    }

    // extract all the available customer
    const customers = await Customer.find({
      store: new Types.ObjectId(storeId),
    }).populate({ path: "store", select: ["_id", "name"] });

    // send them to the frontend
    return new NextResponse(
      JSON.stringify({
        message: "Customers fetched successfully!",
        data: customers,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new NextResponse("Error in fetching customer " + err, {
      status: 500,
    });
  }
};

// create a customer api routes
export const POST = async (request: Request) => {
  try {
    // extract the values frem the request object
    const { firstName, lastName, email, phoneNumber, storeId } =
      await request.json();

    // check if the storeId exist and is valid
    if (!storeId || !Types.ObjectId.isValid(storeId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing storeId!" }),
        { status: 400 }
      );
    }

    // establish the connection with database
    await connect();

    // check if the store exists in the database
    const store = await Store.findById(storeId);
    if (!store) {
      return new NextResponse(
        JSON.stringify({ message: "Store does not exist!" }),
        { status: 400 }
      );
    }

    // create the new customer object
    const newCustomer = new Customer({
      firstName,
      lastName,
      email,
      phoneNumber,
      store: new Types.ObjectId(storeId),
    });

    // save the info in the dabatabse
    await newCustomer.save();

    // send the confirmation to frontend
    return new NextResponse(
      JSON.stringify({
        message: "Customer created successfully!",
        data: newCustomer,
      }),
      {
        status: 201,
      }
    );
  } catch (err) {
    return new NextResponse("Error in creating customer " + err, {
      status: 500,
    });
  }
};

// update customer api
export const PUT = async (request: Request) => {
  try {
    // extract the values frem the request object
    const { firstName, lastName, email, phoneNumber, storeId, customerId } =
      await request.json();

    // check if the storeId exist and is valid
    if (!storeId || !Types.ObjectId.isValid(storeId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing storeId!" }),
        { status: 400 }
      );
    }

    // check if the customerId exisit and is valid
    if (!customerId || !Types.ObjectId.isValid(customerId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing customerId!" }),
        { status: 400 }
      );
    }

    // establish the connection with database
    await connect();

    // check if the store exists in the database
    const store = await Store.findById(storeId);
    if (!store) {
      return new NextResponse(
        JSON.stringify({ message: "Store does not exist!" }),
        { status: 400 }
      );
    }

    // check if the customer exists in the database
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return new NextResponse(
        JSON.stringify({ message: "Customer does not exist!" }),
        { status: 400 }
      );
    }

    // check if the customer belongs to this store or not
    if (String(customer.store) !== String(storeId)) {
      return new NextResponse(
        JSON.stringify({ message: "Customer does not belong to this store!" }),
        { status: 400 }
      );
    }

    // update the customer
    const updateCustomer = await Customer.findOneAndUpdate(
      { _id: customer._id },
      {
        firstName,
        lastName,
        email,
        phoneNumber,
      },
      {
        new: true,
      }
    );

    // check if the process successed
    if (!updateCustomer) {
      return new NextResponse(
        JSON.stringify({ message: "Customer not updated!" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Customer updated successfully!",
        data: updateCustomer,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new NextResponse("Error in creating customer " + err, {
      status: 500,
    });
  }
};

// delete customer api
export const DELETE = async (request: Request) => {
  try {
    // extract the values frem the request object
    const { firstName, lastName, email, phoneNumber, storeId, customerId } =
      await request.json();

    // check if the storeId exist and is valid
    if (!storeId || !Types.ObjectId.isValid(storeId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing storeId!" }),
        { status: 400 }
      );
    }

    // check if the customerId exisit and is valid
    if (!customerId || !Types.ObjectId.isValid(customerId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing customerId!" }),
        { status: 400 }
      );
    }

    // establish the connection with database
    await connect();

    // check if the store exists in the database
    const store = await Store.findById(storeId);
    if (!store) {
      return new NextResponse(
        JSON.stringify({ message: "Store does not exist!" }),
        { status: 400 }
      );
    }

    // check if the customer exists in the database
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return new NextResponse(
        JSON.stringify({ message: "Customer does not exist!" }),
        { status: 400 }
      );
    }

    // check if the customer belongs to this store or not
    if (String(customer.store) !== String(storeId)) {
      return new NextResponse(
        JSON.stringify({ message: "Customer does not belong to this store!" }),
        { status: 400 }
      );
    }

    const deleteCustomer = await Customer.findByIdAndDelete({
      _id: customer._id,
    });

    // check if the process successed
    if (!deleteCustomer) {
      return new NextResponse(
        JSON.stringify({ message: "Customer not deleted!" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: `${customer.firstName} ${customer.lastName} has been deleted successfully!`,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new NextResponse("Error in deleting customer " + err, {
      status: 500,
    });
  }
};
