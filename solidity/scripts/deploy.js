async function main() {
  const BridgeContract = await ethers.getContractFactory("Bridge");
  const bridge_contract = await BridgeContract.deploy();
  console.log("Bridge is deployed at address: ", bridge_contract.address);
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.log(err);
    process.exit(1);
  });