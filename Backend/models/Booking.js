import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "User name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  flightNumber: {
    type: String,
    required: [true, "Flight number is required"],
  },
  origin: {
    type: String,
    required: [true, "Origin is required"],
  },
  destination: {
    type: String,
    required: [true, "Destination is required"],
  },
  date: {
    type: String,
    required: [true, "Date is required"],
  },
  passengers: {
    type: Number,
    required: [true, "Number of passengers is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"], // ✅ this field caused the old error
  },
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;