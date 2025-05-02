import React, { useState, useEffect, useMemo } from 'react';
import { Select, Typography, Row, Col, Avatar, Card, Skeleton, Empty } from 'antd';
import moment from 'moment';
import { useInView } from 'react-intersection-observer';

import { useGetCryptosQuery } from '../services/cryptoApi';
import { useGetCryptoNewsQuery } from '../services/cryptoNewsApi';
import ErrorMessage from './common/ErrorMessage';
import Loader from './Loader';

const { Text, Title } = Typography;
const { Option } = Select;

// Fallback image for news that don't have an image
const demoImage = 'https://www.bing.com/th?id=OVFT.mpzuVZnv8dwIMRfQGPbOPC&pid=News';

const News = ({ simplified }) => {
  // State for news category selection
  const [newsCategory, setNewsCategory] = useState('Cryptocurrency');
  
  // Setup intersection observer for lazy loading
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });
  
  // Fetch data using RTK Query
  const { data: cryptosList } = useGetCryptosQuery(100);
  
  const { 
    data: cryptoNews, 
    isFetching, 
    error, 
    refetch 
  } = useGetCryptoNewsQuery({ 
    newsCategory, 
    count: simplified ? 6 : 12 
  });

  // Memoize crypto options to avoid re-renders
  const cryptoOptions = useMemo(() => {
    if (!cryptosList?.data?.coins) return [];
    
    return cryptosList.data.coins.map((currency) => ({
      value: currency.name,
      label: currency.name,
    }));
  }, [cryptosList]);

  // Loading state
  if (isFetching) {
    return <Loader />;
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage 
        message="Failed to load news" 
        error={error} 
        retry={refetch}
      />
    );
  }

  // Empty state
  if (!cryptoNews?.value?.length) {
    return (
      <div className="empty-state">
        <Empty description={`No news available for ${newsCategory}`} />
      </div>
    );
  }

  return (
    <Row gutter={[24, 24]}>
      {/* News category selector - only show in full view */}
      {!simplified && (
        <Col span={24}>
          <Select
            showSearch
            className="select-news"
            placeholder="Select a Cryptocurrency"
            optionFilterProp="children"
            onChange={(value) => setNewsCategory(value)}
            filterOption={(input, option) => 
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            value={newsCategory}
            style={{ width: '100%' }}
          >
            <Option value="Cryptocurrency">Cryptocurrency</Option>
            {cryptoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Col>
      )}

      {/* News cards */}
      {cryptoNews.value.map((news, i) => (
        <Col xs={24} sm={12} lg={8} key={i} ref={i === 0 ? ref : null}>
          <Card hoverable className="news-card">
            <a href={news.url} target="_blank" rel="noreferrer">
              <div className="news-image-container">
                <Title className="news-title" level={4}>
                  {news.name.length > 60 
                    ? `${news.name.substring(0, 60)}...` 
                    : news.name}
                </Title>
                <img 
                  src={news?.image?.thumbnail?.contentUrl || demoImage} 
                  alt="news" 
                  className="news-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = demoImage;
                  }}
                />
              </div>
              
              <p className="news-description">
                {news.description.length > 100
                  ? `${news.description.substring(0, 100)}...`
                  : news.description}
              </p>
              
              <div className="provider-container">
                <div>
                  <Avatar 
                    src={news.provider[0]?.image?.thumbnail?.contentUrl || demoImage} 
                    alt="news provider" 
                    className="provider-avatar"
                  />
                  <Text className="provider-name">
                    {news.provider[0]?.name || 'Unknown Source'}
                  </Text>
                </div>
                <Text className="publish-time">
                  {moment(news.datePublished).fromNow()}
                </Text>
              </div>
            </a>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default News;


























// import React, { useState } from 'react';
// import { Select, Typography, Row, Col, Avatar, Card } from 'antd';
// import moment from 'moment';

// import { useGetCryptosQuery } from '../services/cryptoApi';
// import { useGetCryptoNewsQuery } from '../services/cryptoNewsApi';
// import Loader from './Loader';

// const demoImage = 'https://www.bing.com/th?id=OVFT.mpzuVZnv8dwIMRfQGPbOPC&pid=News';

// const { Text, Title } = Typography;
// const { Option } = Select;

// const News = ({ simplified }) => {
//   const [newsCategory, setNewsCategory] = useState('Cryptocurrency');
//   const { data } = useGetCryptosQuery(100);
//   const { data: cryptoNews } = useGetCryptoNewsQuery({ newsCategory, count: simplified ? 6 : 12 });

//   if (!cryptoNews?.value) return <Loader />;

//   return (
//     <Row gutter={[24, 24]}>
//       {!simplified && (
//         <Col span={24}>
//           <Select
//             showSearch
//             className="select-news"
//             placeholder="Select a Crypto"
//             optionFilterProp="children"
//             onChange={(value) => setNewsCategory(value)}
//             filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
//           >
//             <Option value="Cryptocurency">Cryptocurrency</Option>
//             {data?.data?.coins?.map((currency) => <Option value={currency.name}>{currency.name}</Option>)}
//           </Select>
//         </Col>
//       )}
//       {cryptoNews.value.map((news, i) => (
//         <Col xs={24} sm={12} lg={8} key={i}>
//           <Card hoverable className="news-card">
//             <a href={news.url} target="_blank" rel="noreferrer">
//               <div className="news-image-container">
//                 <Title className="news-title" level={4}>{news.name}</Title>
//                 <img src={news?.image?.thumbnail?.contentUrl || demoImage} alt="" />
//               </div>
//               <p>{news.description.length > 100 ? `${news.description.substring(0, 100)}...` : news.description}</p>
//               <div className="provider-container">
//                 <div>
//                   <Avatar src={news.provider[0]?.image?.thumbnail?.contentUrl || demoImage} alt="" />
//                   <Text className="provider-name">{news.provider[0]?.name}</Text>
//                 </div>
//                 <Text>{moment(news.datePublished).startOf('ss').fromNow()}</Text>
//               </div>
//             </a>
//           </Card>
//         </Col>
//       ))}
//     </Row>
//   );
// };

// export default News;
