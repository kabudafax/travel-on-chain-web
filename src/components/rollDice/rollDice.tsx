'use client';
import './styles.scss';
import { cn } from '@/lib/utils';
import { parseEther, formatEther } from 'viem';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useWatchContractEvent } from 'wagmi';
import contractABI from './TravelVRFV2Plus.json';
import { Loading } from '@/components/loading';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';

// sepolia
export const contractAddress = '0x1b10AbF4a94AB96a4CDefE8B6Df08DD6A9e9A6b5';

export const RollDice = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [loadingText, setLoadingText] = useState('');
	const { toast } = useToast();

	const { data: hash, writeContract, writeContractAsync } = useWriteContract();

	useWatchContractEvent({
		address: contractAddress,
		abi: contractABI.abi,
		eventName: 'RequestFulfilled',
		onLogs(logs) {
			console.log('New logs!', logs);
			setIsLoading(false);
			return toast({
				title: 'random dice' + logs
			});
		}
	});

	const GetRandom = async () => {
		try {
			const result = await writeContractAsync({
				address: contractAddress,
				abi: contractABI.abi,
				functionName: 'requestRandomWords',
				value: parseEther('0.01')
			});
			console.log(result);
			setIsLoading(true);
			setLoadingText('生成随机数中。。。');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<div
				onClick={GetRandom}
				style={{ zIndex: 6 }}
				className={cn(
					'dice-button !z-6 absolute left-1/2 top-1/2 -translate-x-20 -translate-y-[120%]'
				)}
			>
				<div className="scene">
					<div className="cube">
						<div className="face front">1</div>
						<div className="face back">2</div>
						<div className="face right">3</div>
						<div className="face left">4</div>
						<div className="face top">5</div>
						<div className="face bottom">6</div>
					</div>
				</div>
			</div>
			{isLoading && <Loading loadingText={loadingText} />}
		</div>
	);
};
