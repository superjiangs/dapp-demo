import { Card, Button, Input } from 'antd';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { POOL_LIST } from '../constants'
import { makeVaultContract, makeERC20Contract } from '../contract';
import useWallet from '../hooks/useWallet';

export default function PoolCard() {
	const pool = POOL_LIST[0];
	const { provider, account } = useWallet()
	const [depositCap, setDepositCap] = useState('0')
	const [depositBalance, setDepositBalance] = useState('0')
	const [erc20Balance, setErc20Balance] = useState('0')
	const [value, setValue] = useState('')
	const [allowance, setAllowance] = useState('')
	const [approveLoading, setApproveLoading] = useState(false)	


	useEffect(() => {
		if(provider && account){
			getData()
			getBalance()
		}
	}, [provider, account])

	function getData(){
		const contract = makeVaultContract(pool.address, provider);
		contract.depositCap().then(i => {
			setDepositCap(formatEther(i))
		})
		contract.depositBalance(account).then(i => {
			setDepositBalance(formatEther(i))
		})

	}

	async function getBalance(){
		const contract = makeVaultContract(pool.address, provider);
		const underlyingAddress = await contract.underlying()
		const erc20Contract = makeERC20Contract(underlyingAddress, provider);
		erc20Contract.balanceOf(account).then(i => {
			setErc20Balance(formatEther(i))
		})

		erc20Contract.allowance(account, pool.address).then( i => {
			setAllowance(formatEther(i))
		})
	}

	async function deposit(){
		console.log(value)
		const contract = makeVaultContract(pool.address, provider.getSigner());
		const weiAmount = parseEther(value)
		const tx = await contract.deposit(weiAmount)
		console.log(tx)
		const receipt = await tx.wait()
		console.log(receipt)
		getData();
	}

	async function withdraw(){
		const contract = makeVaultContract(pool.address, provider.getSigner());
		const tx = await contract.withdraw()
		console.log(tx)
		const receipt = await tx.wait()
		console.log(receipt)
		getData()
	}

	async function cancelApprove(){
		const contract = makeVaultContract(pool.address, provider);
		const underlyingAddress = await contract.underlying()
		const erc20Contract = makeERC20Contract(underlyingAddress, provider.getSigner());
		const tx = await erc20Contract.approve(pool.address, 0)
		await tx.wait()
		getBalance()
	}
	async function approve(){
		setApproveLoading(true)
		const contract = makeVaultContract(pool.address, provider);
		const underlyingAddress = await contract.underlying()
		const erc20Contract = makeERC20Contract(underlyingAddress, provider.getSigner());
		const tx = await erc20Contract.approve(pool.address, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
		await tx.wait()
		setApproveLoading(false)
		getBalance()
	}

    return (
	<div className='card-container'>
		<Card title={pool.name} className="card">
			<div>总额度：{depositCap} USDT</div>
			<div>我的已存入：{depositBalance}</div>
			<div>USDT余额：{erc20Balance}</div>
			<div>USDT授权额度：{allowance}</div>
			<Input placeholder='请输入存入数量' value={value} onChange={v => setValue(v.target.value)}></Input>
			<Button type='primary' onClick={deposit}>存入</Button>
			<Button onClick={withdraw}>取回</Button>
			<Button onClick={cancelApprove}>取消授权</Button>
			<Button onClick={approve} loading={approveLoading}>授权</Button>
		</Card>	
	</div>
	);
}
