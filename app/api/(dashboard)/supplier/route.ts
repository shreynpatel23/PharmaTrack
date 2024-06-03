import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Supplier from "@/lib/models/supplier";
import { Types } from "mongoose";

export const GET = async () => {
  try {
    // establish a connection with database
    await connect();

    // extract all the available suppliers
    const suppliers = await Supplier.find();

    // send them to the frontend
    return new NextResponse(
      JSON.stringify({
        message: "Supplier fetched successfully!",
        data: suppliers,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new NextResponse("Error in fetching supplier " + err, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const { firstName, lastName, email, phoneNumber, location } =
      await request.json();

    // establish the connection with database
    await connect();

    // create the new supplier object
    const newSupplier = new Supplier({
      firstName,
      lastName,
      email,
      phoneNumber,
      location,
    });

    // save the info in the dabatabse
    await newSupplier.save();

    // send the confirmation to frontend
    return new NextResponse(
      JSON.stringify({
        message: "Supplier created successfully!",
        data: newSupplier,
      }),
      {
        status: 201,
      }
    );
  } catch (err) {
    return new NextResponse("Error in creating supplier " + err, {
      status: 500,
    });
  }
};

export const PUT = async (request: Request) => {
  try {
    // extract the fields from the request object
    const { supplierId, firstName, lastName, email, phoneNumber, location } =
      await request.json();

    // establish the connection with database
    await connect();

    // check if the supplierId is valid
    if (!supplierId || !Types.ObjectId.isValid(supplierId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing supplierId!" }),
        { status: 400 }
      );
    }

    // check if the supplier exists in the database
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return new NextResponse(
        JSON.stringify({ message: "Supplier does not exist!" }),
        { status: 400 }
      );
    }

    // update the supplier
    const updatedSupplier = await Supplier.findOneAndUpdate(
      { _id: supplier._id },
      {
        firstName,
        lastName,
        email,
        phoneNumber,
        location,
      },
      {
        new: true,
      }
    );

    // check if the process successed
    if (!updatedSupplier) {
      return new NextResponse(
        JSON.stringify({ message: "Supplier not updated!" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Supplier updated successfully!",
        data: updatedSupplier,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new NextResponse("Error in updating supplier " + err, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request) => {
  try {
    // extract the fields from the request object
    const { supplierId } = await request.json();

    // establish the connection with database
    await connect();

    // check if the supplierId is valid
    if (!supplierId || !Types.ObjectId.isValid(supplierId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing supplierId!" }),
        { status: 400 }
      );
    }

    // check if the supplier exists in the database
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return new NextResponse(
        JSON.stringify({ message: "Supplier does not exist!" }),
        { status: 400 }
      );
    }

    const deleteSupplier = await Supplier.findByIdAndDelete({
      _id: supplier._id,
    });

    // check if the process successed
    if (!deleteSupplier) {
      return new NextResponse(
        JSON.stringify({ message: "Supplier not deleted!" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: `Supplier, ${supplier.firstName} ${supplier.lastName} has been deleted successfully!`,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new NextResponse("Error in deleting supplier " + err, {
      status: 500,
    });
  }
};
