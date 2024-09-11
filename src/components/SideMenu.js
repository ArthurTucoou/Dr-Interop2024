import React, { Component } from "react";
import { Menu } from "antd";

import { BrowserRouter as Router, NavLink, Link } from "react-router-dom";
import { withRouter } from "react-router-dom";

import { HomeOutlined, TeamOutlined, SearchOutlined, BarChartOutlined, UserOutlined } from "@ant-design/icons";

class SideMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { location } = this.props;
    return (
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["/"]}
        selectedKeys={[location.pathname]}
        className="bg-opacity-30 bg-[#93D5FB]" // Add a custom class using Tailwind
      >
        {/* <Menu.Item key="/">
          <HomeOutlined />
          <span>Home</span>
          <NavLink to="/" />
        </Menu.Item> */}
        <Menu.Item key="/patients">
          <TeamOutlined />
          <span>Patients</span>
          <NavLink to="/patients" />
        </Menu.Item>
        <Menu.Item key="/recherche">
          <SearchOutlined />
          <span>Recherche</span>
          <NavLink to="/recherche" />
        </Menu.Item>
        
        {/* key + nav a changer */}
        <Menu.Item key="/profil">
          <UserOutlined />
          <span>Profil</span>
          <NavLink to="/profil" />
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(SideMenu);
