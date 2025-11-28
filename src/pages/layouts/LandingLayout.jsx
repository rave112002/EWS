import { GlobalOutlined, PieChartOutlined } from "@ant-design/icons";
import { overwatchBlue } from "@assets/images";
import { MODULES } from "@constants/menu";
import { Button, Layout, Menu } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import React from "react";
import { Link, Outlet } from "react-router";

const LandingLayout = () => {
  const extractMenu = (modules) => {
    let items = [];
    modules.forEach((module) => {
      if (module.type === "group" && Array.isArray(module.children)) {
        const children = module.children.map((child) => ({
          key: child.value,
          icon: child.icon,
          label: <Link to={child.link}>{child.label}</Link>,
        }));
        items.push({
          key: module.value,
          icon: module.icon,
          label: module.label,
          children: children,
        });
      } else if (module.type === "item") {
        items.push({
          key: module.value,
          icon: module.icon,
          label: <Link to={module.link}>{module.label}</Link>,
        });
      }
    });
    return items;
  };

  const menuItems = extractMenu(MODULES);

  console.log(menuItems);

  return (
    <Layout className="h-screen">
      <Sider
        width={250}
        collapsible
        className=" bg-white h-full w-full overflow-auto border-r border-black/20 z-10"
      >
        <div className="flex flex-col w-full items-center">
          <div className=" text-center h-60 w-60 rounded-2xl justify-center items-center flex my-4">
            <img src={overwatchBlue} alt="logo" className="w-48" />
          </div>

          <Menu
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            inlineCollapsed={false}
            items={menuItems}
            className="p-0"
          />
        </div>
      </Sider>

      <Layout>
        <Header
          className="bg-linear-to-r from-[#00A9FF] from-40% to-[#0d3144] to-100% h-16 px-12 items-center flex justify-between"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)", zIndex: 1 }}
        >
          <div className=" w-full h-full items-center grid grid-cols-3 p-0">
            <span className=""></span>
            <span className=" text-xl text-center font-bold text-white text-shadow-md">
              Early Warning System
            </span>
            <div className=" flex gap-4 justify-end">
              <Button
                type="text"
                className="text-lg text-white font-semibold hover:bg-transparent!"
              >
                User
              </Button>

              <Button
                type="text"
                className="text-lg text-white font-semibold hover:bg-transparent!"
              >
                Logout
              </Button>
            </div>
          </div>
        </Header>
        <Content className="bg-white p-2 h-full w-full overflow-auto">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LandingLayout;
