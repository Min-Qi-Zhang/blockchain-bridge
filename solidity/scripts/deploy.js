async function main() {
  const OriginContract = await ethers.getContractFactory("Bridge");
  const origin_contract = await OriginContract.deploy("Deploying bridge");
  console.log("Bridge is deployed at address: ", origin_contract.address);
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.log(err);
    process.exit(1);
  });