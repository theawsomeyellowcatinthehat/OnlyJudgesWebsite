import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Scale,
  LayoutDashboard,
  Users,
  DollarSign,
  Calendar,
  BookOpen,
  FileText,
  Menu,
  X } from
"lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger } from
"@/components/ui/sidebar";

const navigationItems = [
{
  title: "Dashboard",
  url: createPageUrl("Dashboard"),
  icon: LayoutDashboard
},
{
  title: "Cases",
  url: createPageUrl("Cases"),
  icon: FileText
},
{
  title: "Employees",
  url: createPageUrl("Employees"),
  icon: Users
},
{
  title: "Payroll",
  url: createPageUrl("Payroll"),
  icon: DollarSign
},
{
  title: "Schedule",
  url: createPageUrl("Schedule"),
  icon: Calendar
},
{
  title: "Precedents",
  url: createPageUrl("Precedents"),
  icon: BookOpen
}];


export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <style>{`
          :root {
            --primary: 15 23 42;
            --primary-foreground: 248 250 252;
            --secondary: 241 245 249;
            --secondary-foreground: 51 65 85;
            --accent: 161 98 7;
            --accent-foreground: 254 252 232;
            --muted: 241 245 249;
            --muted-foreground: 100 116 139;
            --border: 226 232 240;
            --ring: 15 23 42;
          }
        `}</style>
        
        <Sidebar className="border-r border-slate-200 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                <Scale className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">OnlyJudges</h2>
                <p className="text-xs text-slate-500 font-medium">Legal Management System</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) =>
                  <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                      asChild
                      className={`hover:bg-slate-100 hover:text-slate-900 transition-all duration-300 rounded-xl mb-1 font-medium ${
                      location.pathname === item.url ?
                      'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg' :
                      'text-slate-600'}`
                      }>

                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-slate-900 font-bold text-sm">X</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">xtub12345</p>
                <p className="text-xs text-slate-500 truncate">System Administrator</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header */}
          <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-xl transition-colors duration-200" />
              <div className="flex items-center gap-2">
                <Scale className="w-6 h-6 text-amber-500" />
                <h1 className="text-xl font-bold text-slate-900">LawFirm Pro</h1>
              </div>
            </div>
          </header>

          {/* Main content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>);

}