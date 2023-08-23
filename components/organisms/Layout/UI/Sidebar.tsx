import Link from "next/link";
import { ReactNode } from "react";
import { UserRole } from "@prisma/client";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button } from "../../../molecules/Buttons/Button";
import { useAuthenticatedUser } from "../../../../hooks/useAuthenticatedUser";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";


export interface SidebarLinkProps {
	href: string;
	text: string;
	icon?: ReactNode;
	selected: boolean;
	restrictedTo?: UserRole[];
	onClick?: (x: any) => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
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
		<Link href={href}>
			<Button
				icon={icon ?? undefined}
				iconSize="small"
				variant={selected ? 'primary-admin' : 'quaternary'}
				onClick={onClick}
				iconClassName="!rounded-xl"
			>
				{text}
			</Button>
		</Link>
	);
};


const Sidebar: React.FC<{ links: SidebarLinkProps[] }> = ({ links }) => {
	const user = useAuthenticatedUser();
	const router = useRouter();

	if (!user) {
		return null;
	}

	return (
		<div className="lg:flex hidden p-9 bg-white min-h-screen w-1/4  flex-col space-y-8">
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

			<div className="flex flex-col w-full">
				<div className="space-y-3 ">
					{links.map((link) => (
						<SidebarLink key={link.href} {...link} />
					))}
				</div>
				<Link
					href={'/'}
					onClick={async () => {
						await signOut();
					}}
				>
					<Button
						icon={<ArrowRightOnRectangleIcon />}
						iconSize="small"
						className="mt-6 !justify-start"
						variant={'quaternary'}
						iconColor={"primary"}
					>
						Cerrar sesión
					</Button>
				</Link>

			</div>
		</div>
	);
};


export { SidebarLink, Sidebar }