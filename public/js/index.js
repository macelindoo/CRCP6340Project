import { ethers } from "./ethers-5.2.esm.js";
import { contractABI } from "./contractABI.js";
import "./ejs.js";

"use strict";

export let provider = null;
export let signer = null;
export let userAddress = null;

//Get project, contract, and mint data from div tags in index.ejs
export let contractList = document
  .querySelector("#contracts")
  .innerHTML.split(",");
export let mintList = document.querySelector("#mints").innerHTML.split(",");
export let projectList = JSON.parse(
  document.querySelector("#projects").innerHTML
);

  let connect = document.querySelector("#wallet-connect");
  await connectWallet();
  document.querySelector("#mints").innerHTML = mintList;
  connect.addEventListener("click", async () => {
    connectWallet();
  });
  await updateMints();

async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    connect.innerHTML = "Connected";
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    const accounts = await ethereum.request({ method: "eth_accounts" });
    userAddress = "" + accounts[0];
    console.log("userAddress: ", userAddress);
    let walletString =
      userAddress.substring(0, 5) + "..." + userAddress.substring(38, 42);
    connect.innerHTML = walletString;
    console.log("provider: ", provider);
    console.log("wallet: ", userAddress);
    console.log("signer: ", signer);
  } else {
    connect.innerHTML = "Please install MetaMask";
  }
}

export async function updateMints() {
  let newList = [];
  console.log(contractList);
  for (let i = 0; i < contractList.length; i++) {
    let contractAddress = contractList[i];
      if (contractAddress) {
      console.log("Contract: ", contractAddress);
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      console.log(contractABI);
      contract.connect(signer);
      console.log(signer);
      console.log(contract);
      let num = await contract.totalSupply();
      console.log(num);
      newList.push(num.toString());
    }
      else {
        newList.push("0");
      }}
  mintList = [...newList];
}
