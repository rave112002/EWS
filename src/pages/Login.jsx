import React from "react";
import { Button, Form, Input } from "antd";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { skyImg } from "@assets/images";

const Login = () => {
  return (
    <div
      className="h-dvh bg-cover bg-position-[center_80%] "
      style={{ backgroundImage: `url(${skyImg})` }}
    >
      <div className="bg-black/60 w-full h-full flex flex-col justify-center items-center">
        <div className="bg-white/20 ring-1 ring-white/50 px-12 py-10 rounded-2xl font-bold text-3xl text-white text-shadow-lg shadow-xl flex-col gap-4 flex w-96">
          <span className="w-full justify-center flex">EWS Project</span>
          <span className="w-full justify-center flex text-2xl">Login</span>
          <Form layout="vertical" className="flex flex-col w-full gap-4 py-4">
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
              className="m-0"
            >
              <Input
                className="py-2!"
                prefix={<UserOutlined />}
                placeholder="Username"
                // disabled={isLoading}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
              className="m-0"
            >
              <Input.Password
                className="py-2!"
                prefix={<LockOutlined />}
                // disabled={isLoading}
                placeholder="Password"
                // suffix={<EyeInvisibleOutlined />}
                iconRender={(e) =>
                  e ? <EyeInvisibleOutlined /> : <EyeOutlined />
                }
              />
            </Form.Item>
            <div className="w-full">
              <Button
                type="primary"
                className="w-full font-bold py-4 mt-4"
                href="/admin"
              >
                Login
              </Button>
            </div>
          </Form>
        </div>
      </div>
      {/* <div className="relative isolate w-96 rounded-xl bg-white/20 shadow-lg ring-1 ring-white/50 backdrop-blur-lg p-6">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Glassmorphism Card
        </h2>
        <p className="text-white/80 leading-relaxed">
          This is an example of a glassmorphism effect implemented with React
          and Tailwind CSS. The background is blurred, creating a frosted glass
          appearance.
        </p>
      </div> */}
    </div>
  );
};

export default Login;
