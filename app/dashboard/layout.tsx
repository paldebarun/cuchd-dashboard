import Navbar from '@/components/Navbar';
import React from 'react'

export default async function DashboardLayout({
    children,
 
  }: {
    children: React.ReactNode;
  
  }) {
    
    return (
      <>
        <Navbar />
        {children}
      </>
    );
  }
  