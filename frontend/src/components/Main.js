import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import Slider from "react-slick"; // Import Slider from react-slick

const Main = () => {
  const [trainData, setTrainData] = useState(null);
  const [numSeats, setNumSeats] = useState("");
  const [unbookSeats, setUnbookSeats] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showDialog, setShowDialog] = useState(false); // State to control dialog visibility
  const [dialogContent, setDialogContent] = useState(""); // State for dialog content

  const toastFunctions = {
    success: toast.success,
    error: toast.error,
    info: toast.info,
  };

  useEffect(() => {
    const fetchTrainData = async () => {
      try {
        const response = await axios.get("/api/train");
        setTrainData(response.data.train);
      } catch (error) {
        console.error("Fetch Train Data failed: ", error.message);
        const selectedToast = toastFunctions[error.response?.status] || toast;
        selectedToast(error.message, { icon: false }); // Remove icon
      }
    };
    fetchTrainData();
  }, []);

  const handleBookSeats = async () => {
    const userData = JSON.parse(localStorage.getItem("user")) || { id: null };

    try {
      const response = await axios.post(
        "/api/train/book",
        { numSeats },
        { headers: { "user-id": userData.id } }
      );
      const data = response.data;

      // Show custom dialog instead of immediate toast
      setDialogContent(`Booked Seat No: ${data.seats.join(", ")}`);
      setShowDialog(true);

      setNumSeats("");

      const newResponse = await axios.get("/api/train");
      setTrainData(newResponse.data.train);
    } catch (error) {
      console.error("Booking seats failed: ", error.message);
      const selectedToast = toastFunctions[error.response?.status] || toast;
      selectedToast(error.message, { icon: false }); // Remove icon
    }
  };

  const handleUnbookSeats = async () => {
    const userData = JSON.parse(localStorage.getItem("user")) || { id: null };

    try {
      const response = await axios.post(
        "/api/train/unbook",
        { seats: unbookSeats.split(",").map(Number) },
        { headers: { "user-id": userData.id } }
      );

      // Show custom dialog instead of immediate toast
      setDialogContent(`Unbooked Seat No: ${response.data.unbookedSeats.join(", ")}`);
      setShowDialog(true);

      setUnbookSeats("");

      const newResponse = await axios.get("/api/train");
      setTrainData(newResponse.data.train);
    } catch (error) {
      console.error("Unbooking seats failed: ", error.message);
      const selectedToast = toastFunctions[error.response?.status] || toast;
      selectedToast(error.message, { icon: false }); // Remove icon
    }
  };

  const handleInputChange = (event) => {
    const inputValue = parseInt(event.target.value) || "";
    if (inputValue < 1 || inputValue > 7) {
      setErrorMessage("Seats should be booked in a range of 1 - 7");
      setNumSeats("");
    } else {
      setNumSeats(inputValue);
      setErrorMessage("");
    }
  };

  const handleUnbookInputChange = (event) => {
    setUnbookSeats(event.target.value);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  if (!trainData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-5 flex flex-col md:flex-row items-center">
      <div className="max-w-md mx-auto md:max-w-2xl text-center">
        <h2 className="text-2xl text-[#ee5e5f] font-bold mb-14 pb-2 border-b border-[#eca74e4f] flex flex-col md:flex-row md:items-center md:justify-center">
          <span>Train Booking System by Train Trek</span>
        </h2>

        <div className="md:flex">
          <div className="w-full md:w-1/2">
            <Slider {...sliderSettings} className="md:h-full">
              <div className="relative">
                <img
                  src="https://i.imgur.com/ilDN4RY.png" // Delhi to Bangalore image
                  alt="Train Delhi to Bangalore"
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center py-2">
                  Delhi to Bangalore
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://i.imgur.com/ilDN4RY.png" // Delhi to Kolkata image (replace with actual image)
                  alt="Train Delhi to Kolkata"
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center py-2">
                  Delhi to Kolkata
                </div>
              </div>
            </Slider>
          </div>
        </div>

        {errorMessage && (
          <div className="text-red-500 mt-2">{errorMessage}</div>
        )}
        <input
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-5"
          id="numSeats"
          type="number"
          placeholder="Enter number of seats you want to book"
          min="1"
          max="7"
          value={numSeats}
          onChange={handleInputChange}
        />
        <div className="flex justify-between items-center">
          <button
            className="bg-[#eca74e] hover:bg-[#ee5e5f] duration-200 text-white font-bold py-2 px-4 rounded mt-5 mr-4 mx-auto block"
            onClick={handleBookSeats}
          >
            Book Seats
          </button>
        </div>

        {/* Unbooking section */}
        <input
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-5"
          id="unbookSeats"
          type="text"
          placeholder="Enter seat numbers to unbook (e.g., 2,4,5)"
          value={unbookSeats}
          onChange={handleUnbookInputChange}
        />
        <div className="flex justify-between items-center">
          <button
            className="bg-red-500 hover:bg-red-700 duration-200 text-white font-bold py-2 px-4 rounded mt-5 mr-4 mx-auto block"
            onClick={handleUnbookSeats}
          >
            Unbook Seats
          </button>
        </div>
      </div>

      <div className="mx-auto w-full md:w-1/2 md:ml-5 mt-5 md:mt-0">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-5">
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-center items-center">
                <i className="fa-solid fa-couch text-green-500"></i>
                <span className="ml-2 text-sm">Available</span>
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-couch text-red-500"></i>
                <span className="ml-2 text-sm">Booked</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4">
            <div className="grid grid-cols-7 gap-1 justify-center text-center">
              {trainData.coach.seats.map((seat) => (
                <div key={seat.number}>
                  {seat.isBooked ? (
                    <i className="fa-solid fa-couch text-red-500"></i>
                  ) : (
                    <i className="fa-solid fa-couch text-green-500"></i>
                  )}
                  <div className="text-xs">{seat.number}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Dialog Box */}
      {showDialog && (
        <div className="fixed top-0 right-0 m-5 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
          <div className="text-center mb-4">{dialogContent}</div>
          <div className="flex justify-end">
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={handleCloseDialog}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
