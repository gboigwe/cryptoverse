import React, { useState } from 'react';
import millify from 'millify';
import { Collapse, Row, Col, Typography, Avatar, Table, Skeleton, Alert, Button } from 'antd';
import HTMLReactParser from 'html-react-parser';

import { useGetExchangesQuery } from '../services/cryptoApi';
import ErrorMessage from './common/ErrorMessage';

const { Text, Title } = Typography;

/**
 * Exchanges component displays cryptocurrency exchange information
 * Note: This endpoint typically requires a premium plan in RapidAPI
 */
const Exchanges = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Fetch exchanges data using RTK Query
  const { 
    data: exchangesList, 
    isFetching, 
    error, 
    refetch 
  } = useGetExchangesQuery();

  // Column definitions for the exchanges table
  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      sorter: (a, b) => a.rank - b.rank,
    },
    {
      title: 'Exchange',
      key: 'exchange',
      render: (_, record) => (
        <Row align="middle">
          <Avatar className="exchange-image" src={record.iconUrl} />
          <Text strong style={{ marginLeft: 10 }}>{record.name}</Text>
        </Row>
      ),
    },
    {
      title: '24h Trade Volume',
      key: 'volume',
      render: (_, record) => `$${millify(record.volume || 0)}`,
      sorter: (a, b) => a.volume - b.volume,
    },
    {
      title: 'Markets',
      key: 'markets',
      render: (_, record) => millify(record.numberOfMarkets || 0),
      sorter: (a, b) => a.numberOfMarkets - b.numberOfMarkets,
    },
    {
      title: 'Market Share',
      key: 'marketShare',
      render: (_, record) => `${millify(record.marketShare || 0)}%`,
      sorter: (a, b) => a.marketShare - b.marketShare,
    },
  ];

  // Handle pagination change
  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Loading state
  if (isFetching) {
    return (
      <div className="exchange-container">
        <Title level={2} className="heading">Cryptocurrency Exchanges</Title>
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="exchange-container">
        <Title level={2} className="heading">Cryptocurrency Exchanges</Title>
        
        {/* Handle premium plan required error differently */}
        {error.status === 403 || error.status === 401 ? (
          <Alert
            message="Premium API Plan Required"
            description="The exchange data requires a premium subscription to the Coinranking API on RapidAPI. Please upgrade your plan to access this data."
            type="warning"
            showIcon
            action={
              <Button size="small" type="primary" href="https://rapidapi.com/Coinranking/api/coinranking1" target="_blank">
                Upgrade Plan
              </Button>
            }
          />
        ) : (
          <ErrorMessage 
            message="Failed to load exchanges" 
            error={error}
            retry={refetch}
          />
        )}
      </div>
    );
  }

  // If there's no data but also no error (empty response)
  if (!exchangesList?.length) {
    return (
      <div className="exchange-container">
        <Title level={2} className="heading">Cryptocurrency Exchanges</Title>
        <Alert
          message="No Exchange Data Available"
          description="Exchange data could not be loaded. This feature may require a premium API plan."
          type="info"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="exchange-container">
      <Title level={2} className="heading">Cryptocurrency Exchanges</Title>
      
      <Table
        dataSource={exchangesList}
        columns={columns}
        rowKey="uuid"
        pagination={{
          current: page,
          pageSize: pageSize,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
        onChange={handleTableChange}
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ margin: 0 }}>
              {record.description ? 
                HTMLReactParser(record.description) : 
                <Text italic>No description available</Text>
              }
              {record.websiteUrl && (
                <div style={{ marginTop: 8 }}>
                  <a href={record.websiteUrl} target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          ),
        }}
      />
    </div>
  );
};

export default Exchanges;




























// import React from 'react';
// import millify from 'millify';
// import { Collapse, Row, Col, Typography, Avatar } from 'antd';
// import HTMLReactParser from 'html-react-parser';

// import { useGetExchangesQuery } from '../services/cryptoApi';
// import Loader from './Loader';

// const { Text } = Typography;
// const { Panel } = Collapse;

// const Exchanges = () => {
//   const { data, isFetching } = useGetExchangesQuery();
//   const exchangesList = data?.data?.exchanges;
//  // Note: To access this endpoint you need premium plan
//   if (isFetching) return <Loader />;

//   return (
//     <>
//       <Row>
//         <Col span={6}>Exchanges</Col>
//         <Col span={6}>24h Trade Volume</Col>
//         <Col span={6}>Markets</Col>
//         <Col span={6}>Change</Col>
//       </Row>
//       <Row>
//         {/* {exchangesList.map((exchange) => (
//           <Col span={24}>
//             <Collapse>
//               <Panel
//                 key={exchange.uuid}
//                 showArrow={false}
//                 header={(
//                   <Row key={exchange.uuid}>
//                     <Col span={6}>
//                       <Text><strong>{exchange.rank}.</strong></Text>
//                       <Avatar className="exchange-image" src={exchange.iconUrl} />
//                       <Text><strong>{exchange.name}</strong></Text>
//                     </Col>
//                     <Col span={6}>${millify(exchange.volume)}</Col>
//                     <Col span={6}>{millify(exchange.numberOfMarkets)}</Col>
//                     <Col span={6}>{millify(exchange.marketShare)}%</Col>
//                   </Row>
//                   )}
//               >
//                 {HTMLReactParser(exchange.description || '')}
//               </Panel>
//             </Collapse>
//           </Col>
//         ))} */}
//       </Row>
//     </>
//   );
// };

// export default Exchanges;
