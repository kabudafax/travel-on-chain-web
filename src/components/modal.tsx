import React, { useEffect } from 'react';
import shanghai from '../../public/shanghai.jpg';
import Image from 'next/image';
import { Button } from './ui/button';
import { MintButton } from './mint-ui/mint-button';
import Card from '@/components/hover-card/hover-card';
import CardCollection from './side-widgets/card-collection';
interface ModalProps {
	show: boolean;
	onClose: () => void;
}

type info = {
	des: string;
	src_img: string;
	src_video: string;
	name: string;
	details: {
		post: string;
		locate: string;
	};
};

const Modal: React.FC<ModalProps> = ({ show, onClose }) => {
	// const [info, setInfo] = React.useState<any>();
	const [info, setInfo] = React.useState<info>({
		des: '',
		src_img: '',
		src_video: '',
		name: '',
		details: { post: '', locate: '' }
	});
	useEffect(() => {
		setInfo(
			Math.random() < 0.5
				? {
						des: 'Shanghai, a bustling metropolis blending tradition and modernity, renowned for its vibrant energy and diverse attractions.',
						// src_img: '/shanghai.jpg',
						src_img: '/video/shanghai/shanghai-unsplash-denys-nevozhai.jpg',
						src_video: '/video/shanghai/shanghai1min.mp4',
						name: 'SHANGHAI',
						details: {
							post: 'The Bund',
							locate: 'Shanghai China'
						}
					}
				: {
						des: 'Beijing, where ancient wonders meet modern marvels, a city rich in history and cultural significance.',
						// src: '/beijing.jpg',
						src_img: '/video/beijing/beijing-great-wall.jpg',
						src_video: '/video/beijing/beijing5mins.mp4',
						name: 'BEIJING',
						details: {
							post: 'The Great Wall',
							locate: 'Beijing China'
						}
					}
		);
	}, [show]);
	return (
		<div
			className={`!pointer-events-auto fixed inset-0  z-50 scale-100 transform bg-black bg-opacity-50 ${show ? 'visible opacity-100' : 'invisible opacity-0'} transition-all duration-300`}
			onClick={onClose}
		>
			<div
				className="absolute left-1/2 top-1/2  z-50 flex w-4/5 max-w-lg -translate-x-1/2 -translate-y-1/2 transform flex-col items-center space-x-4 rounded-lg bg-transparent   p-4"
				onClick={(e) => e.stopPropagation()}
			>
				<Card info={info} />

				{/* <MintButton
					metaData={JSON.stringify({ name: info.name, desc: info.des })}
					img={info.src_img}
				/> */}
			</div>
			{/* <CardCollection /> */}
		</div>
	);
};

export default Modal;
