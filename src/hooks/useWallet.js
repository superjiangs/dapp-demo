import MetaMask from '../connectors'
import { HECO_MAINNET_ID, HECO_MAINNET_NAME, } from '../constants'

export default function useWallet(){
	const [metamask, hooks] = MetaMask

	const { useAccount, useChainId, useIsActive, useProvider } = hooks
	const account = useAccount()
	const chainId = useChainId()
	const isActive = useIsActive()
	const provider = useProvider()
	const chainName = isActive ? HECO_MAINNET_NAME : '--'

	const addNetwork = () => metamask.activate({
		chainId: 128,
		chainName: 'HecoMain',
		nativeCurrency: {
			name: 'HT',
			symbol: 'HT',
			decimals: 18,
		},
		rpcUrls: ['https://http-mainnet.hecochain.com'],
	});

	const connect = () => metamask.activate(HECO_MAINNET_ID);
	const connectEagerly = () => metamask.connectEagerly();
	const disconnect = () => metamask.deactivate();

	return {
		account,
		chainId,
		chainName,
		isActive,
		provider,
		connect,
		connectEagerly,
		disconnect,
		addNetwork,
	}
}