'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { Loading } from '@/components/loading';
import { useModalStore } from '@/store/useModalStore';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

const sleep = (time: number) => new Promise((r) => setTimeout(r, time));

const abi = [
	{
		type: 'function',
		name: 'mintNft',
		inputs: [],
		outputs: [],
		stateMutability: 'nonpayable'
	}
];

// sepolia
const contractAddress = '0x5EcBC930C89AA39BB57534271324A4Cd6B81d4d7';

type PinataMetaData = {
	metaData: string;
	img: string;
};

export const MintButton = ({ metaData, img }: PinataMetaData) => {
	const [isLoading, setIsLoading] = useState(false);
	const [loadingText, setLoadingText] = useState('');
	const { toast } = useToast();
	const { isShow, setIsShow, renderCallback } = useModalStore();

	const [cid, setCid] = useState('');

	// 链上交互 START
	const { data: hash, error, isPending, writeContract } = useWriteContract();
	const { isLoading: isConfirming, isSuccess: isConfirmed } =
		useWaitForTransactionReceipt({ hash });
	useEffect(() => {
		console.log('交易状态发生改变');
		console.log(hash);
		console.log(error);
		console.log(isPending);
		console.log(isConfirming);
		console.log(isConfirmed);
		if (isPending) {
			setLoadingText('NFT上链中');
		} else if (isConfirmed) {
			setLoadingText('交易已完成');
			// 交易完成 需要保存绘制的点 然后调用重新渲染的函数
			savePoint();
			mintFinished(null);
		} else if (isConfirming) {
			// 交易确认中
			setLoadingText('交易确认中');
			setTimeout(() => {
				mintFinished(null);
			}, 3000);
		} else if (error) {
			console.log(error);
			setLoadingText('NFT上链失败：' + error.name);
			mintFinished(error.name);
		}
	}, [isPending, error, isConfirming, isConfirmed]);
	// 链上交互 END

	const uploadFile = async () => {
		const filePath = img;
		console.log(metaData, img);
		const fileStream = await fetch(filePath);
		const type = fileStream.headers.get('Content-Type') || '';
		const buffer = await fileStream.arrayBuffer();
		const file = new File([buffer], filePath.split('/').pop() || 'image', {
			type
		});
		const data = new FormData();
		data.set('file', file);
		data.set('metadata', metaData);
		console.log('START upload');
		const res = await fetch('/api/files', {
			method: 'POST',
			body: data
		});
		const resData = await res.json();
		setCid(resData.IpfsHash);
	};

	const handleMint = async () => {
		setIsLoading(true);
		setLoadingText('NFT数据上传中...');
		savePoint();
		await sleep(3000);
		// return mintFinished(1);
		try {
			await uploadFile();
			await sleep(3000);
			// 获取cid 保存至区块链中
			setLoadingText('NFT数据上链中...');
			writeContract({
				abi,
				address: contractAddress,
				functionName: 'mintNft'
				// args: [cid],
			});
		} catch (e) {
			return mintFinished(e);
		}
	};

	const mintFinished = (error: any) => {
		setLoadingText('');
		setIsShow(false);
		setIsLoading(false);
		if (error) {
			return toast({
				title: 'Something went wrong 💥' + error
			});
		} else {
			return toast({
				title: 'Mint successfully 🎉',
				description: (
					<a
						href={`https://sepolia.etherscan.io/tx/${hash}`}
						className="hover:underline"
						target="_blank"
					>
						View on explorer 🔗
					</a>
				),
				action: <ToastAction altText="Confirm">Confirm ✨</ToastAction>
			});
		}
	};

	const savePoint = () => {
		const mintedPoint = localStorage.getItem('mintedPoint')
			? JSON.parse(localStorage.getItem('mintedPoint') as string)
			: [];
		console.log('mintedPoint', mintedPoint);
		let curIndex = localStorage.getItem('currentPosition');
		if (curIndex) {
			// @ts-ignore
			curIndex = parseInt(curIndex, 10);
			if (!mintedPoint.includes(curIndex)) {
				mintedPoint.push(curIndex);
				window.localStorage.setItem('mintedPoint', JSON.stringify(mintedPoint));
			}
		}
		renderCallback && renderCallback();
	};

	return (
		<div>
			<Button
				variant="premium"
				className=" rounded-full p-4  font-semibold md:p-6 md:text-lg"
				onClick={handleMint}
			>
				Mint
			</Button>
			{isLoading && <Loading loadingText={loadingText} />}
		</div>
	);
};
