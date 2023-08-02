// AuthSwitch.js
import React, { useState } from 'react';
import axios from 'axios';

const AuthSwitch = ({ user, setUser }) => {
  const [authMethod, setAuthMethod] = useState(user.authMethod || 'email');

  const handleAuthSwitch = async (method) => {
    try {
      const response = await axios.post('/api/auth/switch-auth-method', {
        userId: user.id,
        authMethod: method,
      });
      if (response.data.success) {
        setUser({ ...user, authMethod: method });
        setAuthMethod(method);
        // You may also want to show a success message to the user here
      } else {
        // Handle the error scenario if the server request fails
        // You may want to display an error message to the user
      }
    } catch (error) {
      console.error('Error switching authentication method:', error);
    }
  };

  return (
    <div>
      <h3>Authentication Method</h3>
      <div>
        <label>
          <input
            type="radio"
            value="email"
            checked={authMethod === 'email'}
            onChange={() => handleAuthSwitch('email')}
          />
          Email/Password
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="web3"
            checked={authMethod === 'web3'}
            onChange={() => handleAuthSwitch('web3')}
          />
          Web3 (Ethereum)
        </label>
      </div>
    </div>
  );
};

export default AuthSwitch;
