import React, { useState } from 'react';
import ReviewPanel from './ReviewPanel';
import Navbar from '../Navbar';

const Index = () => {
  return (
    <div className="w-[100%] h-[98vh] m-auto flex">
      <Navbar />
      <div className="w-[100%] h-full p-2 overflow-auto">
        <ReviewPanel />
      </div>
    </div>
  );
};

export default Index;
