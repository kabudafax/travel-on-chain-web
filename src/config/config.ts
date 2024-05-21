import { getDefaultConfig, Chain } from '@rainbow-me/rainbowkit';
import { http, createConfig } from '@wagmi/core';

import { mainnet, sepolia, arbitrumSepolia } from 'wagmi/chains';

const Morph = {
	id: 2710,
	name: 'Morph Testnet',
	iconBackground: '#fff',
	nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
	rpcUrls: {
		default: { http: ['https://rpc-testnet.morphl2.io'] }
	},
	blockExplorers: {
		default: {
			name: 'MorphExplorer',
			url: 'https://explorer-testnet.morphl2.io'
		}
	}
} as const satisfies Chain;
export const config = getDefaultConfig({
	appName: 'My RainbowKit App',
	projectId: 'YOUR_PROJECT_ID',
	chains: [mainnet, sepolia, arbitrumSepolia, Morph]
});

export const wagmiCoreConfig = createConfig({
	chains: [mainnet, sepolia, arbitrumSepolia, Morph],
	transports: {
		[mainnet.id]: http(),
		[sepolia.id]: http(),
		[arbitrumSepolia.id]: http(),
		[Morph.id]: http()
	}
});
