import React from "react";

const Terminal = ({ prefix, postfix, className = "" }) => {
  return (
    <div className={`${className}`}>
      <pre className="text-[#dad085] text-[16rem] leading-relaxed">
          {prefix}<span className="inline-block w-4 h-[12rem] bg-[#dad085] animate-blink" />{postfix}
      </pre>
    </div>
  );
};

export default Terminal;