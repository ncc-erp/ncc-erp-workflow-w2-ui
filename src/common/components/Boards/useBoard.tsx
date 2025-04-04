import { useColorModeValue } from '@chakra-ui/react';
import {
  DraggableLocation,
  DraggingStyle,
  NotDraggingStyle,
} from '@hello-pangea/dnd';
import { ITask } from 'models/task';
import theme from 'themes/theme';

const useBoard = () => {
  const bg = useColorModeValue(theme.colors.tertiary, theme.colors.dark);

  // reordering the result in the same list
  const reorder = (
    list: ITask[],
    startIndex: number,
    endIndex: number
  ): ITask[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  // Moves an item from one list to another list.
  const move = (
    source: ITask[],
    destination: ITask[],
    droppableSource: DraggableLocation,
    droppableDestination: DraggableLocation
  ) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result: { [key: string]: ITask[] } = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  const grid = 8;

  const getItemStyle = (
    draggableStyle: DraggingStyle | NotDraggingStyle | undefined
  ): React.CSSProperties => ({
    // basic styles to items
    userSelect: 'none',
    padding: 0,
    margin: 0,

    // styles apply on draggable
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
    background: isDraggingOver ? 'lightblue' : bg,
    padding: grid,
    height: 720,
    borderRadius: 8,
  });

  return {
    reorder,
    move,
    getItemStyle,
    getListStyle,
  };
};

export default useBoard;
