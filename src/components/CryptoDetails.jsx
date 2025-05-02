import React, { useState, useMemo } from 'react';
import HTMLReactParser from 'html-react-parser';
import { useParams } from 'react-router-dom';
import millify from 'millify';
import { Col, Row, Typography, Select, Skeleton, Result, Button, Tabs, Tag, Statistic, Card } from 'antd';
import {
  MoneyCollectOutlined,
  DollarCircleOutlined,
  FundOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  TrophyOutlined,
  CheckOutlined,
  NumberOutlined,
  ThunderboltOutlined,
  LinkOutlined,
  GlobalOutlined,
} from '@ant-design/icons';

import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from '../services/cryptoApi';
import LineChart from './LineChart';
import ErrorMessage from './common/ErrorMessage';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const CryptoDetails = () => {
  // Get coin ID from URL parameter
  const { coinId } = useParams();
  
  // State for time period selection
  const [timeperiod, setTimeperiod] = useState('7d');
  
  // Fetch coin details and history using RTK Query
  const { 
    data: cryptoDetails, 
    isFetching: isFetchingDetails, 
    error: detailsError, 
    refetch: refetchDetails 
  } = useGetCryptoDetailsQuery(coinId);
  
  const { 
    data: coinHistory, 
    isFetching: isFetchingHistory, 
    error: historyError,
    refetch: refetchHistory
  } = useGetCryptoHistoryQuery({ 
    coinId, 
    timeperiod 
  });

  // Time period options
  const timeOptions = useMemo(() => [
    { value: '3h', label: '3 Hours' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '3m', label: '3 Months' },
    { value: '1y', label: '1 Year' },
    { value: '3y', label: '3 Years' },
    { value: '5y', label: '5 Years' },
  ], []);

  // Prepare statistics with memoization
  const { stats, genericStats } = useMemo(() => {
    const coin = cryptoDetails?.data?.coin;
    
    if (!coin) return { stats: [], genericStats: [] };
    
    const stats = [
      { 
        title: 'Price to USD', 
        value: `$ ${coin?.price && millify(coin?.price)}`, 
        icon: <DollarCircleOutlined /> 
      },
      { 
        title: 'Rank', 
        value: coin?.rank, 
        icon: <NumberOutlined /> 
      },
      { 
        title: '24h Volume', 
        value: `$ ${coin?.volume && millify(coin?.volume)}`, 
        icon: <ThunderboltOutlined /> 
      },
      { 
        title: 'Market Cap', 
        value: `$ ${coin?.marketCap && millify(coin?.marketCap)}`, 
        icon: <DollarCircleOutlined /> 
      },
      { 
        title: 'All-time-high (daily avg.)', 
        value: `$ ${coin?.allTimeHigh?.price && millify(coin?.allTimeHigh?.price)}`, 
        icon: <TrophyOutlined /> 
      },
    ];

    const genericStats = [
      { 
        title: 'Number Of Markets', 
        value: coin?.numberOfMarkets, 
        icon: <FundOutlined /> 
      },
      { 
        title: 'Number Of Exchanges', 
        value: coin?.numberOfExchanges, 
        icon: <MoneyCollectOutlined /> 
      },
      { 
        title: 'Approved Supply', 
        value: coin?.supply?.confirmed ? <CheckOutlined /> : <StopOutlined />, 
        icon: <ExclamationCircleOutlined /> 
      },
      { 
        title: 'Total Supply', 
        value: `$ ${coin?.supply?.total && millify(coin?.supply?.total)}`, 
        icon: <ExclamationCircleOutlined /> 
      },
      { 
        title: 'Circulating Supply', 
        value: `$ ${coin?.supply?.circulating && millify(coin?.supply?.circulating)}`, 
        icon: <ExclamationCircleOutlined /> 
      },
    ];
    
    return { stats, genericStats };
  }, [cryptoDetails]);

  // Handle refetching both queries
  const handleRefetch = () => {
    refetchDetails();
    refetchHistory();
  };

  // Handle error state
  if (detailsError || historyError) {
    return (
      <ErrorMessage 
        message="Failed to load cryptocurrency details" 
        error={detailsError || historyError}
        retry={handleRefetch}
      />
    );
  }

  // Loading state
  if (isFetchingDetails) {
    return <Skeleton active paragraph={{ rows: 10 }} />;
  }

  // If no coin data is found
  if (!cryptoDetails?.data?.coin) {
    return (
      <Result
        status="warning"
        title="Cryptocurrency not found"
        subTitle="The cryptocurrency you're looking for doesn't exist or may have been delisted."
        extra={
          <Button type="primary" href="/">
            Go to Homepage
          </Button>
        }
      />
    );
  }

  const coin = cryptoDetails.data.coin;

  return (
    <Col className="coin-detail-container">
      {/* Coin Heading */}
      <Col className="coin-heading-container">
        <Title level={2} className="coin-name">
          <img 
            src={coin.iconUrl} 
            alt={coin.name} 
            style={{ width: 30, height: 30, marginRight: 10 }} 
          />
          {coin.name} ({coin.symbol}) Price
        </Title>
        <p>
          {coin.name} live price in US Dollar (USD). View value statistics, market cap and supply.
        </p>
      </Col>

      {/* Time Period Selector */}
      <Select
        defaultValue="7d"
        className="select-timeperiod"
        placeholder="Select Time Period"
        onChange={(value) => setTimeperiod(value)}
        value={timeperiod}
        style={{ width: 200, marginBottom: 20 }}
      >
        {timeOptions.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>

      {/* Price Chart */}
      {isFetchingHistory ? (
        <Skeleton active />
      ) : (
        <LineChart 
          coinHistory={coinHistory} 
          currentPrice={parseFloat(coin.price)} 
          coinName={coin.name} 
        />
      )}

      {/* Statistics Tabs */}
      <Tabs defaultActiveKey="1" className="crypto-details-tabs">
        <TabPane tab={`${coin.name} Statistics`} key="1">
          <Row gutter={[24, 24]}>
            {stats.map((stat, index) => (
              <Col key={index} xs={24} sm={12} lg={8}>
                <Card hoverable>
                  <Statistic 
                    title={
                      <div className="coin-stats-name">
                        {stat.icon}
                        <Text>{stat.title}</Text>
                      </div>
                    }
                    value={stat.value}
                    valueStyle={{ 
                      color: index === 0 ? '#3f8600' : 'inherit' 
                    }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </TabPane>
        
        <TabPane tab="Other Stats Info" key="2">
          <Row gutter={[24, 24]}>
            {genericStats.map((stat, index) => (
              <Col key={index} xs={24} sm={12} lg={8}>
                <Card hoverable>
                  <Statistic 
                    title={
                      <div className="coin-stats-name">
                        {stat.icon}
                        <Text>{stat.title}</Text>
                      </div>
                    }
                    value={stat.value}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </TabPane>
      </Tabs>

      {/* Description and Links */}
      <Col className="coin-desc-link">
        <Tabs defaultActiveKey="1">
          <TabPane tab="About" key="1">
            <Row className="coin-desc">
              <Title level={3} className="coin-details-heading">
                What is {coin.name}?
              </Title>
              {HTMLReactParser(coin.description || 'No description available.')}
            </Row>
          </TabPane>
          
          <TabPane tab="Links" key="2">
            <Col className="coin-links">
              <Title level={3} className="coin-details-heading">
                {coin.name} Links
              </Title>
              {coin.links?.map((link, index) => (
                <Row className="coin-link" key={index}>
                  <Title level={5} className="link-name">
                    <Tag color="blue">{link.type}</Tag>
                  </Title>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="link-url"
                  >
                    {link.name} <LinkOutlined />
                  </a>
                </Row>
              ))}
            </Col>
          </TabPane>
        </Tabs>
      </Col>
    </Col>
  );
};

export default CryptoDetails;


























// import React, { useState } from 'react';
// import HTMLReactParser from 'html-react-parser';
// import { useParams } from 'react-router-dom';
// import millify from 'millify';
// import { Col, Row, Typography, Select } from 'antd';
// import { MoneyCollectOutlined, DollarCircleOutlined, FundOutlined, ExclamationCircleOutlined, StopOutlined, TrophyOutlined, CheckOutlined, NumberOutlined, ThunderboltOutlined } from '@ant-design/icons';

// import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from '../services/cryptoApi';
// import Loader from './Loader';
// import LineChart from './LineChart';

// const { Title, Text } = Typography;
// const { Option } = Select;

// const CryptoDetails = () => {
//   const { coinId } = useParams();
//   const [timeperiod, setTimeperiod] = useState('7d');
//   const { data, isFetching } = useGetCryptoDetailsQuery(coinId);
//   const { data: coinHistory } = useGetCryptoHistoryQuery({ coinId, timeperiod });
//   const cryptoDetails = data?.data?.coin;

//   if (isFetching) return <Loader />;

//   const time = ['3h', '24h', '7d', '30d', '1y', '3m', '3y', '5y'];

//   const stats = [
//     { title: 'Price to USD', value: `$ ${cryptoDetails?.price && millify(cryptoDetails?.price)}`, icon: <DollarCircleOutlined /> },
//     { title: 'Rank', value: cryptoDetails?.rank, icon: <NumberOutlined /> },
//     { title: '24h Volume', value: `$ ${cryptoDetails?.volume && millify(cryptoDetails?.volume)}`, icon: <ThunderboltOutlined /> },
//     { title: 'Market Cap', value: `$ ${cryptoDetails?.marketCap && millify(cryptoDetails?.marketCap)}`, icon: <DollarCircleOutlined /> },
//     { title: 'All-time-high(daily avg.)', value: `$ ${cryptoDetails?.allTimeHigh?.price && millify(cryptoDetails?.allTimeHigh?.price)}`, icon: <TrophyOutlined /> },
//   ];

//   const genericStats = [
//     { title: 'Number Of Markets', value: cryptoDetails?.numberOfMarkets, icon: <FundOutlined /> },
//     { title: 'Number Of Exchanges', value: cryptoDetails?.numberOfExchanges, icon: <MoneyCollectOutlined /> },
//     { title: 'Aprroved Supply', value: cryptoDetails?.supply?.confirmed ? <CheckOutlined /> : <StopOutlined />, icon: <ExclamationCircleOutlined /> },
//     { title: 'Total Supply', value: `$ ${cryptoDetails?.supply?.total && millify(cryptoDetails?.supply?.total)}`, icon: <ExclamationCircleOutlined /> },
//     { title: 'Circulating Supply', value: `$ ${cryptoDetails?.supply?.circulating && millify(cryptoDetails?.supply?.circulating)}`, icon: <ExclamationCircleOutlined /> },
//   ];

//   return (
//     <Col className="coin-detail-container">
//       <Col className="coin-heading-container">
//         <Title level={2} className="coin-name">
//           {data?.data?.coin.name} ({data?.data?.coin.symbol}) Price
//         </Title>
//         <p>{cryptoDetails.name} live price in US Dollar (USD). View value statistics, market cap and supply.</p>
//       </Col>
//       <Select defaultValue="7d" className="select-timeperiod" placeholder="Select Timeperiod" onChange={(value) => setTimeperiod(value)}>
//         {time.map((date) => <Option key={date}>{date}</Option>)}
//       </Select>
//       <LineChart coinHistory={coinHistory} currentPrice={millify(cryptoDetails?.price)} coinName={cryptoDetails?.name} />
//       <Col className="stats-container">
//         <Col className="coin-value-statistics">
//           <Col className="coin-value-statistics-heading">
//             <Title level={3} className="coin-details-heading">{cryptoDetails.name} Value Statistics</Title>
//             <p>An overview showing the statistics of {cryptoDetails.name}, such as the base and quote currency, the rank, and trading volume.</p>
//           </Col>
//           {stats.map(({ icon, title, value }) => (
//             <Col className="coin-stats">
//               <Col className="coin-stats-name">
//                 <Text>{icon}</Text>
//                 <Text>{title}</Text>
//               </Col>
//               <Text className="stats">{value}</Text>
//             </Col>
//           ))}
//         </Col>
//         <Col className="other-stats-info">
//           <Col className="coin-value-statistics-heading">
//             <Title level={3} className="coin-details-heading">Other Stats Info</Title>
//             <p>An overview showing the statistics of {cryptoDetails.name}, such as the base and quote currency, the rank, and trading volume.</p>
//           </Col>
//           {genericStats.map(({ icon, title, value }) => (
//             <Col className="coin-stats">
//               <Col className="coin-stats-name">
//                 <Text>{icon}</Text>
//                 <Text>{title}</Text>
//               </Col>
//               <Text className="stats">{value}</Text>
//             </Col>
//           ))}
//         </Col>
//       </Col>
//       <Col className="coin-desc-link">
//         <Row className="coin-desc">
//           <Title level={3} className="coin-details-heading">What is {cryptoDetails.name}?</Title>
//           {HTMLReactParser(cryptoDetails.description)}
//         </Row>
//         <Col className="coin-links">
//           <Title level={3} className="coin-details-heading">{cryptoDetails.name} Links</Title>
//           {cryptoDetails.links?.map((link) => (
//             <Row className="coin-link" key={link.name}>
//               <Title level={5} className="link-name">{link.type}</Title>
//               <a href={link.url} target="_blank" rel="noreferrer">{link.name}</a>
//             </Row>
//           ))}
//         </Col>
//       </Col>
//     </Col>
//   );
// };

// export default CryptoDetails;
