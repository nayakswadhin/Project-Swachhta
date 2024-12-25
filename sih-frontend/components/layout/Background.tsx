import React from 'react';

export function Background() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-200 to-transparent" />
      <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-emerald-200 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-200 to-transparent" />
      <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-green-200 to-transparent" />
      <div className="absolute -top-[40%] -right-[40%] w-[80%] h-[80%] bg-gradient-to-br from-green-100/30 via-emerald-100/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute -bottom-[40%] -left-[40%] w-[80%] h-[80%] bg-gradient-to-tr from-teal-100/30 via-green-100/20 to-transparent rounded-full blur-3xl" />
    </div>
  );
}