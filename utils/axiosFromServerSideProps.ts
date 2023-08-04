import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

/**
 * Create axios function with auth headers into server side, to be sure that if user is logged
 * this data will be there. Add base url to prevent Next errors too.
 */
const axiosFromServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx);
  const headers = ctx.req.headers;

  return axios.create({
    baseURL: process.env.BASE_URL,
    headers: session && headers.cookie ? { Cookie: headers.cookie } : undefined,
  });
};

export default axiosFromServerSideProps;
