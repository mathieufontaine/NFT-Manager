const appId = "gjF9nlqrlqlthOwTanSYxUcfRthfyYw6tI9MdJ6A"; //Application ID
const serverUrl = "https://xn5ztwypqvmq.usemoralis.com:2053/server";

Moralis.start({ serverUrl, appId });

// const options = {
//   address: "0x32FC382175D470aeA4438420a6EE7b02C20BED80",
//   chain: "polygon"
// };

let NFTs;
let userAddress;
const list = document.querySelector(".list");

async function login() {
  let currentUser = Moralis.User.current();
  if (!currentUser) {
    try {
      currentUser = await Moralis.Web3.authenticate(); //Authenticate and add to DB
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  }
  alert("user is signed in");
  userAddress = currentUser.get("ethAddress");
  const myNFTs = await Moralis.Web3API.account.getNFTs({
    address: userAddress,
    chain: "goerli"
  });
  const results = await myNFTs.result;
  fetchNFTsData(results);
}

async function logOut() {
  await Moralis.User.logOut();
  list.innerHTML = "";
  console.log("logged out");
}

async function fetchNFTsData(data) {
  NFTs = data.map(async NFT => {
    const ownersList = await getOwners({
      address: NFT.token_address,
      token_id: NFT.token_id,
      chain: "goerli"
    });
    const myBalance = ownersList.filter(address => address == userAddress)
      .length;
    return {
      id: NFT.token_id,
      type: NFT.contract_type,
      amount: NFT.amount,
      meta: JSON.parse(NFT.metadata),
      uri: NFT.token_uri,
      owners: ownersList,
      balance: myBalance
    };
  });
  const myNFTS = await Promise.all(NFTs);
  console.log(myNFTS);
  renderNFTs(myNFTS);
}

const getOwners = async options => {
  const response = await Moralis.Web3API.token.getTokenIdOwners(options);
  const results = await response.result;
  const ownersList = results.map(address => address.owner_of);
  return ownersList;
};

function renderNFTs(NFTsArray) {
  NFTsArray.forEach(NFT => {
    if (NFT.meta !== null) {
      const div = document.createElement("div");
      div.innerHTML = `
        <div class="card" style="width: 18rem;">
        <img class="card-img-top" src="${NFT.meta.image}" alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">${NFT.meta.name}</h5>
          <p class="card-text">${NFT.meta.description}</p>
          <p class="card-text">Type of NFT: ${NFT.type}</p>
          <p class="card-text">Token ID: ${NFT.id}</p>
          <p class="card-text">Total supply of NFTs: ${NFT.amount}</p>
          <p class="card-text">Number of Owners: ${NFT.owners.length}</p>
          <p class="card-text">Your Balance: ${NFT.balance}</p>
          <a href="${NFT.meta.external_url}" class="btn btn-primary">More Information</a>
          <a href="./mint.html?nftId=${NFT.id}" class="btn btn-primary">Mint</a>
          <a href="./transfer.html?nftId=${NFT.id}" class="btn btn-primary">Transfer</a>
        </div>
      </div>
        `;
      list.appendChild(div);
    }
  });
}

document.getElementById("logout_button").onclick = logOut;
document.getElementById("login_button").onclick = login;
