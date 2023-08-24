import VaultABI from './abi/vault.json'
import ERC20ABI from './abi/erc20.json'
import { Contract } from "ethers"

export function makeContract(address, abi, provider){
	return new Contract(address, abi, provider)
}

export const makeVaultContract = (address, provider) => new Contract(address, VaultABI, provider )
export const makeERC20Contract = (address, provider) => new Contract(address, ERC20ABI, provider )