
import React from 'react';
import MainLayout from "@/components/layout/MainLayout";

const Home = () => {
  return (
    <MainLayout>
      <div className="container px-4 py-20">
        <h1 className="text-3xl font-bold mb-6">Welcome to ImageGenHub</h1>
        <p>This is the home page.</p>
      </div>
    </MainLayout>
  );
};

export default Home;
