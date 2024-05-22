'use client';
import './styles.scss';
import { cn } from '@/lib/utils';
import { parseEther, formatEther } from 'viem';
// import {} from '@types'

import {
	useWriteContract,
	useChainId,
	useAccountEffect,
	useAccount,
	useWatchContractEvent,
	useReadContract
} from 'wagmi';
import { readContract } from '@wagmi/core';
import { type UseAccountReturnType } from 'wagmi';
import contractABI from './TravelVRFV2Plus.json';
import { Loading } from '@/components/loading';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { wagmiCoreConfig } from '@/config/config';

type Address = `0x${string}`;

type RequestStatusType = {
	requester: Address;
	fulfilled: boolean;
	randomWord: bigint;
	dice: number;
	paid: bigint;
	timestamp: bigint;
};

export const RollDice = ({ onDiceChange }: { onDiceChange: Function }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [loadingText, setLoadingText] = useState('');
	const [diceNumber, setDiceNumber] = useState(1); // 保存最新的dice值
	const { toast } = useToast();

	const { data: hash, writeContract, writeContractAsync } = useWriteContract();
	const chainId = useChainId();
	const account = useAccount();
	// console.log('blockchainID', chainId, account.address);

	let intervalId: number | NodeJS.Timeout;

	// VRF contract address
	let vrfContractAddress: Address;
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

	// 调用自定义 Hook
	// const request = readContract(wagmiCoreConfig, {
	// 	abi: contractABI.abi,
	// 	address: vrfContractAddress,
	// 	functionName: 'getRequestIds',
	// 	args: ['0x797F3E3AcAac209847a9aa572D394D1b5cce4015']
	// });

	useAccountEffect({
		onConnect(data) {
			console.log('Connected!', data);
		},
		onDisconnect() {
			console.log('Disconnected!');
		}
	});

	useWatchContractEvent({
		address: vrfContractAddress,
		abi: contractABI.abi,
		eventName: 'RequestFulfilled',
		onLogs(logs) {
			console.log('New logs!', logs);
			setIsLoading(false);
			return toast({
				title: 'random dice' + logs
			});
		},
		onError(error) {
			console.log('Error', error);
		}
	});

	const GetRandom = async () => {
		try {
			const resultHash = await writeContractAsync({
				address: vrfContractAddress,
				abi: contractABI.abi,
				functionName: 'requestRandomWords',
				value: parseEther('0.01')
			});
			console.log(resultHash, '这个是返回的结果是交易哈希🤣');
			setIsLoading(true);
			setLoadingText('生成随机数中。。。');
			// 请求列表
			const resultIDList = await readContract(wagmiCoreConfig, {
				abi: contractABI.abi,
				address: vrfContractAddress,
				functionName: 'getRequestIds',
				args: [account.address]
			});
			// console.log(resultIDList);
			intervalId = setInterval(() => {
				// @ts-ignore
				pollDice(resultIDList[resultIDList.length - 1]);
			}, 1000); // 每秒轮询一次
		} catch (error) {
			console.log(error);
		}
	};

	// 定义轮询函数
	async function pollDice(requestID: Address) {
		console.log('www');
		try {
			const result = (await readContract(wagmiCoreConfig, {
				abi: contractABI.abi,
				address: vrfContractAddress,
				functionName: 'getRequestStatus',
				args: [requestID]
			})) as [Address, boolean, bigint, number, bigint, bigint];
			const [requester, fulfilled, randomWord, dice, paid, timestamp] = result;
			const requestStatus: RequestStatusType = {
				requester,
				fulfilled,
				randomWord,
				dice,
				paid,
				timestamp
			};

			if (requestStatus.fulfilled == true) {
				// 如果fulfilled为true，表示vrf已经返回
				setDiceNumber(requestStatus.dice);
				setIsLoading(false);
				console.log(diceNumber, 'diceNumber');
				clearInterval(intervalId); // 停止轮询
				toast({
					title: 'Roll Dice successfully 🎉',
					description: (
						<div className="text-lg font-semibold text-gray-700">
							The Dice Number is
							<span className="ml-2 text-4xl font-bold text-blue-500">
								{diceNumber}
							</span>
						</div>
					)
				});
				for (let index = 0; index < diceNumber; index++) {
					await onDiceChange(1);
				}
			}
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div>
			<div
				// onClick={() =>
				// 	pollDice(
				// 		// '0xdf6c6d3efd581b26f26f35cdea02f21b741c6e215e2579a6d291abe7ce6d0cdf'
				// 		'53451079860721686341348306905162466791097797790594216056973463453765963746680'
				// 	)
				// }
				// onClick={GetRandom}
				onClick={async () => {
					const num = Math.floor(Math.random() * 6) + 1;
					for (let index = 0; index < num; index++) {
						await onDiceChange(1);
					}
				}}
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
