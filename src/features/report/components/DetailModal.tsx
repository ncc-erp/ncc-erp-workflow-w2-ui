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
} from '@chakra-ui/react';
import { IPostAndWFH } from 'models/report';
import Logo from 'assets/images/ncc_logo.svg';
import styles from './styles.module.scss';
import { CardDetails } from 'common/components/CardDetails';
import { parseDateStrings } from 'utils';
import { useState } from 'react';
import moment from 'moment';

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
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const posts = reportDetail?.posts;
  const requests = reportDetail?.requests;

  const showMore = () => {
    setVisibleCount(visibleCount + itemsPerPage);
  };

  const shouldEnableScroll = posts && posts.length >= itemsPerPage * 2;

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
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
                      .map((item, index) => (
                        <CardDetails
                          key={index}
                          title={item.title.rendered}
                          date={item.date}
                          link={item.link}
                        />
                      ))}
                    {visibleCount < posts.length ? (
                      <button className={styles.btnShowMore} onClick={showMore}>
                        Show more...
                      </button>
                    ) : posts.length === 0 ? (
                      <Text>No posts found!</Text>
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
              {requests && requests.length > 0 ? (
                requests.map((request) => {
                  const dates = parseDateStrings(request.input.Dates);
                  return (
                    <div className={styles.dates}>
                      {dates
                        ?.filter((date) => {
                          const currentDate = moment(
                            date,
                            'DD/MM/YYYY'
                          ).toDate();
                          if (startDate && endDate) {
                            return (
                              currentDate >= startDate && currentDate <= endDate
                            );
                          }
                          return true;
                        })
                        .map((filteredDate) => (
                          <p className={styles.date}>{filteredDate}</p>
                        ))}
                    </div>
                  );
                })
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
