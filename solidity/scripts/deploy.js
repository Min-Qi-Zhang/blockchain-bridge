async function main() {
  const OriginContract = await ethers.getContractFactory("OriginContract");
  const origin_contract = await OriginContract.deploy("Default message on origin chain");
  console.log("OriginContract is deployed at address: ", origin_contract.address);
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.log(err);
    process.exit(1);
  });