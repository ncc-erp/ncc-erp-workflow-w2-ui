import { Box, Button, Icon, ButtonProps } from '@chakra-ui/react';
import PaginationComponent, {
	PaginationProps as PaginationComponentProps,
} from 'rc-pagination';
import {
	MdOutlineKeyboardDoubleArrowRight,
	MdOutlineKeyboardDoubleArrowLeft,
} from 'react-icons/md';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';

interface PaginationProps extends PaginationComponentProps {
	itemRenderProps?: ButtonProps;
}

type ItemRenderFn = (
	activePage?: number,
	props?: ButtonProps
) => PaginationComponentProps['itemRender'];

export const Pagination = ({
	itemRenderProps,
	current,
	...paginationProps
}: PaginationProps) => {
	return (
		<Box
			display="flex"
			listStyleType="none"
			gap="12px"
			current={current}
			as={PaginationComponent}
			itemRender={ItemRender(current, itemRenderProps)}
			{...paginationProps}
		/>
	);
};

const ItemRender: ItemRenderFn =
	(activePage, buttonProps) => (current, type) => {
		switch (type) {
			case 'jump-next':
				return (
					<Button
						rounded="sm"
						variant="outline"
						borderColor="black"
						size="sm"
						aspectRatio="1/1"
						{...buttonProps}
					>
						<Icon as={MdOutlineKeyboardDoubleArrowRight} />
					</Button>
				);
			case 'jump-prev':
				return (
					<Button
						rounded="sm"
						variant="outline"
						borderColor="black"
						size="sm"
						aspectRatio="1/1"
						{...buttonProps}
					>
						<Icon as={MdOutlineKeyboardDoubleArrowLeft} />
					</Button>
				);
			case 'prev':
				return (
					<Button
						rounded="sm"
						variant="outline"
						borderColor="black"
						size="sm"
						aspectRatio="1/1"
						{...buttonProps}
					>
						<Icon as={GrFormPrevious} />
					</Button>
				);
			case 'next':
				return (
					<Button
						rounded="sm"
						variant="outline"
						borderColor="black"
						size="sm"
						aspectRatio="1/1"
						{...buttonProps}
					>
						<Icon as={GrFormNext} />
					</Button>
				);
			default:
				return (
					<Button
						rounded="sm"
						variant={activePage === current ? 'solid' : 'outline'}
						colorScheme={activePage === current ? 'blackButton' : undefined}
						borderColor="black"
						size="sm"
						{...buttonProps}
					>
						{current}
					</Button>
				);
		}
	};
