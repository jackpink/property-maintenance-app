import React, { PropsWithChildren } from "react";

export enum State {
  checked = "CHECKED",
  unchecked = "UNCHECKED"
}

export interface EventObj {
  label: string,
  id: number,
  state: State,
}



const Timeline: React.FC<PropsWithChildren> = (props) => {
    //const {label = "timeline"} = props;

  return(
    <div className="overflow-x-auto">
      <ul className="table w-full py-12">
        {props.children}
      </ul>
    </div>
  );
};
  
  export default Timeline;