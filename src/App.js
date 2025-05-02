import React, { lazy, Suspense, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout, Typography, Space, ConfigProvider, theme } from 'antd';
import { Link } from 'react-router-dom';

// Import components
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy load components for better performance
const Homepage = lazy(() => import('./components/Homepage'));
const Cryptocurrencies = lazy(() => import('./components/Cryptocurrencies'));
const CryptoDetails = lazy(() => import('./components/CryptoDetails'));
const News = lazy(() => import('./components/News'));
const Exchanges = lazy(() => import('./components/Exchanges'));

import './App.css';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#0071bd',
          borderRadius: 6,
        },
      }}
    >
      <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="navbar">
          <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </div>
        <div className="main">
          <Layout>
            <div className="routes">
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/exchanges" element={<Exchanges />} />
                    <Route path="/cryptocurrencies" element={<Cryptocurrencies />} />
                    <Route path="/crypto/:coinId" element={<CryptoDetails />} />
                    <Route path="/news" element={<News />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </div>
          </Layout>
          <div className="footer">
            <Typography.Title level={5} style={{ color: 'white', textAlign: 'center' }}>
              Copyright © 2025
              <Link to="/"> Cryptoverse Inc.</Link> <br />
              All Rights Reserved.
            </Typography.Title>
            <Space>
              <Link to="/">Home</Link>
              <Link to="/exchanges">Exchanges</Link>
              <Link to="/news">News</Link>
            </Space>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default App;



















// import React from 'react';
// import { Switch, Route, Link } from 'react-router-dom';
// import { Layout, Typography, Space } from 'antd';

// import { Exchanges, Homepage, News, Cryptocurrencies, CryptoDetails, Navbar } from './components';
// import './App.css';

// const App = () => (
//   <div className="app">
//     <div className="navbar">
//       <Navbar />
//     </div>
//     <div className="main">
//       <Layout>
//         <div className="routes">
//           <Switch>
//             <Route exact path="/">
//               <Homepage />
//             </Route>
//             <Route exact path="/exchanges">
//               <Exchanges />
//             </Route>
//             <Route exact path="/cryptocurrencies">
//               <Cryptocurrencies />
//             </Route>
//             <Route exact path="/crypto/:coinId">
//               <CryptoDetails />
//             </Route>
//             <Route exact path="/news">
//               <News />
//             </Route>
//           </Switch>
//         </div>
//       </Layout>
//       <div className="footer">
//         <Typography.Title level={5} style={{ color: 'white', textAlign: 'center' }}>Copyright © 2021
//           <Link to="/">
//             Cryptoverse Inc.
//           </Link> <br />
//           All Rights Reserved.
//         </Typography.Title>
//         <Space>
//           <Link to="/">Home</Link>
//           <Link to="/exchanges">Exchanges</Link>
//           <Link to="/news">News</Link>
//         </Space>
//       </div>
//     </div>
//   </div>
// );

// export default App;
