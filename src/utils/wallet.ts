import Web3 from 'web3';

declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}

export const getWeb3 = async () => {
  return new Promise(async (resolve, reject) => {
    const web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      resolve(web3);
    } catch (error) {
      reject(error);
    }
  });
};

export const getAlreadyConnectedWeb3 = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let web3: any;
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
      } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
      }
      resolve(web3);
    } catch (error) {
      reject(error);
    }
  });
};