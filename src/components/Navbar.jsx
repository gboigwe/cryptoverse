import React, { useState, useEffect, memo } from 'react';
import { Button, Menu, Typography, Avatar, Switch } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeOutlined, 
  MoneyCollectOutlined, 
  BulbOutlined, 
  FundOutlined, 
  MenuOutlined,
  SunOutlined,
  MoonOutlined 
} from '@ant-design/icons';

import icon from '../images/cryptocurrency.png';

const { Title } = Typography;

const Navbar = ({ isDarkMode, toggleTheme }) => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [screenSize, setScreenSize] = useState(undefined);
  const location = useLocation();
  
  // Track window size for responsive menu
  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle menu based on screen size
  useEffect(() => {
    if (screenSize <= 800) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  // Determine which menu item should be selected based on current path
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/') return ['home'];
    if (path === '/cryptocurrencies') return ['cryptocurrencies'];
    if (path === '/exchanges') return ['exchanges'];
    if (path === '/news') return ['news'];
    if (path.includes('/crypto/')) return ['cryptocurrencies'];
    
    return ['home']; // Default
  };

  return (
    <div className="nav-container">
      <div className="logo-container">
        <Avatar src={icon} size="large" />
        <Title level={2} className="logo">
          <Link to="/">Cryptoverse</Link>
        </Title>
        
        {/* Theme toggle */}
        <Switch
          className="theme-switch"
          checked={isDarkMode}
          onChange={toggleTheme}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
        />
        
        {/* Mobile menu button */}
        <Button 
          className="menu-control-container" 
          onClick={() => setActiveMenu(!activeMenu)}
        >
          <MenuOutlined />
        </Button>
      </div>
      
      {activeMenu && (
        <Menu 
          theme={isDarkMode ? "dark" : "light"}
          selectedKeys={getSelectedKey()}
          mode="vertical"
        >
          <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="cryptocurrencies" icon={<FundOutlined />}>
            <Link to="/cryptocurrencies">Cryptocurrencies</Link>
          </Menu.Item>
          <Menu.Item key="exchanges" icon={<MoneyCollectOutlined />}>
            <Link to="/exchanges">Exchanges</Link>
          </Menu.Item>
          <Menu.Item key="news" icon={<BulbOutlined />}>
            <Link to="/news">News</Link>
          </Menu.Item>
        </Menu>
      )}
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(Navbar);





















// import React, { useState, useEffect } from 'react';
// import { Button, Menu, Typography, Avatar } from 'antd';
// import { Link } from 'react-router-dom';
// import { HomeOutlined, MoneyCollectOutlined, BulbOutlined, FundOutlined, MenuOutlined } from '@ant-design/icons';

// import icon from '../images/cryptocurrency.png';

// const Navbar = () => {
//   const [activeMenu, setActiveMenu] = useState(true);
//   const [screenSize, setScreenSize] = useState(undefined);

//   useEffect(() => {
//     const handleResize = () => setScreenSize(window.innerWidth);

//     window.addEventListener('resize', handleResize);

//     handleResize();

//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   useEffect(() => {
//     if (screenSize <= 800) {
//       setActiveMenu(false);
//     } else {
//       setActiveMenu(true);
//     }
//   }, [screenSize]);

//   return (
//     <div className="nav-container">
//       <div className="logo-container">
//         <Avatar src={icon} size="large" />
//         <Typography.Title level={2} className="logo"><Link to="/">Cryptoverse</Link></Typography.Title>
//         <Button className="menu-control-container" onClick={() => setActiveMenu(!activeMenu)}><MenuOutlined /></Button>
//       </div>
//       {activeMenu && (
//       <Menu theme="dark">
//         <Menu.Item icon={<HomeOutlined />}>
//           <Link to="/">Home</Link>
//         </Menu.Item>
//         <Menu.Item icon={<FundOutlined />}>
//           <Link to="/cryptocurrencies">Cryptocurrencies</Link>
//         </Menu.Item>
//         <Menu.Item icon={<MoneyCollectOutlined />}>
//           <Link to="/exchanges">Exchanges</Link>
//         </Menu.Item>
//         <Menu.Item icon={<BulbOutlined />}>
//           <Link to="/news">News</Link>
//         </Menu.Item>
//       </Menu>
//       )}
//     </div>
//   );
// };

// export default Navbar;
