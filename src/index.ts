import { ethers } from 'ethers';

const BASE_URL = 'https://pro-api.coinmarketcap.com/v3/fear-and-greed/latest?CMC_PRO_API_KEY';
const API_KEY = 'coinmarketcap_api_key_here';
const ORACLE_PK = 'ORACLE_PRIVATE_KEY_HERE';
// Contract Addresses
const AIRDAO_CONTRACT_ADDRESS = '0xDF644855754F1C2E0D78BB647E6c1ECB12b7B126';
const FHENIX_CONTRACT_ADDRESS = 'Fhenix castle address here';
const ROOTSTOCK_CASTLE_ADDRESS = 'Rootstock castle address here';
// RPC URL for AirDao Testnet
const RPC_URL_AIRDAO_TESTNET = 'https://network.ambrosus-test.io';
const RPC_URL_FHENIX_TESTNET = 'https://api.helium.fhenix.zone'; 
const RPC_URL_ROOTSTOCK_TESTNET = 'https://public-node.testnet.rsk.co';


async function getFearGreedIndex() {
  const response = await fetch(`${BASE_URL}=${API_KEY}`);
  const data = await response.json();
  const index = data["data"]["value"];
  console.log(`Fear Freen Index is: ${index}`);
  return index;
}


async function callIndexChange(index: number) {
  // Connect to the Ethereum network (replace with your preferred provider URL)
  const provider = new ethers.JsonRpcProvider(RPC_URL_AIRDAO_TESTNET);

  // Create a wallet instance
  const wallet = new ethers.Wallet(ORACLE_PK, provider);

  // Create a contract instance
  const contractABI = [
    "function setWeather(uint8 newWeather) external",
    "event WeatherChanged(uint8 newWeather)"
  ];
  const contract = new ethers.Contract(AIRDAO_CONTRACT_ADDRESS, contractABI, wallet);

  console.log("Calling setWeather function...");
  try {
    const tx = await contract.setWeather(weatherCondition);
    console.log("Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);

    // Check for the WeatherChanged event
    const weatherChangedEvent = receipt.logs.find(
      (log: any) => log.topics[0] === ethers.id("WeatherChanged(uint8)")
    );
    if (weatherChangedEvent) {
      const [newWeather] = ethers.AbiCoder.defaultAbiCoder().decode(['uint8'], weatherChangedEvent.data);
      console.log("New weather set:", Weather[newWeather]);
    }
  } catch (error) {
    console.error("Error calling setWeather:", error);
  }
}

async function fetchAndPostWeatherData() {
  try {
    const condition = await getWeatherData();
    const weatherEnum = weatherConditionToEnum(condition);
    try {
      await callWeatherChange(weatherEnum);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  } catch (error) {
    console.error("Error getting data:", error);
  }
}

fetchAndPostWeatherData();