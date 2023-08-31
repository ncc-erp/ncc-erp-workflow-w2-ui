import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from '@hello-pangea/dnd';
import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useCancelRequest } from 'api/apiHooks/requestHooks';
import classNames from 'classnames';
import { toast } from 'common/components/StandaloneToast';
import { BoardColumnStatus } from 'common/constants';
import { RequestStatus } from 'common/enums';
import { format } from 'date-fns';
import { FilterRequestResult } from 'models/request';
import './style.css';
import useBoard from './useBoard';
import { ModalConfirm } from '../ModalConfirm';

interface BoardsProps {
  data: FilterRequestResult;
}

interface ModalStatus {
  isOpen: boolean;
  title: string;
  description: string;
}

const initialModalStatus: ModalStatus = {
  isOpen: false,
  title: 'Modal Title',
  description: 'Modal Description',
};

const Boards = ({ data }: BoardsProps): JSX.Element => {
  const [modalState, setModalState] = useState(initialModalStatus);
  const [state, setState] = useState([
    [...data.items].filter(
      (x) =>
        x.status === RequestStatus.Pending || x.status.toString() === 'Pending'
    ),
    [...data.items].filter((x) => x.status === RequestStatus.Approved),
    [...data.items].filter((x) => x.status === RequestStatus.Canceled),
  ]);

  const queryClient = useQueryClient();
  const cancelRequestMutation = useCancelRequest();
  const { reorder, move, getItemStyle, getListStyle } = useBoard();

  const openModal = (title: string, description: string) => {
    setModalState({
      ...modalState,
      isOpen: true,
      title,
      description,
    });
  };

  const closeModal = () => {
    setModalState({
      ...modalState,
      isOpen: false,
    });
  };

  const onDragEnd = async (result: DropResult) => {
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

      // TO DO: Pending and Approved Status
      if (Number(destination.droppableId) === BoardColumnStatus.Canceled) {
        try {
          await cancelRequestMutation.mutateAsync(
            state[Number(source.droppableId)][source.index].id
          );
          queryClient.invalidateQueries({ queryKey: ['filterRequest'] });
          toast({ title: 'Cancelled successfully!', status: 'success' });
        } catch (error) {
          toast({ title: 'Cancelled Error!', status: 'error' });
          return;
        }
      }

      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState);
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="container">
          {state.map((el, ind) => (
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  <div className="columnLabel">
                    {Object.keys(BoardColumnStatus)[ind]}
                  </div>

                  {el.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          onClick={() =>
                            openModal(
                              `${
                                item.workflowDefinitionDisplayName
                              } no: ${item.id.slice(-5).toUpperCase()}`,
                              'Content to Something'
                            )
                          }
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
                              itemPending: ind === BoardColumnStatus.Pending,
                              itemApproved: ind === BoardColumnStatus.Approved,
                              itemCanceled: ind === BoardColumnStatus.Canceled,
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
                                      ind === BoardColumnStatus.Pending,
                                    statusApproved:
                                      ind === BoardColumnStatus.Approved,
                                    statusCanceled:
                                      ind === BoardColumnStatus.Canceled,
                                  })}
                                />
                                {Object.keys(BoardColumnStatus)[ind]}
                              </div>
                            </div>

                            <div className="timestamp">
                              Date:{' '}
                              {format(
                                new Date(item.createdAt),
                                'dd-MM-yyyy HH:mm'
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
      </DragDropContext>

      <ModalConfirm
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={closeModal}
        title={modalState.title}
        description={modalState.description}
      />
    </>
  );
};

export default Boards;
