import React, { useState, useEffect } from "react";
import image1 from "./image1.svg";
import { ethers } from "ethers";
import  "./Login.css"
import logo from "./logo.png";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialValues = {
    email: "",
    password: ""
  }

  const [login, setLogin] = useState(initialValues);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  }

  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState('');
  const [network, setNetwork] = useState('');

  const connectToMetaMask = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const ethereumProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(ethereumProvider);
        getAccount(ethereumProvider);
        getNetwork(ethereumProvider);
      } else {
        console.log('MetaMask not detected. You should install MetaMask!');
      }
    } catch (error) {
      console.error('User denied account access');
    }
  };

  const getAccount = async (provider) => {
    try {
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount('Not connected');
      }
    } catch (error) {
      console.error('Error fetching account:', error);
    }
  };

  const getNetwork = async (provider) => {
    try {
      const network = await provider.getNetwork();
      setNetwork(network.name);
    } catch (error) {
      console.error('Error fetching network:', error);
    }
  };
  
  const handleConnectClick = () => {
    connectToMetaMask();
    console.log(account);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, login);
    const token = response.data.token;
    // const tokens = response.headers['Authorization'];
    // console.log(tokens)
    // const data = response.data;

    setTimeout(() => {
      dispatch({ type: "LOGIN", payload: { loginMethod: "email", user: token } });
      Cookie.set("User", JSON.stringify(token));
      navigate("/"); // Redirect to the desired route after successful login
    },);
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className="Login-body">
      <img className="logo" src={logo} alt="" />
      <section className="h-screen">
        <div className="px-6 h-full text-white">
          <div
            className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6"
          >
            <div
              className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0"
            >
              <img
                src={image1}
                className="w-full"
                alt="image1"
              />
            </div>
            <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-row items-center justify-center lg:justify-start">
                  <p className="text-lg mb-0 mr-4">Sign in with</p>
                  <button type="button" onClick={handleConnectClick} class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Connect</button>
                </div>

                <div
                  className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5"
                >
                  <p className="text-center font-semibold mx-4 mb-0">Or</p>
                </div>


                <div className="mb-6">
                  <input
                    type="text"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    placeholder="Email address"
                    name="email"
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-6">
                  <input
                    type="password"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    placeholder="Password"
                    name="password"
                    onChange={handleChange}
                  />
                </div>

                <div className="flex justify-between items-center mb-6">
                  <div className="form-group form-check">
                    <input
                      type="checkbox"
                      className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                      id="exampleCheck2"
                    />
                    <label className="form-check-label inline-block text-white" for="exampleCheck2"
                    >Remember me</label
                    >
                  </div>
                  <a href="#!" className="text-white">Forgot password?</a>
                </div>

                <div className="text-center lg:text-left">
                  <button
                    type="submit"
                    className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                  >
                    Login
                  </button>
                  <p className="text-sm font-semibold mt-2 pt-1 mb-0">
                    Don't have an account?
                    <a
                      href="/signup"
                      className="text-red-600 hover:text-red-700 focus:text-red-700 transition duration-200 ease-in-out"
                    >Register</a
                    >
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;