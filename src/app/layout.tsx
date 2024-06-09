import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './provider';
import { Toaster } from '@/components/ui/toaster';

// import '../../public/cesium/Widgets/widgets.css';
// 这个是为了在vercel中编译设置的，与对应的next.cpnfig.js对应
import "cesium/Build/Cesium/Widgets/widgets.css";

import * as china from '@/components/china.json';

const inter = Inter({ subsets: ['latin'] });
import * as echarts from 'echarts/core';
import { Navbar } from '@/components/navbar';
// @ts-ignore
echarts.registerMap('china', china);

export const metadata: Metadata = {
	title: 'Palamedes',
	description: 'A composed NFT issued on Ethereum blockchain'
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	console.log(echarts, 'echarts');
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers>{children}</Providers>
				<Toaster />
			</body>
		</html>
	);
}
