import { ArrowRightOnRectangleIcon, Bars3Icon, XCircleIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Container from "../../Container";
import { useState } from "react";
import { SidebarLinkProps } from "./Sidebar";
import { useAuthenticatedUser } from "../../../../hooks/useAuthenticatedUser";
import { Button } from "../../../molecules/Buttons/Button";
import FullScreenPopUp from "../../../molecules/FullScreen";
import IconButton from "../../../molecules/Buttons/IconButton";
import Text from "../../../molecules/Text";
import roleDict from "../../../../utils/rolesDictionary";


const Links: React.FC<SidebarLinkProps> = ({
	icon,
	text,
	href,
	selected,
	restrictedTo,
	onClick,
}) => {
	const user = useAuthenticatedUser();

	if (!user || (restrictedTo && !restrictedTo.includes(user.role))) {
		return null;
	}

	return (
		<Link key={href} href={href} className='w-full text-center'>
				<Button
					icon={icon}
					iconSize="small"
					variant={selected ? 'primary-admin' : 'secondary'}
					onClick={onClick}
					className='rounded-md w-full'
				>
					{text}
				</Button>
		</Link>
	);
};



function MobileHeader({ onMenuOpening: handleMenuOpening, links }: { onMenuOpening: () => void; links: SidebarLinkProps[] }) {

	const user = useAuthenticatedUser();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	if (!user) {
		return null;
	}


	const onToggle = () => {
		setIsMenuOpen(!isMenuOpen);
		handleMenuOpening();
	};



	return (
		<div className="lg:hidden block bg-box-background">
			{!isMenuOpen && (
				<Container className="py-8 flex justify-between lg:hidden ">
					<Link href="/">
						<span className="w-40">
							<Image
								src={'/assets/Logo.svg'}
								alt="Delta Logo"
								height={46}
								width={159}
								className=" m-0 p-0 cursor-pointer"
							/>
						</span>
					</Link>


					<IconButton
						icon={<Bars3Icon className="text-dark w-8 h-8" />}
						iconSize="medium"
						onClick={onToggle}
					/>
				</Container>
			)}
			{isMenuOpen && (
				<FullScreenPopUp className="lg:hidden block bg-white max-h-desktop px-6 pt-4 space-y-8">
					<div className="w-full">
						<div className={'w-full flex justify-center pb-2'}>
							<Link href="/" >
								<span className='w-full flex justify-center'>
									<Image
										src={'/assets/Logo.svg'}
										alt="Delta Logo"
										height={66}
										width={186}
										className="m-0 p-0 cursor-pointer"
									/>
								</span>
							</Link>

							<IconButton
								icon={<XCircleIcon className="text-dark w-8 h-8" />}
								iconSize="medium"
								onClick={onToggle}
								className={'p-0'}
							/>
						</div>

						<div className='flex flex-col'>
							<div className="space-y-9 mt-8 w-full">
								<div className="flex flex-col w-full items-center space-y-8">
									{links.map((link) => (
										<Links onClick={onToggle} key={link.href} {...link} />
									))}
									<Button
										icon={<ArrowRightOnRectangleIcon />}
										onClick={async () => {
											await signOut();
										}}
										iconSize="small"
										variant="secondary"
										className='rounded-md w-full'
									>
										Cerrar sesión
									</Button>
								</div>

								<div className='flex flex-col'>
									<div className='flex flex-col items-end mr-2'>
										<Text as="p2" className="font-bold">
											{user.firstName} {user.lastName}
										</Text>
										<Text as="p2" className="text-light-gray">
											{roleDict[user.role]}
										</Text>
									</div>
								</div>

							</div>
						</div>
					</div>
				</FullScreenPopUp>
			)}
		</div>
	);
};

export { MobileHeader };