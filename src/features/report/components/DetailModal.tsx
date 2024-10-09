import {
  Divider,
  HStack,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { IPostAndWFH } from 'models/report';
import Logo from 'assets/images/ncc_logo.png';
import styles from './styles.module.scss';
import { CardDetails } from 'common/components/CardDetails';
import { useMemo, useState } from 'react';
import moment from 'moment';
import { ColorThemeMode } from 'common/constants';
import { validateWFHDates } from 'utils';
import classNames from 'classnames';

interface IDetailModal {
  isOpen: boolean;
  onClose: () => void;
  reportDetail: IPostAndWFH;
  startDate: Date | null;
  endDate: Date | null;
}

const itemsPerPage = 2;

export const DetailModal = ({
  isOpen,
  onClose,
  reportDetail,
  startDate,
  endDate,
}: IDetailModal) => {
  const bg = useColorModeValue(ColorThemeMode.LIGHT, ColorThemeMode.DARK);
  const color = useColorModeValue(ColorThemeMode.DARK, ColorThemeMode.LIGHT);

  const [visibleCount, setVisibleCount] = useState(itemsPerPage);

  const showMore = () => {
    setVisibleCount(visibleCount + itemsPerPage);
  };

  const { posts, requestDates } = useMemo(() => {
    if (!reportDetail.posts || !reportDetail?.requestDates) {
      return {
        posts: reportDetail?.posts,
        requestDates: reportDetail?.requestDates,
      };
    }

    const { posts, requestDates } = reportDetail;

    return validateWFHDates(posts, requestDates);
  }, [reportDetail]);

  const shouldEnableScroll = useMemo(() => {
    return posts && posts.length >= itemsPerPage * 2;
  }, [posts]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
      <ModalOverlay />
      <ModalContent p="10px" maxW="800px" pb={5}>
        <ModalHeader fontSize="18px">
          <HStack>
            <Image h="45px" src={Logo} />
            <Heading ml={1} w="550px">
              <Text color="primary" fontSize={18} fontWeight={600}>
                Report Details
              </Text>
              <Text fontSize={16} fontWeight={400} mt={1.5}>
                {reportDetail?.email}
              </Text>
            </Heading>
          </HStack>
        </ModalHeader>
        <ModalBody>
          <Divider mb={5}></Divider>
          <div className={styles.container}>
            <div className={styles.left}>
              <Text
                mb="15px"
                fontWeight={600}
                fontStyle="italic"
                color="primary"
              >
                Post Details
              </Text>
              <div
                style={{
                  maxHeight: shouldEnableScroll ? '450px' : 'auto',
                  overflowY: shouldEnableScroll ? 'auto' : 'visible',
                }}
              >
                {posts && (
                  <div>
                    {posts
                      .sort(
                        (a, b) =>
                          new Date(b.date).valueOf() -
                          new Date(a.date).valueOf()
                      )
                      .slice(0, visibleCount)
                      .map((item, index) => {
                        return (
                          <CardDetails
                            key={index}
                            title={item.title.rendered}
                            date={item.date}
                            link={item.link}
                            isUsed={!!item?.isUsed}
                          />
                        );
                      })}
                    {visibleCount < posts.length ? (
                      <button className={styles.btnShowMore} onClick={showMore}>
                        Show more...
                      </button>
                    ) : posts.length === 0 ? (
                      <Text>No post found!</Text>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.right}>
              <Text
                mb="15px"
                fontWeight={600}
                fontStyle="italic"
                color="primary"
              >
                Request Details
              </Text>
              {requestDates && requestDates.length > 0 ? (
                <div className={styles.dates}>
                  {requestDates
                    ?.filter((element) => {
                      const date =
                        typeof element === 'string' ? element : element.date;
                      const currentDate = moment(date, 'DD/MM/YYYY').toDate();
                      if (startDate && endDate) {
                        return (
                          currentDate >= startDate && currentDate <= endDate
                        );
                      }
                      return true;
                    })
                    .map((filtered) => {
                      const date =
                        typeof filtered === 'string' ? filtered : filtered.date;
                      const isCounted =
                        typeof filtered === 'string'
                          ? false
                          : filtered.isCounted;
                      return (
                        <Text
                          key={date}
                          className={classNames(styles.date, {
                            [styles.countedDate]: isCounted,
                          })}
                          bg={bg}
                          color={color}
                        >
                          {date}
                        </Text>
                      );
                    })}
                </div>
              ) : (
                <Text>No dates found!</Text>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};
