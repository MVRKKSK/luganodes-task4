import React, { useState, useEffect } from "react";
import ResponsiveForm from "./profile/Form";
import Cookie from "js-cookie";
import axios from "axios";
import { format } from "date-fns";
import { ethers } from "ethers";
import fetchUser from "../hooks/getData";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import TokenExpiry from "./setTimer";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    ppimage: "",
    username: "",
    ethereumAddress: "",
  });
  const [activityLogs, setActivityLogs] = useState([]);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState("");
  const [network, setNetwork] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const connectToMetaMask = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const ethereumProvider = new ethers.providers.Web3Provider(
          window.ethereum
        );
        setProvider(ethereumProvider);
        setAccount(accounts[0]); // Set the account state here

        // Call web3Auth only once with the correct ethereumAddress
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/login/web3Auth`,
          { ethereumAddress: accounts[0], email: userData.email }
        );
        console.log(response.data.token);
        getNetwork(ethereumProvider);

        // Assuming you have "dispatch" and "Cookie" imported correctly
        dispatch({
          type: "LOGIN",
          payload: { loginMethod: "web3", user: response.data.token },
        });
        Cookie.set("User", JSON.stringify(response.data.token));

        setIsConnected(true);
      } else {
        console.log("MetaMask not detected. You should install MetaMask!");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };
  useEffect(() => {
    fetchUser().then((userData) => {
      // Do something with the user data, if needed
      setUserData(userData.userData);
    });
    fetchActivityLogs();
  }, []);

  const fetchActivityLogs = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${Cookie.get("User")}`,
        "Content-Type": "application/json",
        // Add more headers as needed
      };

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/getLogs`,
        { headers }
      );

      // Format the date for each activity log before setting it in the state
      const formattedLogs = response.data.logs.map((log) => ({
        ...log,
        timestamp: format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss"), // Format the date using date-fns
      }));

      const latestLogs = formattedLogs.slice(-6);

      setActivityLogs(latestLogs); // Set the formatted logs in the state
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    }
  };

  const handleEmailLogin = async () => {
    dispatch({
      type: "LOGIN",
      payload: { loginMethod: "email", user: Cookie.get("User") },
    });
    setIsConnected(false);
  };

  // const getAccount = async (provider) => {
  //   try {
  //     const accounts = await provider.listAccounts();
  //     if (accounts.length > 0) {
  //       setIsConnected(true);
  //       setAccount(accounts[0]);
  //       console.log("hello")
  //       const response = await axios.post(`${process.env.REACT_APP_API_URL}/login/web3Auth`, { ethereumAddress: account });
  //       console.log(response)
  //       const token = response.data.token;

  //       // Assuming you have "dispatch" and "Cookie" imported correctly
  //       dispatch({ type: "LOGIN", payload: { loginMethod: "web3", user: token } });
  //       Cookie.set("User", JSON.stringify(token));
  //       // Redirect to the desired route after successful login
  //       navigate("/");
  //     } else {
  //       setAccount("Not connected");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching account:", error);
  //   }
  // };

  const getNetwork = async (provider) => {
    try {
      const network = await provider.getNetwork();
      setNetwork(network.name);
    } catch (error) {
      console.error("Error fetching network:", error);
    }
  };

  const disconnectFromMetaMask = () => {
    setIsConnected(false);
    setAccount("");
  };

  const handleConnectClick = () => {
    connectToMetaMask();
  };
  console.log(account);
  const remainingTime = "10:00";

  return (
    <div className="min-h-screen p-2 bg-gray-100 flex items-center justify-center">
      <div className="container  ">
        <nav className="flex items-center justify-between p-4 bg-blue-500 text-white">
          <div>
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <div className="flex items-center">
            <div>
              {isConnected ? (
                <div>
                  <button
                    className="bg-white text-blue-500 px-4 py-2 rounded mr-4"
                    onClick={disconnectFromMetaMask}
                  >
                    disconnect
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    className="bg-white text-blue-500 px-4 py-2 rounded mr-4"
                    onClick={handleConnectClick}
                  >
                    Connect
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={handleEmailLogin}
              className="bg-white text-blue-500 px-4 py-2 rounded mr-4"
            >
              Email
            </button>
          </div>
        </nav>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Activity Logs</h2>
            <ul>
              {activityLogs.map((log, id) => (
                <li key={id} className="mb-2">
                  <span className="font-semibold">{log.log}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    {log.timestamp}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Session Timeout</h2>
            <TokenExpiry />
          </div>

          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-4">User Data</h2>
            {isConnected ? (
              <>
                <p>Ethereum Address: {account}</p>
                <p>Network: {network}</p>
              </>
            ) : (
              <ul>
                <li key={userData.id} className="mb-4">
                  <span className="font-semibold">Name:</span>
                  <span className="ml-2">{userData.name}</span>
                  <br />
                  <span className="font-semibold">Email:</span>
                  <span className="ml-2 max-w-md overflow-hidden overflow-ellipsis">
                    {userData.email}
                  </span>
                  <br />
                  <span className="font-semibold">Ethereum Address:</span>
                  <span className="ml-2 max-w-md overflow-hidden overflow-ellipsis">
                    {userData.ethereumAddress}
                  </span>
                  <br />
                  <span className="font-semibold">Profile Picture:</span>
                  <span className="ml-2">{userData.ppImage}</span>
                  <br />
                  <span className="font-semibold">Username:</span>
                  <span className="ml-2">{userData.username}</span>
                </li>
              </ul>
            )}
          </div>
        </div>

        <ResponsiveForm data={userData} />
      </div>
    </div>
  );
};

export default Dashboard;
