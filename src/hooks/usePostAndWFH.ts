import {
  // IPostANT,
  // IUserANT,
  IPostAndWFH,
  IFilterReportWFH,
} from 'models/manage';
// import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

// const { VITE_API_ANT_URL } = import.meta.env;
// TODO: mock api for return list WFH reports
const mockAPI = [
  {
    userId: 1,
    email: 'huy.nguyenquang1@ncc.asia',
    numOfPosts: 3,
    numOfRequestWFH: 5,
  },
  { userId: 2, email: 'messi@ncc.asia', numOfPosts: 7, numOfRequestWFH: 5 },
  { userId: 3, email: 'ronaldo@ncc.asia', numOfPosts: 3, numOfRequestWFH: 2 },
  { userId: 4, email: 'beckham@ncc.asia', numOfPosts: 2, numOfRequestWFH: 4 },
  { userId: 5, email: 'degea@ncc.asia', numOfPosts: 1, numOfRequestWFH: 8 },
  { userId: 6, email: 'maguire@ncc.asia', numOfPosts: 3, numOfRequestWFH: 9 },
  {
    userId: 7,
    email: 'ronaldinho@ncc.asia',
    numOfPosts: 4,
    numOfRequestWFH: 4,
  },
  { userId: 8, email: 'hihihaha@ncc.asia', numOfPosts: 3, numOfRequestWFH: 5 },
  { userId: 9, email: 'hahaha@ncc.asia', numOfPosts: 3, numOfRequestWFH: 5 },
  {
    userId: 10,
    email: 'huy.nguyenquang1@ncc.asia',
    numOfPosts: 3,
    numOfRequestWFH: 5,
  },
  {
    userId: 11,
    email: 'huy.nguyenquang1@ncc.asia',
    numOfPosts: 3,
    numOfRequestWFH: 5,
  },
];

export default function usePostAndWFH(filter: IFilterReportWFH) {
  const [data, setData] = useState<IPostAndWFH[]>([]);
  const [error, setError] = useState<unknown>();
  const [loading, setLoading] = useState<boolean>(true);
  const [length, setLength] = useState<number>(0);

  // TODO: Comment API get data from ANT

  // const getUser = async () => {
  //   const res = await axios.get(
  //     `${VITE_API_ANT_URL}/wp-json/wp/v2/users?per_page=100`
  //   );
  //   if (res.data) return res.data;
  // };

  const fetchData = useCallback(async () => {
    try {
      // TODO: Comment API get data from ANT

      // const users = await getUser();
      // const res = await axios.get(
      //   `${VITE_API_ANT_URL}/wp-json/wp/v2/posts?per_page=100`
      // );
      // const newPosts = res.data.map((post: IPostANT) => {
      //   const matchUsers = users.find(
      //     (user: IUserANT) => user.id === post.author
      //   );
      //   return {
      //     ...post,
      //     userName: matchUsers ? matchUsers.name : null,
      //   };
      // });
      // if (!newPosts) return;
      // const groupedArray = newPosts?.reduce(
      //   (result: IPostAndWFH[], currentValue: IPostANT) => {
      //     const userId = currentValue?.author;
      //     const existingGroup = result?.find(
      //       (group) => group?.userId === userId
      //     );
      //     if (existingGroup) {
      //       existingGroup.numOfPosts += 1;
      //     } else {
      //       result.push({
      //         userId,
      //         email: currentValue?.userName,
      //         numOfPosts: 1,
      //         numOfRequestWFH: 1,
      //       });
      //     }
      //     return result;
      //   },
      //   []
      // );
      const { pages, per_page, search } = filter;
      const filteredData = mockAPI.filter((item: IPostAndWFH) => {
        const email = item.email?.toLowerCase();
        const isEmailMatch = search
          ? email?.includes(search.toLowerCase())
          : true;
        return isEmailMatch;
      });
      const paginatedData = filteredData.slice(pages, pages + per_page);
      setLength(search ? filteredData.length : mockAPI.length);
      setData(paginatedData);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData, filter]);

  return { data, error, loading, fetchData, length };
}
