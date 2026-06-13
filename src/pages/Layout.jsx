
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  Upload, 
  Palette, 
  Library,
  Headphones,
  Sparkles,
  TrendingUp,
  Settings
} from "lucide-react";
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
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Create",
    url: createPageUrl("Upload"),
    icon: Upload,
  },
  {
    title: "Templates",
    url: createPageUrl("Templates"),
    icon: Sparkles,
  },
  {
    title: "Editor",
    url: createPageUrl("Editor"),
    icon: Palette,
  },
  {
    title: "Library",
    url: createPageUrl("Library"),
    icon: Library,
  },
  {
    title: "Analytics",
    url: createPageUrl("Analytics"),
    icon: TrendingUp,
  },
  {
    title: "Brand Kit",
    url: createPageUrl("BrandKit"),
    icon: Palette,
  },
];

const adminItems = [
  {
    title: "Admin",
    url: createPageUrl("AdminDashboard"),
    icon: Settings,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950">
      <style>{`
        :root {
          --background: 219 40% 4%;
          --foreground: 210 40% 98%;
          --primary: 270 100% 70%;
          --primary-foreground: 0 0% 100%;
          --secondary: 217 32% 8%;
          --secondary-foreground: 210 40% 90%;
          --accent: 292 100% 60%;
          --accent-foreground: 0 0% 100%;
          --muted: 217 32% 8%;
          --muted-foreground: 215 20% 65%;
          --border: 217 32% 12%;
          --input: 217 32% 12%;
          --ring: 270 100% 70%;
        }
      `}</style>
      
      <SidebarProvider>
        <div className="flex w-full">
          <Sidebar className="border-r border-slate-800 bg-slate-900/50 backdrop-blur">
            <SidebarHeader className="border-b border-slate-800 p-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-white" style={{ opacity: 1 }} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-2 h-2 text-white" style={{ opacity: 1 }} />
                  </div>
                </div>
                <div>
                  <h2 className="font-bold text-xl text-white">AudiogramPro</h2>
                  <p className="text-xs text-slate-400">AI-Powered Podcast Clips</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-4">
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-medium text-slate-400 uppercase tracking-wider px-2 py-2">
                  Create & Manage
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-purple-500/10 hover:text-purple-400 transition-all duration-200 rounded-lg mb-1 ${
                            location.pathname === item.url ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-300'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                            <item.icon className="w-5 h-5" style={{ opacity: 1 }} />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup className="mt-6">
                <SidebarGroupLabel className="text-xs font-medium text-slate-400 uppercase tracking-wider px-2 py-2">
                  Admin
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {adminItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 rounded-lg mb-1 ${
                            location.pathname === item.url ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'text-slate-300'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                            <item.icon className="w-5 h-5" style={{ opacity: 1 }} />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup className="mt-6">
                <SidebarGroupLabel className="text-xs font-medium text-slate-400 uppercase tracking-wider px-2 py-2">
                  Analytics
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="px-3 py-2 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <TrendingUp className="w-4 h-4" style={{ opacity: 1 }} />
                        <span>This Month</span>
                      </div>
                      <span className="font-semibold text-purple-400">24 clips</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Total Views</span>
                      <span className="font-semibold text-cyan-400">12.4K</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Downloads</span>
                      <span className="font-semibold text-pink-400">486</span>
                    </div>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-slate-800 p-4">
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm">Pro Creator</p>
                    <p className="text-xs text-slate-400">Unlimited audiograms</p>
                  </div>
                  <Settings className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col bg-slate-950">
            <header className="bg-slate-900/30 backdrop-blur border-b border-slate-800 px-6 py-4 md:hidden">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-slate-800 p-2 rounded-lg transition-colors duration-200 text-white" />
                <h1 className="text-xl font-semibold text-white">AudiogramPro</h1>
              </div>
            </header>

            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
