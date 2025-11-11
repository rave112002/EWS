import { Button } from "antd";
import { CircleCheckBig, Clock4, FileText, Plus } from "lucide-react";
import React from "react";

const Scratch = () => {
  return (
    <div className="flex flex-col px-8 pt-4 gap-6">
      <div className="gap-1 flex flex-col">
        <h1 className="text-4xl font-bold">Welcome, User!</h1>
        <span className="text-xl">
          Manage your service requests and track their status
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="w-full p-4 border-4 border-gray-300 rounded-2xl shadow-lg bg-white flex flex-col gap-2">
          <span className="text-lg flex gap-2">
            <FileText />
            Total Requests
          </span>
          <span className="text-5xl font-bold text-[#981F37]">3</span>
        </div>
        <div className="w-full p-4 border-4 border-gray-300 rounded-2xl shadow-lg bg-white flex flex-col gap-2">
          <span className="text-lg flex gap-2">
            <Clock4 />
            Pending
          </span>
          <span className="text-5xl font-bold text-yellow-400">3</span>
        </div>
        <div className="w-full p-4 border-4 border-gray-300 rounded-2xl shadow-lg bg-white flex flex-col gap-2">
          <span className="text-lg flex gap-2">
            <CircleCheckBig />
            Approved
          </span>
          <span className="text-5xl font-bold text-green-500">3</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-semibold">My Requests</h1>
          <span>View and track all your service requests</span>
        </div>
        <Button type="primary" className="py-5">
          <Plus />
          New Request
        </Button>
      </div>

      <div className=" flex flex-col gap-2">
        {/* approved */}
        <div className="border-3 rounded-2xl border-gray-300 py-2 px-6 justify-between flex">
          <div className="flex gap-4">
            <CircleCheckBig size={56} className="h-full text-green-500" />
            <div className="flex flex-col">
              <span className="text-lg font-semibold">Barangay Clearance</span>
              <span className="text-base">
                REQ-2025-001 • Submitted: 2025-10-18
              </span>
              <span className="text-base font-semibold text-green-500">
                Ready for pickup: 10/25/2025
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center w-40">
            <span className="text-base bg-green-500 py-1 px-4 font-bold text-white rounded-2xl">
              Approved
            </span>
          </div>
        </div>

        {/* pending */}
        <div className="border-3 rounded-2xl border-gray-300 py-2 px-6 justify-between flex">
          <div className="flex gap-4">
            <CircleCheckBig size={56} className="h-full text-green-500" />
            <div className="flex flex-col">
              <span className="text-lg font-semibold">Barangay Clearance</span>
              <span className="text-base">
                REQ-2025-001 • Submitted: 2025-10-18
              </span>
              <span className="text-base font-semibold text-green-500">
                Ready for pickup: 10/25/2025
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center w-40">
            <span className="text-base bg-green-500 py-1 px-4 font-bold text-white rounded-2xl">
              Approved
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scratch;
