import {
	Menu,
	MenuButton,
	IconButton,
	MenuList,
	MenuItem,
	Icon,
} from '@chakra-ui/react';
import { RiSettings4Fill, RiDeleteBin6Fill } from 'react-icons/ri';
import { MdCancel } from 'react-icons/md';

interface RowActionProps {
	onCancel: () => void;
	onDelete: () => void;
}

export const RowAction = ({ onCancel, onDelete }: RowActionProps) => {
	return (
		<Menu>
			<MenuButton
				as={IconButton}
				aria-label=""
				variant="ghost"
				size="sm"
				icon={<Icon color="gray.500" fontSize="lg" as={RiSettings4Fill} />}
			/>
			<MenuList minW="100px">
				<MenuItem display="flex" gap="12px" onClick={onDelete}>
					<Icon color="gray.500" as={RiDeleteBin6Fill} />
					Delete
				</MenuItem>
				<MenuItem display="flex" gap="12px" onClick={onCancel}>
					<Icon color="gray.500" as={MdCancel} />
					Cancel
				</MenuItem>
			</MenuList>
		</Menu>
	);
};
