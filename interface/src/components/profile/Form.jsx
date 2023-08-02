import { react, useState, useEffect } from "react";
import axios from "axios";
import Cookie from "js-cookie";
const ResponsiveForm = ({data}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    ethereumAddress: "",
    ppImage: "",
  });
  const [error, setError] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      formData.email = "miryala.kautilya2020@vitbhopal.ac.in";
      // Filter out the fields with empty values from the formData
      const fieldsToUpdate = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== "")
      );
      // console.log(Cookie.get('User'));
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/updateUser`,
        fieldsToUpdate
      );
      console.log("User data updated successfully:", response.data);
      setError(null); // Clear any previous error message
    } catch (error) {
      console.error("Error updating user data:", error);
      setError("Failed to update user data. Please try again later."); // Set the error message state
    }
  };

  return (
    <div className=" container w-full p-6 p-2 bg-gray-100 flex items-center justify-center">
      {/* ...Rest of the component code... */}
      <div className="bg-white rounded shadow-lg p-4 px-4 ">
        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
          <div className="text-gray-600">
            <p className="font-medium text-lg">Personal Details</p>
            <p>Please fill out all the fields.</p>
          </div>

          <div className="lg:col-span-2">
            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
              <div className="md:col-span-5">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={data.name}
                />
              </div>

              <div className="md:col-span-5">
                <label htmlFor="email">Email Address</label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={data.email}
                />
              </div>

              <div className="md:col-span-5">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder={data.username}
                />
              </div>

              <div className="md:col-span-5">
                <label htmlFor="ethereumAddress">Ethereum Address</label>
                <input
                  type="text"
                  name="ethereumAddress"
                  id="ethereumAddress"
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  value={formData.ethereumAddress}
                  onChange={handleChange}
                 placeholder={data.ethereumAddress}
                />
              </div>

              <div className="md:col-span-5">
                <label htmlFor="ppImage">Profile Picture Image URL</label>
                <input
                  type="text"
                  name="ppImage"
                  id="ppImage"
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  value={formData.ppImage}
                  onChange={handleChange}
                  placeholder={data.ppImage}
                />
              </div>
              <div className="md:col-span-1">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {error && <div className="text-red-600 mt-4">{error}</div>}
      {/* ...Rest of the component code... */}
    </div>
  );
};

export default ResponsiveForm;
