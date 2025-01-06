import express from "express";
import Train from "../model/train.js";
import Users from "../model/user.js";
import mongoose from "mongoose";

const trainRouter = express.Router();

// Route for getting the train data
trainRouter.get("/", async (req, res) => {
  try {
  
    const train = await Train.findOne()
      .select("-__v")
      .populate("coach.seats", "-_id -__v")
      .populate("bookings", "-_id -__v");

    if (!train) {
      return res
        .status(404)
        .json({ status: "error", message: "Train not found" });
    }

    // Map the seats data to a simpler array of boolean values indicating whether the seat is booked or not
    const seats = train.coach.seats.map((seat) => seat.isBooked);

    // Send the train data along with the simplified seats data to the client
    res.status(200).json({ status: "success", train, seats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Route for allowing any user to book seats
trainRouter.post("/book", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Extract user ID from request headers
    const userId = req.headers["user-id"];

    // Check if the user exists based on the extracted ID
    if (!userId) {
      return res
        .status(404)
        .json({ status: "error", message: "Please login first" });
    }

    const user = await Users.findById(userId).session(session);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    // Parse the requested number of seats from the client
    const numSeats = parseInt(req.body.numSeats);

    if (!numSeats || numSeats < 1 || numSeats > 7) {
      return res.status(400).json({
        status: "info",
        message: "Invalid number of seats requested",
      });
    }

    // Find the train with its coach and bookings data
    const train = await Train.findOne()
      .populate("coach.seats")
      .populate("bookings")
      .session(session);

    if (!train) {
      return res
        .status(404)
        .json({ status: "error", message: "Train not found" });
    }

    // Find the available seats for the requested number of seats
    let availableSeats = findAvailableSeats(train.coach.seats, numSeats);

    if (!availableSeats) {
      return res
        .status(400)
        .json({ status: "info", message: "No seats available" });
    }

    // Mark the available seats as booked
    await markSeatsAsBooked(train, availableSeats, session);

    // Create a new booking with the booked seat numbers
    train.bookings.push({ seats: availableSeats });

    await train.save();
    await session.commitTransaction();
    session.endSession();

    // Send the booked seat numbers to the client
    res.status(200).json({ status: "success", seats: availableSeats });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Route for allowing any user to unbook seats
trainRouter.post("/unbook", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Extract user ID from request headers
    const userId = req.headers["user-id"];

    // Check if the user exists based on the extracted ID
    if (!userId) {
      return res
        .status(404)
        .json({ status: "error", message: "Please login first" });
    }

    const user = await Users.findById(userId).session(session);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    // Parse the requested seat numbers from the client
    const unbookSeats = req.body.seats;

    if (!Array.isArray(unbookSeats) || unbookSeats.length === 0) {
      return res.status(400).json({
        status: "info",
        message: "No seats specified for unbooking",
      });
    }

    // Find the train with its coach and bookings data
    const train = await Train.findOne()
      .populate("coach.seats")
      .populate("bookings")
      .session(session);

    if (!train) {
      return res
        .status(404)
        .json({ status: "error", message: "Train not found" });
    }

    // Find and unmark the booked seats
    const unbookedSeats = unbookSeats.filter(seatNumber => {
      const seat = train.coach.seats.find(seat => seat.number === seatNumber);
      if (seat && seat.isBooked) {
        seat.isBooked = false;
        return true;
      }
      return false;
    });

    if (unbookedSeats.length === 0) {
      return res
        .status(400)
        .json({ status: "info", message: "No seats were unbooked" });
    }

    // Remove the unbooked seats from existing bookings
    train.bookings.forEach(booking => {
      booking.seats = booking.seats.filter(seatNumber => !unbookedSeats.includes(seatNumber));
    });

    await train.save();
    await session.commitTransaction();
    session.endSession();

    // Send the unbooked seat numbers to the client
    res.status(200).json({ status: "success", unbookedSeats });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Helper function to mark the booked seats as booked
async function markSeatsAsBooked(train, bookedSeats, session) {
  const seats = train.coach.seats;
  bookedSeats.forEach(seatNumber => {
    const seat = seats.find(seat => seat.number === seatNumber);
    if (seat) {
      seat.isBooked = true;
    }
  });
  train.markModified("coach.seats");
  await train.save({ session });
}

// Helper function to find the available seats for a requested number of seats
function findAvailableSeats(seats, numSeats) {
  let availableSeats = [];
  let currentSequence = 0;
  let start = 0;

  for (let i = 0; i < seats.length; i++) {
    if (!seats[i].isBooked) {
      currentSequence++;

      if (currentSequence === 1) {
        start = i;
      }

      if (currentSequence === numSeats) {
        availableSeats = seats.slice(start, i + 1).map(seat => seat.number);
        return availableSeats;
      }
    } else {
      currentSequence = 0;
    }
  }

  return null;
}

export default trainRouter;
