import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define constants for cache invalidation
const CACHE_DURATION = {
  DEFAULT: 60, // 1 minute
  EXTENDED: 300, // 5 minutes
  LONG: 3600, // 1 hour
};

export const cryptoApi = createApi({
  reducerPath: 'cryptoApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.REACT_APP_CRYPTO_API_URL,
    prepareHeaders: (headers) => {
      headers.set('x-rapidapi-host', process.env.REACT_APP_CRYPTO_RAPIDAPI_HOST);
      headers.set('x-rapidapi-key', process.env.REACT_APP_RAPIDAPI_KEY);
      return headers;
    },
    timeout: 10000, // 10 seconds timeout
  }),
  tagTypes: ['Crypto', 'CryptoDetails', 'Exchange'],
  endpoints: (builder) => ({
    // Get a list of cryptocurrencies with count limit
    getCryptos: builder.query({
      query: (count) => `/coins?limit=${count}`,
      transformResponse: (response) => {
        // Transform API response to provide consistent data structure
        return response?.data || { stats: {}, coins: [] };
      },
      providesTags: (result) => 
        result?.coins
          ? [
              ...result.coins.map(({ uuid }) => ({ type: 'Crypto', id: uuid })),
              { type: 'Crypto', id: 'LIST' },
            ]
          : [{ type: 'Crypto', id: 'LIST' }],
      keepUnusedDataFor: CACHE_DURATION.EXTENDED,
    }),

    // Get cryptocurrency details by ID
    getCryptoDetails: builder.query({
      query: (coinId) => `/coin/${coinId}`,
      transformResponse: (response) => response?.data?.coin || {},
      providesTags: (result, error, coinId) => [{ type: 'CryptoDetails', id: coinId }],
      keepUnusedDataFor: CACHE_DURATION.DEFAULT,
    }),

    // Get cryptocurrency price history
    getCryptoHistory: builder.query({
      query: ({ coinId, timeperiod }) => `/coin/${coinId}/history?timeperiod=${timeperiod}`,
      transformResponse: (response) => response?.data || { history: [] },
      providesTags: (result, error, { coinId, timeperiod }) => [
        { type: 'CryptoDetails', id: `${coinId}-${timeperiod}` }
      ],
      keepUnusedDataFor: CACHE_DURATION.DEFAULT,
    }),

    // Get exchanges (requires premium plan)
    getExchanges: builder.query({
      query: () => '/exchanges',
      transformResponse: (response) => response?.data?.exchanges || [],
      providesTags: [{ type: 'Exchange', id: 'LIST' }],
      keepUnusedDataFor: CACHE_DURATION.LONG,
      // Add error handling for premium plan requirements
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          // Handle premium plan error
          console.error('Exchange endpoint error:', error);
          // Could dispatch an action to show user-friendly message about premium requirements
        }
      },
    }),

    // Search cryptocurrencies
    searchCryptos: builder.query({
      query: (searchTerm) => `/search-suggestions?query=${searchTerm}`,
      transformResponse: (response) => response?.data?.coins || [],
      keepUnusedDataFor: CACHE_DURATION.DEFAULT,
    }),

    // New endpoint: Get global crypto stats
    getGlobalStats: builder.query({
      query: () => '/stats',
      transformResponse: (response) => response?.data || {},
      providesTags: [{ type: 'Crypto', id: 'STATS' }],
      keepUnusedDataFor: CACHE_DURATION.EXTENDED,
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetCryptosQuery,
  useGetCryptoDetailsQuery,
  useGetCryptoHistoryQuery,
  useGetExchangesQuery,
  useSearchCryptosQuery,
  useGetGlobalStatsQuery,
} = cryptoApi;




























// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// // Note: Change v1 to v2 on rapid api

// const cryptoApiHeaders = {
//   'x-rapidapi-host': process.env.REACT_APP_CRYPTO_RAPIDAPI_HOST,
//   'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
// };
// const createRequest = (url) => ({ url, headers: cryptoApiHeaders });

// export const cryptoApi = createApi({
//   reducerPath: 'cryptoApi',
//   baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_CRYPTO_API_URL }),
//   endpoints: (builder) => ({
//     getCryptos: builder.query({
//       query: (count) => createRequest(`/coins?limit=${count}`),
//     }),

//     getCryptoDetails: builder.query({
//       query: (coinId) => createRequest(`/coin/${coinId}`),
//     }),

//     // Note: Change the coin price history endpoint from this - `coin/${coinId}/history/${timeperiod} to this - `coin/${coinId}/history?timeperiod=${timeperiod}`
//     getCryptoHistory: builder.query({
//       query: ({ coinId, timeperiod }) => createRequest(`coin/${coinId}/history?timeperiod=${timeperiod}`),
//     }),

//     // Note: To access this endpoint you need premium plan
//     getExchanges: builder.query({
//       query: () => createRequest('/exchanges'),
//     }),
//   }),
// });

// export const {
//   useGetCryptosQuery,
//   useGetCryptoDetailsQuery,
//   useGetExchangesQuery,
//   useGetCryptoHistoryQuery,
// } = cryptoApi;
