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

	// Dice roll animation
	const handleDiceclick = () => {
		document.getElementById('dice')!.addEventListener('click', async () => {
			const dice: HTMLElement = document.getElementById('dice')!;

			// dice.style.animation = '';
			// dice.style.transition = 'transform 1s';
			dice.style.removeProperty('animation');

			// Generate random rotation angles
			const randX = Math.floor(Math.random() * 12) * 90; // 0到11个90度
			const randY = Math.floor(Math.random() * 12) * 90; // 0到11个90度
			const randZ = Math.floor(Math.random() * 12) * 90; // 0到11个90度

			// 指定最终展示的呈现的角度
			// const rotateZ = Math.floor(Math.random() * 4) * 90;
			// console.log(rotateZ, 'rotateZ');
			// const rotateY = Math.floor(Math.random() * 4) * 90 - 40;
			// console.log(rotateY, 'rotateY');

			// Apply initial animation for tossing the dice
			// dice.style.transition = "transform 2s cubic-bezier(0.25, 0.1, 0.25, 1)";
			// dice.style.transition = "transform 2s cubic-bezier(.17,.6,.25,1.02)";
			setTimeout(() => {
				dice.style.transition = 'transform 2s cubic-bezier(.06,.69,.37,.91)';
				dice.style.transform = `translateY(-300px) rotateX(${randX}deg) rotateY(${randY}deg) rotateZ(${randZ}deg)`;
			}, 100);

			// After the animation ends, reset to show the final 3D shape
			setTimeout(() => {
				// Keep the cube in the side view perspective
				const rotateZ = Math.floor(Math.random() * 4) * 90;
				console.log(rotateZ, 'rotateZ');
				const rotateY = Math.floor(Math.random() * 4) * 90 - 40;
				console.log(rotateY, 'rotateY');
				// dice.style.transition = "transform 1s cubic-bezier(0.5, 0, 0.5, 1)";
				dice.style.transition =
					'transform 1.5s cubic-bezier(.82,-0.02,.92,.74)';
				dice.style.transform = `translateY(0px) rotateX(-30deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;

				// dice.style.transition = 'none';
				setTimeout(() => {
					dice.style.animation = 'dice-spin 25s infinite linear';
				}, 2500);
			}, 1500);

			// chess move by dice steps
			setTimeout(async () => {
				const num = Math.floor(Math.random() * 6) + 1;
				for (let index = 0; index < num; index++) {
					await onDiceChange(1);
				}
			}, 3500);
		});
	};

	useEffect(() => {
		// handleDiceclick();
		console.log('执行一次');
	}, []);

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
				// onClick={async () => {
				// 	const num = Math.floor(Math.random() * 6) + 1;
				// 	for (let index = 0; index < num; index++) {
				// 		await onDiceChange(1);
				// 	}
				// }}
				onClick={handleDiceclick}
				style={{ zIndex: 9 }}
				className={cn(
					'dice-button !z-6 !pointer-events-auto absolute left-[30%] top-[40%] '
				)}
			>
				<div id="scene">
					<div id="cover">
						<div id="dice">
							{/* <!-- front --> */}
							<div className="side front">
								<div className="dot center"></div>
							</div>
							<div className="side front inner"></div>

							{/* <!-- top --> */}
							<div className="side top">
								<div className="dot dtop dleft"></div>
								<div className="dot dbottom dright"></div>
							</div>
							<div className="side top inner"></div>

							{/* <!-- right --> */}
							<div className="side right">
								<div className="dot dtop dleft"></div>
								<div className="dot center"></div>
								<div className="dot dbottom dright"></div>
							</div>
							<div className="side right inner"></div>

							{/* <!-- left --> */}
							<div className="side left">
								<div className="dot dtop dleft"></div>
								<div className="dot dtop dright"></div>
								<div className="dot dbottom dleft"></div>
								<div className="dot dbottom dright"></div>
							</div>
							<div className="side left inner"></div>

							{/* <!-- bottom --> */}
							<div className="side bottom">
								<div className="dot center"></div>
								<div className="dot dtop dleft"></div>
								<div className="dot dtop dright"></div>
								<div className="dot dbottom dleft"></div>
								<div className="dot dbottom dright"></div>
							</div>
							<div className="side bottom inner"></div>

							{/* <!-- back --> */}
							<div className="side back">
								<div className="dot dtop dleft"></div>
								<div className="dot dtop dright"></div>
								<div className="dot dbottom dleft"></div>
								<div className="dot dbottom dright"></div>
								<div className="dot center dleft"></div>
								<div className="dot center dright"></div>
							</div>
							<div className="side back inner"></div>
							{/* cover */}
							<div className="side cover x"></div>
							<div className="side cover y"></div>
							<div className="side cover z"></div>
						</div>
					</div>
				</div>
			</div>
			{isLoading && <Loading loadingText={loadingText} />}
		</div>
	);
};
