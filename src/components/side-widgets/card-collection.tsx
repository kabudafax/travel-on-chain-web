import { FC, HTMLAttributes } from 'react';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetFooter,
	SheetClose
} from '@/components/ui/sheet';
import { Button } from '../ui/button';

interface CardCollectionProps extends HTMLAttributes<HTMLDivElement> {}

const images = [
	'/video/beijing/beijing-hutong.jpg',
	'/video/beijing/beijing-park.jpg',
	'/video/beijing/beijing-pexels-great-wall.jpg',
	'/video/beijing/beijing-pexels-zhangkaiyv.jpg',
	'/video/shanghai/shanghai-shotbyme2.jpg',
	'/video/shanghai/shanghai-unsplash-yiran-ding.jpg',
	'/video/shanghai/shanghai-yuyuan.jpg'
];

const CardCollection: FC<CardCollectionProps> = ({}) => {
	return (
		<div className="cardCollection fixed bottom-0 left-0 z-[6]">
			<Sheet>
				<SheetTrigger asChild className="absolute bottom-0 z-[32]">
					<Button variant="outline">My NFTS</Button>
				</SheetTrigger>
				{/* <SheetOverlay className="bg-black/10" /> */}
				<SheetContent
					className="p-0"
					side={'bottom'}
					onInteractOutside={(e) => {
						e.preventDefault();
					}}
				>
					<div className="scrollbar-hide flex space-x-4 overflow-x-auto rounded-lg bg-gray-100 bg-gradient-to-r from-green-800/80 to-green-200/80 p-4 shadow-lg">
						{images.map((src, index) => (
							<div key={index} className="flex-shrink-0">
								<img
									src={src}
									alt={`Image ${index + 1}`}
									className="h-48 w-48 transform rounded-lg border-2 border-gray-300 object-cover shadow-md transition-transform hover:scale-105"
								/>
							</div>
						))}
					</div>
				</SheetContent>
			</Sheet>
			{/* <div className=" overflow-hidden rounded-xl font-sans shadow-md">
				<div className="flex">
					<div className="group flex h-64 w-32 flex-1 scale-100 transform items-center justify-center bg-[#264653] font-semibold tracking-wide text-white transition duration-100 group-hover:scale-150">
						<span className="opacity-0 transition-opacity group-hover:opacity-100">
							264653
						</span>
					</div>
					<div className="group flex h-64 w-32 flex-1 items-center justify-center bg-[#2A9D8F] font-semibold tracking-wide text-white transition duration-100">
						<span className="opacity-0 transition-opacity group-hover:opacity-100">
							2A9D8F
						</span>
					</div>
					<div className="group flex h-64 w-32 flex-1 items-center justify-center bg-[#E9C46A] font-semibold tracking-wide text-white transition duration-100">
						<span className="opacity-0 transition-opacity group-hover:opacity-100">
							E9C46A
						</span>
					</div>
					<div className="group flex h-64 w-32 flex-1 items-center justify-center bg-[#F4A261] font-semibold tracking-wide text-white transition duration-100">
						<span className="opacity-0 transition-opacity group-hover:opacity-100">
							F4A261
						</span>
					</div>
					<div className="group flex h-64 w-32 flex-1 items-center justify-center bg-[#E76F51] font-semibold tracking-wide text-white transition duration-100">
						<span className="opacity-0 transition-opacity group-hover:opacity-100">
							E76F51
						</span>
					</div>
				</div>
			</div> */}
		</div>
	);
};

export default CardCollection;
