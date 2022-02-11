// import * as contractAbi from "./abi.js";

const appId = "gjF9nlqrlqlthOwTanSYxUcfRthfyYw6tI9MdJ6A"; //Application ID
const serverUrl = "https://xn5ztwypqvmq.usemoralis.com:2053/server"; // serverURL
const CONTRACT_ADDRESS = "0x4467afff981bd3dcc5bca0875820b07ee37779d9";

Moralis.start({ serverUrl, appId });
let accounts;
let web3;

async function init() {
  let currentUser = Moralis.User.current();
  if (!currentUser) {
    try {
      currentUser = await Moralis.Web3.authenticate(); //Authenticate and add to DB
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  }

  await Moralis.enableWeb3();
  web3 = await new Web3(Moralis.provider);
  accounts = await web3.eth.getAccounts();
  const nftId = new URLSearchParams(document.location.search).get("nftId");
  document.querySelector("#token_id_input").value = nftId;
  document.querySelector("#address_input").value = accounts[0];
  //   alert("user is signed in");
}

async function mint() {
  let tokenId = parseInt(document.querySelector("#token_id_input").value);
  let address = document.querySelector("#address_input").value;
  let amount = parseInt(document.querySelector("#amount_input").value);
  //   const accounts = web3.eth.getAccounts();
  const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
  contract.methods
    .mint(address, tokenId, amount)
    .send({ from: accounts[0], value: 0 })
    .on("receipt", () => alert("Mint done!"));
}

init();
document.getElementById("submit_mint").onclick = mint;
