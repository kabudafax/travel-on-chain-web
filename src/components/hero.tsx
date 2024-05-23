'use client';

import TypewriterComponent from 'typewriter-effect';
import { Button } from '@/components/ui/button';
import ReactECharts from 'echarts-for-react';
import { useEffect, useRef } from 'react';
import ChinaMap from '@/components/map';
import NightEarth from '@/components/night-earth/night-earth';
// import '../../public/cesium/Widgets/widgets.css';

export const Hreo = () => {
	const mapRef = useRef(null);
	const getNTF = () => {
		// @ts-ignore
		mapRef.current?.highlightRandomData();
	};
	return (
		<div className="space-y-5 pt-36 text-center font-bold text-white">
			<div className="space-y-5 text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
				<h1>Travel in China</h1>
				<div className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
					<TypewriterComponent
						options={{
							strings: ['Composable!', 'Explore more.', 'Enjoy more.'],
							autoStart: true,
							loop: true
						}}
					/>
				</div>
			</div>
			<div className="text-sm font-light text-zinc-400 md:text-xl">
				Create your own Composable NFTs.
			</div>
			<div>
				<Button
					variant="premium"
					className="rounded-full p-4 font-semibold md:p-6 md:text-lg"
					onClick={() => getNTF()}
				>
					Lottery
				</Button>

				{/* <ChinaMap
					ref={mapRef}
					data={[
						{ name: '北京', value: 2000 },
						{ name: '上海', value: 4000 }
					]}
				/> */}
				{/* <NightEarth /> */}
			</div>
		</div>
	);
};
