import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import contractABI from './TravelVRFV2Plus.json';

// sepolia
const contractAddress = '0x1b10AbF4a94AB96a4CDefE8B6Df08DD6A9e9A6b5';

export const GetRandom = async () => {
	const { data: hash, writeContract } = useWriteContract();

	const result = await writeContract({
		address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
		abi: contractABI.abi,
		functionName: 'requestRandomWords',
		args: []
	});
	console.log(result);
};
