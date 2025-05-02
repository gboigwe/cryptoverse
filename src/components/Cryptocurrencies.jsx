import React, { useState, useEffect, useMemo } from 'react';
import millify from 'millify';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Input, Typography, Skeleton, Empty } from 'antd';
// import { AutoSizer, FixedSizeGrid } from 'react-window';
import { FixedSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import { useGetCryptosQuery } from '../services/cryptoApi';
import ErrorMessage from './common/ErrorMessage';

const { Title } = Typography;
const { Search } = Input;

const Cryptocurrencies = ({ simplified }) => {
  // Determine count based on simplified view
  const count = simplified ? 10 : 100;
  
  // Query data with RTK Query
  const { data: cryptosList, isFetching, error, refetch } = useGetCryptosQuery(count);
  
  // State for filtered coins and search term
  const [searchTerm, setSearchTerm] = useState('');
  const [cryptos, setCryptos] = useState([]);

  // Filter cryptocurrencies based on search term with memoization
  const filteredCryptos = useMemo(() => {
    if (!cryptosList?.coins) return [];
    
    if (!searchTerm) return cryptosList.coins;
    
    return cryptosList.coins.filter((coin) => 
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cryptosList, searchTerm]);

  // Update state when filtered cryptos change
  useEffect(() => {
    setCryptos(filteredCryptos);
  }, [filteredCryptos]);

  // Card renderer for virtualized grid
  const renderCryptoCard = ({ columnIndex, rowIndex, style, data, columnCount }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= data.length) return null;
    
    const currency = data[index];
    
    return (
      <div style={{
        ...style,
        padding: '16px',
      }}>
        <Link to={`/crypto/${currency.uuid}`}>
          <Card
            title={`${currency.rank}. ${currency.name}`}
            extra={<img className="crypto-image" src={currency.iconUrl} alt={currency.name} />}
            hoverable
            className="crypto-card"
          >
            <p>Price: ${millify(currency.price)}</p>
            <p>Market Cap: ${millify(currency.marketCap)}</p>
            <p>Daily Change: 
              <span style={{ 
                color: currency.change > 0 ? 'green' : 'red' 
              }}>
                {` ${currency.change}%`}
              </span>
            </p>
          </Card>
        </Link>
      </div>
    );
  };

  // Loading state
  if (isFetching) {
    return (
      <div className="loading-container">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage 
        message="Failed to load cryptocurrencies" 
        error={error}
        retry={refetch}
      />
    );
  }

  // Empty state
  if (!cryptos?.length) {
    return (
      <div className="empty-state">
        <Empty
          description={
            searchTerm 
              ? `No cryptocurrencies found matching "${searchTerm}"`
              : "No cryptocurrencies available"
          }
        />
      </div>
    );
  }

  return (
    <>
      {!simplified && (
        <div className="search-crypto">
          <Search
            placeholder="Search Cryptocurrency"
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            enterButton
            allowClear
            size="large"
            className="search-input"
          />
        </div>
      )}

      <div className="crypto-card-container" style={{ height: simplified ? 500 : 'calc(100vh - 250px)', minHeight: 400 }}>
        <AutoSizer>
          {({ height, width }) => {
            // Calculate number of columns based on screen width
            const columnCount = 
              width >= 1200 ? 4 : 
              width >= 768 ? 3 : 
              width >= 576 ? 2 : 1;
              
            // Calculate number of rows based on items and columns
            const rowCount = Math.ceil(cryptos.length / columnCount);
            
            return (
              <FixedSizeGrid
                columnCount={columnCount}
                columnWidth={width / columnCount}
                height={height}
                rowCount={rowCount}
                rowHeight={300}
                width={width}
                itemData={{
                  items: cryptos,
                  columnCount
                }}
              >
                {({ columnIndex, rowIndex, style }) => 
                  renderCryptoCard({ 
                    columnIndex, 
                    rowIndex, 
                    style, 
                    data: cryptos,
                    columnCount 
                  })
                }
              </FixedSizeGrid>
            );
          }}
        </AutoSizer>
      </div>
    </>
  );
};

export default Cryptocurrencies;
















// import React, { useEffect, useState } from 'react';
// import millify from 'millify';
// import { Link } from 'react-router-dom';
// import { Card, Row, Col, Input } from 'antd';

// import { useGetCryptosQuery } from '../services/cryptoApi';
// import Loader from './Loader';

// const Cryptocurrencies = ({ simplified }) => {
//   const count = simplified ? 10 : 100;
//   const { data: cryptosList, isFetching } = useGetCryptosQuery(count);
//   const [cryptos, setCryptos] = useState();
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     setCryptos(cryptosList?.data?.coins);

//     const filteredData = cryptosList?.data?.coins.filter((item) => item.name.toLowerCase().includes(searchTerm));

//     setCryptos(filteredData);
//   }, [cryptosList, searchTerm]);

//   if (isFetching) return <Loader />;

//   return (
//     <>
//       {!simplified && (
//         <div className="search-crypto">
//           <Input
//             placeholder="Search Cryptocurrency"
//             onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
//           />
//         </div>
//       )}
//       <Row gutter={[32, 32]} className="crypto-card-container">
//         {cryptos?.map((currency) => (
//           <Col
//             xs={24}
//             sm={12}
//             lg={6}
//             className="crypto-card"
//             key={currency.uuid}
//           >

//             {/* Note: Change currency.id to currency.uuid  */}
//             <Link key={currency.uuid} to={`/crypto/${currency.uuid}`}>
//               <Card
//                 title={`${currency.rank}. ${currency.name}`}
//                 extra={<img className="crypto-image" src={currency.iconUrl} />}
//                 hoverable
//               >
//                 <p>Price: {millify(currency.price)}</p>
//                 <p>Market Cap: {millify(currency.marketCap)}</p>
//                 <p>Daily Change: {currency.change}%</p>
//               </Card>
//             </Link>
//           </Col>
//         ))}
//       </Row>
//     </>
//   );
// };

// export default Cryptocurrencies;
