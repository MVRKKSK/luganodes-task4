import axios from 'axios';
import Cookie from 'js-cookie';

// Function to fetch user data from the server or your authentication context
const fetchUser = async () => {
  try {
    const headers = {
      'Authorization': `Bearer ${Cookie.get('User')}`, // Replace with your authorization token
      'Content-Type': 'application/json', // Replace with the appropriate content type if needed
      // Add more headers as needed
    };
    console.log(Cookie.get('User'));
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/user`, { headers });
    console.log(response.data); // Replace with the appropriate API endpoint

    return response.data; // Return the user data
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null; // Return null or any default value in case of an error
  }
};

export default fetchUser;