import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define cache duration constants
const CACHE_DURATION = {
  DEFAULT: 300, // 5 minutes
  BREAKING_NEWS: 60, // 1 minute for breaking news
};

export const cryptoNewsApi = createApi({
  reducerPath: 'cryptoNewsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.REACT_APP_NEWS_API_URL,
    prepareHeaders: (headers) => {
      headers.set('x-bingapis-sdk', 'true');
      headers.set('x-rapidapi-key', process.env.REACT_APP_RAPIDAPI_KEY);
      headers.set('x-rapidapi-host', process.env.REACT_APP_NEWS_RAPIDAPI_HOST);
      return headers;
    },
    timeout: 8000, // 8 seconds timeout
  }),
  tagTypes: ['News'],
  endpoints: (builder) => ({
    // Get crypto news based on category and count
    getCryptoNews: builder.query({
      query: ({ newsCategory, count }) => ({
        url: `/news/search`,
        params: {
          q: newsCategory,
          safeSearch: 'Off',
          textFormat: 'Raw',
          freshness: 'Day',
          count: count || 12
        },
      }),
      transformResponse: (response) => {
        // Transform API response for consistent structure
        // Also handle possible API response format changes
        if (!response?.value) return { value: [] };
        
        // Add optional metadata processing if needed
        return {
          value: response.value.map(item => ({
            ...item,
            // Add calculated fields if necessary
            publishedAt: new Date(item.datePublished).toISOString(),
            // Ensure image thumbnail is available or use fallback
            imageUrl: item?.image?.thumbnail?.contentUrl || 
                     '/cryptocurrency.png',
          }))
        };
      },
      providesTags: (result) => 
        result?.value
          ? [
              ...result.value.map((article, index) => ({ 
                type: 'News', 
                id: article.name || `article-${index}` 
              })),
              { type: 'News', id: 'LIST' },
            ]
          : [{ type: 'News', id: 'LIST' }],
      keepUnusedDataFor: CACHE_DURATION.DEFAULT,
      // Add error handling
      onError: (error, { dispatch }) => {
        console.error('News API Error:', error);
        // Could dispatch additional actions here for error handling UI
      },
    }),

    // New endpoint: Get breaking news (reduced cache time)
    getBreakingNews: builder.query({
      query: ({ count }) => ({
        url: `/news/search`,
        params: {
          q: 'cryptocurrency breaking news',
          safeSearch: 'Off',
          textFormat: 'Raw',
          freshness: 'Hour',
          count: count || 5
        },
      }),
      transformResponse: (response) => {
        if (!response?.value) return { value: [] };
        return {
          value: response.value.map(item => ({
            ...item,
            publishedAt: new Date(item.datePublished).toISOString(),
            imageUrl: item?.image?.thumbnail?.contentUrl || 
                    '/cryptocurrency.png',
          }))
        };
      },
      providesTags: [{ type: 'News', id: 'BREAKING' }],
      keepUnusedDataFor: CACHE_DURATION.BREAKING_NEWS,
    }),

    // Get news by keyword (for search functionality)
    searchNews: builder.query({
      query: ({ searchTerm, count }) => ({
        url: `/news/search`,
        params: {
          q: searchTerm,
          safeSearch: 'Off',
          textFormat: 'Raw',
          freshness: 'Week',
          count: count || 20
        },
      }),
      transformResponse: (response) => {
        if (!response?.value) return { value: [] };
        return {
          value: response.value.map(item => ({
            ...item,
            publishedAt: new Date(item.datePublished).toISOString(),
            imageUrl: item?.image?.thumbnail?.contentUrl || 
                     '/cryptocurrency.png',
          }))
        };
      },
      keepUnusedDataFor: CACHE_DURATION.DEFAULT,
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetCryptoNewsQuery,
  useGetBreakingNewsQuery,
  useSearchNewsQuery,
} = cryptoNewsApi;



// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const cryptoNewsHeaders = {
//   'x-bingapis-sdk': 'true',
//   'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
//   'x-rapidapi-host': process.env.REACT_APP_NEWS_RAPIDAPI_HOST,
// };

// const createRequest = (url) => ({ url, headers: cryptoNewsHeaders });

// export const cryptoNewsApi = createApi({
//   reducerPath: 'cryptoNewsApi',
//   baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_NEWS_API_URL }),
//   endpoints: (builder) => ({
//     getCryptoNews: builder.query({
//       query: ({ newsCategory, count }) => createRequest(`/news/search?q=${newsCategory}&safeSearch=Off&textFormat=Raw&freshness=Day&count=${count}`),
//     }),
//   }),
// });

// export const { useGetCryptoNewsQuery } = cryptoNewsApi;
