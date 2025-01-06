import mongoose from 'mongoose';
import Train from './model/train.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB with error handling
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('[DB] Connection Success');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit the process if connection fails
  }
};

connectToDatabase();

// Initialize seats data
const seats = [];
let number = 1;
for (let row = 1; row <= 12; row++) {
  let numSeatsInRow = row === 12 ? 3 : 7;
  for (let seat = 1; seat <= numSeatsInRow; seat++) {
    seats.push({
      number,
      row,
      isBooked: false,
    });
    number++;
  }
}

// Choose a random number of seats to mark as booked
const numBookedSeats = Math.floor(Math.random() * 3) + 6;

// Mark the seats as booked by shuffling the array and updating the isBooked property
for (let i = 0; i < numBookedSeats; i++) {
  const randomIndex = Math.floor(Math.random() * seats.length);
  seats[randomIndex].isBooked = true;
}

const coach = {
  seats,
};

const train = new Train({
  coach,
});

// Define a function to delete the data present in MongoDB
const deleteData = async () => {
  try {
    await Train.deleteMany({});
    console.log('Data deleted successfully');
  } catch (err) {
    console.error('Error deleting data', err);
  }
};

// Call the deleteData function before seeding new data
const seedData = async () => {
  await deleteData();
  try {
    await train.save();
    console.log('Train data seeded successfully');
  } catch (err) {
    console.error('Error seeding train data', err);
  } finally {
    mongoose.disconnect();
  }
};

seedData();
