'use client';
import './styles.scss';
import { cn } from '@/lib/utils';
import { parseEther, formatEther } from 'viem';

import {
	useWriteContract,
	useWaitForTransactionReceipt,
	useChainId,
	useAccountEffect,
	useWatchContractEvent,
	useReadContract,
	useContractReads,
	useContractRead
} from 'wagmi';
import { type UseAccountReturnType } from 'wagmi';
import contractABI from './TravelVRFV2Plus.json';
import { Loading } from '@/components/loading';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { request } from 'http';

export const RollDice = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [loadingText, setLoadingText] = useState('');
	const [dice, setDice] = useState(0); // 保存最新的dice值
	const { toast } = useToast();

	const { data: hash, writeContract, writeContractAsync } = useWriteContract();
	const chainId = useChainId();
	console.log('blockchainID', chainId);

	let intervalId: number;

	// VRF contract address
	let vrfContractAddress: `0x${string}`;
	switch (String(chainId)) {
		case '421614':
			vrfContractAddress = '0x4560Ce3f145bA20A176961E0500235eccD6C7FdD';
			break;
		case '11155111':
			vrfContractAddress = '0x1b10AbF4a94AB96a4CDefE8B6Df08DD6A9e9A6b5';
			break;
		default:
			vrfContractAddress = '0x1b10AbF4a94AB96a4CDefE8B6Df08DD6A9e9A6b5';
	}

	useAccountEffect({
		onConnect(data) {
			console.log('Connected!', data);
		},
		onDisconnect() {
			console.log('Disconnected!');
		}
	});

	// useWatchContractEvent({
	// 	address: vrfContractAddress,
	// 	abi: contractABI.abi,
	// 	eventName: 'RequestFulfilled',
	// 	onLogs(logs) {
	// 		console.log('New logs!', logs);
	// 		setIsLoading(false);
	// 		return toast({
	// 			title: 'random dice' + logs
	// 		});
	// 	}
	// });

	const GetRandom = async () => {
		try {
			const result = await writeContractAsync({
				address: vrfContractAddress,
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

	// 定义轮询函数
	async function pollDice() {
		// const {
		// 	data: requestStatus,
		// 	error,
		// 	isPending
		// }
		console.log('www');
		try {
			console.log('111');
			// const requestStatus = useReadContract({
			// 	address: vrfContractAddress,
			// 	abi: contractABI.abi,
			// 	functionName: 'getRequestStatus',
			// 	// args: [requestId]
			// 	args: [
			// 		// 'df6c6d3efd581b26f26f35cdea02f21b741c6e215e2579a6d291abe7ce6d0cdf'
			// 		'108492930318908305654512126985601496615628550396753277270371717329412884530226'
			// 	]
			// value: parseEther('0.01')
			// });
			const request = useContractRead({
				abi: contractABI.abi,
				address: vrfContractAddress,
				functionName: 'getRequestIds',
				args: ['0x797F3E3AcAac209847a9aa572D394D1b5cce4015']
			});
			console.log('middle', request);
			const requestStatus = useReadContract({
				abi: contractABI.abi,
				address: vrfContractAddress,
				functionName: 'getRequestStatus',
				args: [
					// '108492930318908305654512126985601496615628550396753277270371717329412884530226'
					'0xdf6c6d3efd581b26f26f35cdea02f21b741c6e215e2579a6d291abe7ce6d0cdf'
				]
			});
			console.log('222');
			if (requestStatus !== null) {
				// 如果查询结果不为 null，表示查到了结果，更新状态并停止轮询
				console.log(requestStatus, 'l,,', requestStatus);
				// setDice(queryResult);
				// setIsLoading(false);
				// clearInterval(intervalId); // 停止轮询
				// onClick={GetRandom}
				// '0xdf6c6d3efd581b26f26f35cdea02f21b741c6e215e2579a6d291abe7ce6d0cdf'
				// )
			}
			console.log('sss');
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div>
			<div
				onClick={pollDice}
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
