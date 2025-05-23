"use client"

import DashboardLayout from "../components/DashboardLayout"

export default function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
} 