import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Box, IconButton, useColorModeValue } from '@chakra-ui/react';
import { AiOutlineReload } from 'react-icons/ai';
import styles from './style.module.scss';
import { useGetTasks } from 'api/apiHooks/taskHooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FilterTasks, IEventInfo, TaskResult } from 'models/task';
import { ITask } from 'models/request';
import { ColorThemeMode, TaskStatus } from 'common/constants';
import TableSkeleton from '../Table/TableSkeleton';
import { getDaysInMonth } from 'date-fns';
import { getFirstLastDayOfCurrentMonth } from 'utils/dateUtils';
import OverflowText from '../OverflowText';
import { RefObject } from '@fullcalendar/core/preact.js';
import theme from 'themes/theme';

const skeletonEvents = (date: Date) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

  return Array.from({ length: getDaysInMonth(date) }, (_, index) => ({
    start: new Date(
      firstDayOfMonth.getFullYear(),
      firstDayOfMonth.getMonth(),
      firstDayOfMonth.getDate() + index
    ),
  }));
};

const getDateRange = (date: Date) => {
  return {
    dateStart: getFirstLastDayOfCurrentMonth('first', date),
    dateEnd: getFirstLastDayOfCurrentMonth('last', date),
  };
};

interface Props {
  filters: FilterTasks;
  openDetailModal: (data: ITask) => () => void;
}

interface IFullCalendarSubProps {
  elRef: { current: HTMLElement };
}

export const CalendarListTask = ({
  filters,
  openDetailModal,
}: Props): JSX.Element => {
  const calendarRef = useRef<IFullCalendarSubProps>(null);
  const [filter, setFilter] = useState<FilterTasks>(() => {
    const { dateStart, dateEnd } = getDateRange(new Date());
    return { ...filters, dates: undefined, dateStart, dateEnd };
  });
  const color = useColorModeValue(ColorThemeMode.DARK, ColorThemeMode.LIGHT);
  const { data, refetch, isLoading, isRefetching } = useGetTasks({ ...filter });
  const [finalData, setFinalData] = useState<TaskResult>();

  const displayData = useMemo(() => {
    const taskData = finalData?.items.map((item) => {
      return {
        ...item,
        id: item.requestId || item.id,
        title: item.settings?.titleTemplate,
        start: item.startDay
          ? new Date(item.startDay.split('/').reverse().join('/'))
          : new Date(),
      };
    });

    return taskData;
  }, [finalData]);

  useEffect(() => {
    setFinalData(data);
  }, [data, isRefetching]);

  useEffect(() => {
    const { dateStart, dateEnd } = getDateRange(new Date());
    setFilter({ ...filters, dates: undefined, dateStart, dateEnd });
  }, [filters]);

  useEffect(() => {
    const table = (
      calendarRef.current?.elRef.current as HTMLElement
    ).querySelector('.fc-scrollgrid') as HTMLElement;
    const td = (
      calendarRef.current?.elRef.current as HTMLElement
    ).querySelector('.fc-theme-standard td') as HTMLElement;
    const th = (
      calendarRef.current?.elRef.current as HTMLElement
    ).querySelector('.fc-scrollgrid-section-header th') as HTMLElement;

    if (color === ColorThemeMode.DARK) {
      table.style.borderColor = theme.colors.secondary;
      td.style.borderColor = theme.colors.secondary;
      th.style.borderColor = theme.colors.secondary;
    } else {
      table.style.borderColor = theme.colors.borderColor;
      td.style.borderColor = theme.colors.borderColor;
      th.style.borderColor = theme.colors.borderColor;
      th.style.backgroundColor = 'transparent';
    }
  }, [color]);

  useEffect(() => {
    const prevButton = (
      calendarRef.current?.elRef.current as HTMLElement
    ).querySelector('.fc-prev-button') as HTMLElement;
    const nextButton = (
      calendarRef.current?.elRef.current as HTMLElement
    ).querySelector('.fc-next-button') as HTMLElement;
    const todayButton = (
      calendarRef.current?.elRef.current as HTMLElement
    ).querySelector('.fc-today-button') as HTMLElement;
    prevButton.style.boxShadow = 'none';
    nextButton.style.boxShadow = 'none';
    todayButton.style.boxShadow = 'none';
  }, []);

  const renderEventContent = (eventInfo: IEventInfo) => {
    return (
      <>
        {isLoading || isRefetching ? (
          <div style={{ cursor: 'pointer', width: '100%' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                rowGap: '6px',
                padding: '5px',
              }}
            >
              <TableSkeleton />
            </div>
          </div>
        ) : (
          <div style={{ cursor: 'pointer', width: '100%' }}>
            <div
              style={{
                backgroundColor: theme.colors.blue[600],
                fontWeight: '600',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '4px',
                rowGap: '6px',
                padding: '5px',
                margin: '0 2px 0px 2px',
              }}
            >
              <OverflowText
                maxLines={1}
                isShowTooltip={true}
                text={eventInfo.event.extendedProps.authorName}
              ></OverflowText>
              <div
                className={`${styles.badge} ${styles.badgeCalendar}`}
                style={{
                  backgroundColor:
                    eventInfo.event.extendedProps.settings?.color,
                }}
              >
                <OverflowText
                  maxLines={1}
                  isShowTooltip={true}
                  text={eventInfo.event.extendedProps.name}
                ></OverflowText>
              </div>
              <div
                className={`${styles.badge} ${styles.badgeCalendar} ${
                  styles[
                    `status${
                      Object.keys(TaskStatus)[
                        eventInfo.event.extendedProps.status
                      ]
                    }`
                  ]
                }`}
              >
                <OverflowText
                  maxLines={1}
                  isShowTooltip={true}
                  text={
                    Object.keys(TaskStatus)[
                      eventInfo.event.extendedProps.status
                    ]
                  }
                ></OverflowText>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <Box position={'relative'}>
        <IconButton
          isDisabled={isLoading || isRefetching}
          isRound={true}
          variant="solid"
          aria-label="Done"
          fontSize="20px"
          position={'absolute'}
          right={['20px', 25]}
          top={'-40px'}
          icon={<AiOutlineReload />}
          onClick={() => refetch()}
        />
        <>
          <Box p="10px 24px" w={'100%'} className={styles.tableContent}>
            <FullCalendar
              ref={calendarRef as RefObject<FullCalendar>}
              plugins={[dayGridPlugin]}
              weekends={true}
              initialView="dayGridMonth"
              events={
                isLoading || isRefetching
                  ? skeletonEvents(
                      filter.dateStart
                        ? new Date(
                            filter.dateStart.split('/').reverse().join('/')
                          )
                        : new Date()
                    )
                  : displayData
              }
              eventContent={renderEventContent}
              dayHeaderClassNames={`${styles.dayHeaderCustomClass} ${
                color === ColorThemeMode.LIGHT ? styles.light : styles.dark
              }`}
              dayCellClassNames={`${styles.dayCellCustomClass} ${
                color === ColorThemeMode.LIGHT ? styles.light : styles.dark
              }`}
              dayCellDidMount={(arg: { el: HTMLElement }) => {
                const eventsWrapper = arg.el.querySelector(
                  '.fc-daygrid-day-events'
                ) as HTMLElement;
                if (eventsWrapper) {
                  eventsWrapper.style.maxHeight = '280px';
                  eventsWrapper.style.overflowY = 'auto';
                  eventsWrapper.style.marginBottom = '1px';
                }
              }}
              height={'auto'}
              eventClick={(arg: {
                event: {
                  extendedProps: { settings?: { titleTemplate?: string } };
                  _def: { publicId: string };
                };
              }) => {
                const modalProp = {
                  ...arg.event.extendedProps,
                  id: arg.event._def.publicId,
                  title: arg.event.extendedProps.settings?.titleTemplate,
                } as ITask;
                openDetailModal(modalProp)();
              }}
              datesSet={(arg: { start: Date }) => {
                const selectDate = new Date(arg.start);
                selectDate.setDate(selectDate.getDate() + 6);

                const dateStart = getFirstLastDayOfCurrentMonth(
                  'first',
                  selectDate
                );
                const dateEnd = getFirstLastDayOfCurrentMonth(
                  'last',
                  selectDate
                );

                setFilter({
                  ...filter,
                  dates: undefined,
                  dateStart,
                  dateEnd,
                });
              }}
            />
          </Box>
        </>
      </Box>
    </>
  );
};

export default CalendarListTask;
