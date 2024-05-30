import { FC, HTMLAttributes } from 'react';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import Image from 'next/image';

import './styles.scss';
import { cn } from '@/lib/utils';

interface RankingListProps extends HTMLAttributes<HTMLDivElement> {}

const rankInfos = [
	{
		rank: '🥇',
		NFTs: '488',
		citys: '24',
		player: {
			avatar: '/assets/ranks-avatar/avatar_1.png',
			accout: '0x8y8u9u3E3AcAac209847austw68290D1b5cce6015'
		}
	},
	{
		rank: '🥈',
		NFTs: '278',
		citys: '19',
		player: {
			avatar: '/assets/ranks-avatar/avatar_2.png',
			accout: '0x875u9u3E3AcAac209847austw68290D1b5cce6015'
		}
	},
	{
		rank: '🥉',
		NFTs: '188',
		citys: '17',
		player: {
			avatar: '/assets/ranks-avatar/avatar_3.png',
			accout: '0x0hu5u9u3E3AcAac209847austw68290D1b5cce6015'
		}
	},
	{
		rank: '4',
		NFTs: '88',
		citys: '10',
		player: {
			avatar: '/assets/ranks-avatar/avatar_4.png',
			accout: '0x67su5u9u3E3AcAac209847austw68290D1b5cce6015'
		}
	},
	{
		rank: '5',
		NFTs: '38',
		citys: '7',
		player: {
			avatar: '/assets/ranks-avatar/avatar_5.png',
			accout: '0x8p5u9u3E3AcAac209847austw68290D1b5cce6015'
		}
	},
	{
		rank: '6',
		NFTs: '38',
		citys: '7',
		player: {
			avatar: '/assets/ranks-avatar/avatar_6.png',
			accout: '0x2ta5u9u3E3AcAac209847austw68290D1b5cce6015'
		}
	}
];

const RankingList: FC<RankingListProps> = ({ className }) => {
	return (
		<div className={cn(className, 'w-full')} style={{ color: 'rgb(24 24 24)' }}>
			<Table>
				<TableCaption>A list of city NFT Rankings.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead
							className="w-[100px] text-lg"
							style={{ color: 'rgb(24 24 24)' }}
						>
							Rank
						</TableHead>
						<TableHead className="text-lg " style={{ color: 'rgb(24 24 24)' }}>
							NFTs
						</TableHead>
						<TableHead className="text-lg" style={{ color: 'rgb(24 24 24)' }}>
							City
						</TableHead>
						<TableHead
							className="text-center text-lg"
							style={{ color: 'rgb(24 24 24)' }}
						>
							Player
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{rankInfos.map((rankInfo) => (
						<TableRow key={rankInfo.player.accout}>
							<TableCell
								className={cn('text-3xl font-medium text-accent', {
									'text-lg': Number(rankInfo.rank) > 3,
									'pl-6 text-orange-300': Number(rankInfo.rank) > 3
								})}
							>
								{rankInfo.rank}
							</TableCell>
							<TableCell className="text-center">{rankInfo.NFTs}</TableCell>
							<TableCell className="text-center">{rankInfo.citys}</TableCell>
							<TableCell className=" text-right">
								{/* {rankInfo.player.accout} */}
								<div className="flex items-center gap-2 ">
									<div className="avatar w-8 overflow-hidden rounded-full">
										<img
											src={rankInfo.player.avatar}
											alt=""
											width={32}
											height={32}
											style={{ width: '32px', height: 'auto' }}
										/>
									</div>
									<div className="account ml-2  max-w-[130px] truncate font-normal">
										{rankInfo.player.accout}
									</div>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default RankingList;
