import React, { FC } from 'react';
import './styles.scss';
import { url } from 'inspector';
import { MintButton } from '../mint-ui/mint-button';

interface CardProps {
	info: {
		des: string;
		src_img: string;
		src_video: string;
		name: string;
		details: {
			post: string;
			locate: string;
		};
	};
}

const Card: FC<CardProps> = ({ info }) => {
	const { des, src_img, src_video, name, details } = info;

	return (
		<div className="hover-card mt-100 perspective-1000 mx-auto h-[515px] w-[350px]">
			<div className="hover-card-inner transform-style-preserve-3d relative h-full w-full transition-transform duration-1000">
				<div
					className="card-front backface-hidden absolute flex h-full w-full flex-col justify-end rounded-[15px] bg-cover bg-center px-[40px] py-[60px] text-white"
					style={{ backgroundImage: `url('${src_img}')` }}
				>
					<h2>{details.post}</h2>
					<p>{details.locate}</p>
					<button>hover me</button>
				</div>
				<div className="card-back">
					<div className="video relative h-48 w-full overflow-hidden rounded-lg border-2 border-gray-300">
						<video className="h-full w-full object-cover" autoPlay muted loop>
							<source src={src_video} type="video/mp4" />
							Your browser does not support the video tag.
						</video>
						<div className="bg-blue absolute inset-0 flex items-center justify-center bg-opacity-50"></div>
					</div>

					<h1 className="mb-4 mt-4 text-4xl font-bold text-gray-700">{name}</h1>
					<p className="text-lg leading-relaxed text-gray-700">{des}</p>

					<div className="row">
						{/* <button>Mint</button> */}
						<MintButton
							metaData={JSON.stringify({ name: info.name, desc: info.des })}
							img={info.src_img}
						/>
						<a href="#">
							<img src="/assets/icon_x.png" />
						</a>
						<a href="#">
							<img src="./assets/icon_telegram.png" />
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Card;
