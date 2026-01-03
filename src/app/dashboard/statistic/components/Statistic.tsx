import React from "react";
import Task from "../icons/Task";

const Statistic = ({fill, background} : {fill: string, background: string}) => {
  return (
    <div className="p-8 flex flex-col gap-3 bg-white rounded-[20px] lg:mt-8">
      <h1 className="font-medium text-t-gray text-base">Proyektlerin Sayi</h1>
      <div className="flex justify-between items-center">
        <span className="text-[28px]">20</span>
        
          <Task fill={fill} background={background} />
        
      </div>
    </div>
  );
};

export default Statistic;
