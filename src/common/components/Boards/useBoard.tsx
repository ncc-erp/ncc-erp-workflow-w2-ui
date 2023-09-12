import { Request } from 'models/request';
import {
  DraggableLocation,
  DraggingStyle,
  NotDraggingStyle,
} from '@hello-pangea/dnd';

const useBoard = () => {
  // reordering the result in the same list
  const reorder = (
    list: Request[],
    startIndex: number,
    endIndex: number
  ): Request[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  // Moves an item from one list to another list.
  const move = (
    source: Request[],
    destination: Request[],
    droppableSource: DraggableLocation,
    droppableDestination: DraggableLocation
  ) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result: { [key: string]: Request[] } = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  const grid = 8;

  const getItemStyle = (
    isDragging: boolean,
    draggableStyle: DraggingStyle | NotDraggingStyle | undefined
  ): React.CSSProperties => ({
    // basic styles to items
    userSelect: 'none',
    padding: 0,
    margin: 0,

    // change background color if dragging
    background: isDragging ? 'lightgreen' : 'white',

    // styles apply on draggable
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
    background: isDraggingOver ? 'lightblue' : '#eee',
    padding: grid,
    width: 250,
    minHeight: 700,
  });

  return {
    reorder,
    move,
    getItemStyle,
    getListStyle,
  };
};

export default useBoard;
