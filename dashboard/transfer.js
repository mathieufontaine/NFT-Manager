// import * as contractAbi from "./abi.js";

const appId = "gjF9nlqrlqlthOwTanSYxUcfRthfyYw6tI9MdJ6A"; //Application ID
const serverUrl = "https://xn5ztwypqvmq.usemoralis.com:2053/server"; // serverURL
const CONTRACT_ADDRESS = "0x4467afff981bd3dcc5bca0875820b07ee37779d9";

Moralis.start({ serverUrl, appId });

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

  const nftId = new URLSearchParams(document.location.search).get("nftId");
  document.querySelector("#token_id_input").value = nftId;

  //   alert("user is signed in");
}

async function transfer() {
  let tokenId = parseInt(document.querySelector("#token_id_input").value);
  let address = document.querySelector("#address_input").value;
  let amount = parseInt(document.querySelector("#amount_input").value);

  const options = {
    type: "erc1155",
    receiver: address,
    contractAddress: CONTRACT_ADDRESS,
    tokenId: tokenId,
    amount: amount
  };
  let transaction = await Moralis.transfer(options);
  console.log(transaction);
}

init();
document.getElementById("submit_transfer").onclick = transfer;
