import React, { useCallback, useEffect, useReducer } from "react";
import * as Bowser from "bowser";
import axios from "axios";
import { getAlreadyConnectedWeb3, getWeb3 } from "@/utils/wallet";
import Web3 from "web3";

const Index = () => {
  const [state, setState] = useReducer(
    (prevState: any, nextState: any) => {
      return {
        ...prevState,
        ...nextState,
      };
    },
    {
      browserName: "",
      browserVersion: "",
      os: "",
      ipAddress: "",
      latitude: "",
      longitude: "",
      countryCode: "",
      city: "",
      provinceState: "",
      postalCode: "",
      countryName: "",
      resolution: "",
      deviceType: "",
      metaMaskAccount: "",
    }
  );

  useEffect(() => {
    handleFetch();
    getAccounts();
    const browser = Bowser.getParser(window.navigator.userAgent);
    setState({
      browserName: browser.getBrowserName(),
      deviceType: browser.getPlatformType(),
      browserVersion: browser.getBrowserVersion(),
      os: browser.getOS().name,
      resolution: `${window.outerWidth}x${window.outerHeight}`,
    });
  }, []);
  const getAccounts = useCallback(async () => {
    try {
      const web3: any = await getAlreadyConnectedWeb3();
      const accounts = await web3.eth.getAccounts();
      if (accounts.length) {
        setState({
          metaMaskAccount: accounts[0],
        });
      }
    } catch (error) {
      console.log("error ===>", error);
    }
  }, [setState, getAlreadyConnectedWeb3]);
  const handleFetch = async () => {
    try {
      const { data } = await axios("https://geolocation-db.com/json/", {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
      const {
        IPv4,
        city,
        country_code,
        country_name,
        latitude,
        longitude,
        postal,
        state: provinceState,
      } = data;
      setState({
        ipAddress: IPv4,
        city,
        countryCode: country_code,
        countryName: country_name,
        latitude,
        longitude,
        postalCode: postal,
        provinceState,
      });
    } catch (error) {
      console.log("err", error);
    }
  };
  const connectWallet = async () => {
    try {
      const web3: any = await getWeb3();
      const walletAddress = await web3.eth.requestAccounts();
      await web3.eth.getAccounts();
      setState({
        metaMaskAccount: walletAddress[0],
      });
    } catch (error) {
      console.log("err ===>", error);
    }
  };
  return (
    <div>
      <p>Browser Name: {state.browserName}</p>
      <p>Browser Version: {state.browserVersion}</p>
      <p>Operating System: {state.os}</p>
      <p>Device Type: {state.deviceType}</p>
      <p>Ip Address: {state.ipAddress}</p>
      <p>Country Code: {state.countryCode}</p>
      <p>Country Name: {state.countryName}</p>
      <p>Province: {state.provinceState}</p>
      <p>Latitude: {state.latitude}</p>
      <p>Longitude: {state.longitude}</p>
      <p>PostalCode: {state.postalCode}</p>
      <p>Resolution: {state.resolution}</p>
      <p>Meta Mask Account Number: {state.metaMaskAccount}</p>
      <button onClick={connectWallet}>Connect Metamask Wallet</button>
    </div>
  );
};

export default Index;
