import { WFH_FORMAT_DATE } from 'common/constants';
import { IPost } from 'models/report';
import moment from 'moment';

export const validateWFHDates = (posts: IPost[], requestDates: string[]) => {
  const formatPosts = posts.map((x) => {
    return {
      ...x,
      formatDate: moment(x.date).format(WFH_FORMAT_DATE),
      isUsed: false,
    };
  });

  const formatRequestDates = requestDates.map((x) => {
    return {
      date: x,
      isCounted: false,
    };
  });

  formatRequestDates.forEach((element) => {
    const hasPostIndex = formatPosts.findIndex((post) => {
      const postDate = moment(post.formatDate, WFH_FORMAT_DATE);
      const targetDate = moment(element.date, WFH_FORMAT_DATE);
      return !post.isUsed && postDate.isAfter(targetDate);
    });

    if (hasPostIndex < 0) {
      return;
    }

    formatPosts[hasPostIndex].isUsed = true;
    element.isCounted = true;
  });

  return {
    posts: formatPosts,
    requestDates: formatRequestDates,
  };
};
