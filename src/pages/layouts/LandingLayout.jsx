import { GlobalOutlined, PieChartOutlined } from "@ant-design/icons";
import { ewsTransparent } from "@assets/images";
import { Button, Layout, Menu } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import React from "react";
import { Link, Outlet } from "react-router";

const LandingLayout = () => {
  const items = [
    {
      key: "1",
      icon: <PieChartOutlined />,
      label: <Link to={"/admin"}>Home</Link>,
    },
    {
      key: "2",
      icon: <GlobalOutlined />,
      label: <Link to={"/map"}>Map</Link>,
    },
    {
      key: "3",
      icon: <GlobalOutlined />,
      label: <Link to={"/mapv2"}>Mapv2</Link>,
    },
    // {
    //   key: "sub1",
    //   label: "Navigation One",
    //   icon: <MailOutlined />,
    //   children: [
    //     { key: "5", label: "Option 5" },
    //     { key: "6", label: "Option 6" },
    //     { key: "7", label: "Option 7" },
    //     { key: "8", label: "Option 8" },
    //   ],
    // },
  ];
  return (
    <Layout className="h-screen">
      <Sider
        width={300}
        className=" bg-white h-full w-full overflow-auto border-r border-black/20 z-10"
      >
        <div className="flex flex-col  items-center">
          <div className=" text-center h-60 w-60 rounded-2xl justify-center items-center flex my-4">
            <img src={ewsTransparent} alt="logo" className="w-full" />
          </div>

          {/* <Menu
              defaultSelectedKeys={[selectedKey]}
              // selectedKeys={[selectedKey]}
              mode="inline"
              inlineCollapsed={false}
              items={items}
            /> */}

          <Menu
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            // theme="dark"
            inlineCollapsed={false}
            items={items}
            className="p-0"
          />
        </div>
      </Sider>

      <Layout>
        <Header
          className="bg-blue-700 h-16 px-12 items-center flex justify-between"
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
