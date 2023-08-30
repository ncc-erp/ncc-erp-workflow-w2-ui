import React, { useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  DraggingStyle,
  Droppable,
  DropResult,
  NotDraggingStyle,
} from 'react-beautiful-dnd';

import './style.css';
import { FilterRequestResult, Request } from 'models/request';
import { RequestStatus } from 'common/enums';
import { format } from 'date-fns';
import classNames from 'classnames';
interface BoardsProps {
  data: FilterRequestResult;
}

// interface Item {
//   id: string;
//   content: string;
// }

// fake data generator
// const getItems = (count: number, offset = 0): Item[] =>
//   Array.from({ length: count }, (v, k) => k).map((k) => ({
//     id: `item-${k + offset}`,
//     content: `item ${k + offset}`,
//   }));

// a little function to help us with reordering the result
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

/**
 * Moves an item from one list to another list.
 */
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
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: 0,
  margin: 0,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'white',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
  background: isDraggingOver ? 'lightblue' : '#eee',
  padding: grid,
  width: 250,
});

const Boards = ({ data }: BoardsProps): JSX.Element => {
  const [state, setState] = useState([
    [...data.items].filter((x) => x.status === RequestStatus.Pending),
    [...data.items].filter((x) => x.status === RequestStatus.Approved),
    [...data.items].filter((x) => x.status === RequestStatus.Canceled),
  ]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // need to check react mounted otherwise it wont render
    setIsMounted(true);
  }, []);

  const onDragEnd = (result: DropResult): void => {
    const { source, destination } = result;

    // if dropped outside the list
    if (!destination) {
      return;
    }

    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;

      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {isMounted && (
        <div style={{ display: 'flex', gap: '5px' }}>
          {state.map((el, ind) => (
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {el.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <div
                            className={classNames('item', {
                              itemPending:
                                item.status === RequestStatus.Pending,
                              itemApproved:
                                item.status === RequestStatus.Approved,
                              itemCanceled:
                                item.status === RequestStatus.Canceled,
                            })}
                          >
                            <div>
                              <div className="content">
                                ID: {item.id.slice(-5).toUpperCase()}
                              </div>
                              <div className="title">
                                {item.workflowDefinitionDisplayName}
                              </div>
                            </div>

                            <div className="person">{item.userRequestName}</div>

                            <div className="stateWrapper">
                              <div className="state">State:</div>
                              <div className="statusWrapper">
                                <div
                                  className={classNames('status', {
                                    statusPending:
                                      item.status === RequestStatus.Pending,
                                    statusApproved:
                                      item.status === RequestStatus.Approved,
                                    statusCanceled:
                                      item.status === RequestStatus.Canceled,
                                  })}
                                />
                                {item.status}
                              </div>
                            </div>

                            <div className="timestamp">
                              Date:{' '}
                              {format(
                                new Date(item.createdAt),
                                'dd-mm-yyyy HH:mm'
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      )}
    </DragDropContext>
  );
};

export default Boards;
