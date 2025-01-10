// utils/web3Config.js
import Web3 from 'web3';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './contracts/contractABI';

export const initWeb3 = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return web3;
    } catch (error) {
      throw new Error("User denied account access");
    }
  } else if (window.web3) {
    return new Web3(window.web3.provider);
  } else {
    throw new Error("No Web3 provider detected");
  }
};

export const getContract = async () => {
  const web3 = await initWeb3();
  return new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
};

export const getCurrentAccount = async () => {
  const web3 = await initWeb3();
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
};