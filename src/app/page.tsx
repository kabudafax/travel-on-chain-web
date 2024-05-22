import { Hreo } from '@/components/hero';
import { LandingContent } from '@/components/landing-content';
import { Navbar } from '@/components/navbar';
import CardList from '@/components/carousel/CardList';
import { hotDropsData } from '@/constants/MockupData';
import NightEarth from '@/components/night-earth/night-earth';

export default function Home() {
	return (
		<main className="pointer-events-none z-[1] h-full overflow-auto bg-[#111827] bg-transparent">
			<div className="pointer-events-none relative !z-[3] mx-auto h-full max-w-screen-xl bg-transparent">
				<Navbar className="" />
				<Hreo />
				{/* <NightEarth /> */}

				<div id="home" className=" relative z-[-1] mt-20">
					<div id="list-container" className="flex justify-center">
						<CardList list={hotDropsData} />
					</div>
				</div>
				{/* <LandingContent /> */}
			</div>
			<NightEarth className="absolute left-0 top-0 !z-[2]" />
		</main>
	);
}
