import { BaseContract, ethers, Interface, InterfaceAbi } from "https://esm.sh/ethers@6.7.0";
export default abstract class Contract<CT extends BaseContract> {
    protected ethersContract: CT;
    constructor(address: string, abi: Interface | InterfaceAbi, signer: ethers.Signer);
}
//# sourceMappingURL=Contract.d.ts.map