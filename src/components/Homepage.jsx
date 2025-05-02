import React, { useMemo } from 'react';
import millify from 'millify';
import { Typography, Row, Col, Statistic, Card, Skeleton } from 'antd';
import { Link } from 'react-router-dom';

import { useGetCryptosQuery, useGetGlobalStatsQuery } from '../services/cryptoApi';
import { Cryptocurrencies, News } from './index';
import ErrorMessage from './common/ErrorMessage';

const { Title } = Typography;

const Homepage = () => {
  // Fetch data using RTK Query hooks
  const { data: cryptosList, isFetching: isFetchingCryptos, error: cryptosError } = useGetCryptosQuery(10);
  const { data: globalStats, isFetching: isFetchingStats, error: statsError } = useGetGlobalStatsQuery();

  // Process global stats data with memoization to avoid recalculations
  const stats = useMemo(() => {
    if (!globalStats?.stats) return null;
    
    const { 
      total, 
      totalExchanges, 
      totalMarketCap, 
      total24hVolume, 
      totalMarkets 
    } = globalStats.stats;
    
    return {
      totalCryptocurrencies: total || 0,
      totalExchanges: totalExchanges || 0,
      totalMarketCap: totalMarketCap || 0,
      total24hVolume: total24hVolume || 0,
      totalMarkets: totalMarkets || 0,
    };
  }, [globalStats]);

  // Loading state
  if (isFetchingStats || isFetchingCryptos) {
    return (
      <div className="loading-container">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  // Error state
  if (statsError || cryptosError) {
    return (
      <ErrorMessage 
        message="Failed to load cryptocurrency data" 
        error={statsError || cryptosError}
        retry={() => {
          if (statsError) globalStats.refetch();
          if (cryptosError) cryptosList.refetch();
        }}
      />
    );
  }

  return (
    <>
      <div className="home-heading-container">
        <Title level={2} className="home-title">Global Crypto Stats</Title>
      </div>

      <Row gutter={[32, 32]}>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic 
              title="Total Cryptocurrencies" 
              value={stats?.totalCryptocurrencies} 
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic 
              title="Total Exchanges" 
              value={millify(stats?.totalExchanges || 0)} 
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic 
              title="Total Market Cap" 
              value={`$${millify(stats?.totalMarketCap || 0)}`} 
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic 
              title="Total 24h Volume" 
              value={`$${millify(stats?.total24hVolume || 0)}`}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic 
              title="Total Markets" 
              value={millify(stats?.totalMarkets || 0)}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      <div className="home-heading-container">
        <Title level={2} className="home-title">Top 10 Cryptocurrencies in the World</Title>
        <Title level={3} className="show-more">
          <Link to="/cryptocurrencies">Show more</Link>
        </Title>
      </div>
      <Cryptocurrencies simplified />

      <div className="home-heading-container">
        <Title level={2} className="home-title">Latest Crypto News</Title>
        <Title level={3} className="show-more">
          <Link to="/news">Show more</Link>
        </Title>
      </div>
      <News simplified />
    </>
  );
};

export default Homepage;




















// import React from 'react';
// import millify from 'millify';
// import { Typography, Row, Col, Statistic } from 'antd';
// import { Link } from 'react-router-dom';

// import { useGetCryptosQuery } from '../services/cryptoApi';
// import Cryptocurrencies from './Cryptocurrencies';
// import News from './News';
// import Loader from './Loader';

// const { Title } = Typography;

// const Homepage = () => {
//   const { data, isFetching } = useGetCryptosQuery(10);
//   const globalStats = data?.data?.stats;

//   if (isFetching) return <Loader />;

//   return (
//     <>
//       <Title level={2} className="heading">Global Crypto Stats</Title>
//       <Row gutter={[32, 32]}>
//         <Col span={12}><Statistic title="Total Cryptocurrencies" value={globalStats.total} /></Col>
//         <Col span={12}><Statistic title="Total Exchanges" value={millify(globalStats.totalExchanges)} /></Col>
//         <Col span={12}><Statistic title="Total Market Cap:" value={`$${millify(globalStats.totalMarketCap)}`} /></Col>
//         <Col span={12}><Statistic title="Total 24h Volume" value={`$${millify(globalStats.total24hVolume)}`} /></Col>
//         <Col span={12}><Statistic title="Total Cryptocurrencies" value={globalStats.total} /></Col>
//         <Col span={12}><Statistic title="Total Markets" value={millify(globalStats.totalMarkets)} /></Col>
//       </Row>
//       <div className="home-heading-container">
//         <Title level={2} className="home-title">Top 10 Cryptos In The World</Title>
//         <Title level={3} className="show-more"><Link to="/cryptocurrencies">Show more</Link></Title>
//       </div>
//       <Cryptocurrencies simplified />
//       <div className="home-heading-container">
//         <Title level={2} className="home-title">Latest Crypto News</Title>
//         <Title level={3}><Link to="/news">Show more</Link></Title>
//       </div>
//       <News simplified />
//     </>
//   );
// };

// export default Homepage;
