import { parseEther, formatEther } from 'ethers/lib/utils';
import useWallet from '../hooks/useWallet'
import { Tag } from 'antd';
import { useEffect, useState } from 'react';

export default function AppHeader() {
	const { account, chainId, chainName, isActive, provider, connect, connectEagerly, disconnect } = useWallet();
	const [balance, setBalance] = useState('0')
	const ActiveStatus = <Tag color={"success"} onClick={disconnect}>已连接</Tag>	
	const NotActiveStatus = <Tag color={"error"} onClick={connect} >未连接</Tag>	
	const Status = isActive ? ActiveStatus : NotActiveStatus;

	useEffect(() => {
		connectEagerly();
	}, [])

	useEffect(() => {
		getBalance()
	}, [account])

	function getBalance() {
		if (account) {
			provider.getBalance(account).then(i => {
				console.log(formatEther(i))
				setBalance(formatEther(i))
			})
		}
	}

	return (
	<div className='app-header'>
		<div>Account: {account || '--'}</div>
		<div>ChainId: {chainId || '--'}</div>
		<div>ChainName: {chainName || '--'}</div>
		<div>Balance: {balance || '0.0'}</div>
		{Status}
	</div>
	);
}
