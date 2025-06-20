"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Settings,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Calendar,
  Save,
  RefreshCw,
  Download,
  Upload,
  Home,
  Users,
  GraduationCap,
  MapPin,
  BookOpen,
} from "lucide-react"

const menuItems = [
{ name: "Dashboard", href: "/", icon: Calendar, roles: ["admin", "teacher", "student"] },
  { name: "Schedule", href: "/schedule", icon: Calendar, roles: ["admin", "teacher", "student"] },
  { name: "Teachers", href: "/teachers", icon: Users, roles: ["admin"] },
  { name: "Students", href: "/students", icon: GraduationCap, roles: ["admin", "teacher"] },
  { name: "Rooms", href: "/rooms", icon: MapPin, roles: ["admin"] },
  { name: "Subjects", href: "/subjects", icon: BookOpen, roles: ["admin", "teacher"] },
  { name: "Settings", href: "/settings", icon: Settings, roles: ["admin"] },
]

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // General Settings
    schoolName: "Greenwood High School",
    schoolAddress: "123 Education Street, Learning City, LC 12345",
    schoolPhone: "(555) 123-4567",
    schoolEmail: "admin@greenwood.edu",
    academicYear: "2024-2025",

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    conflictAlerts: true,
    scheduleChanges: true,

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",

    // System Settings
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12",
    language: "English",

    // Appearance Settings
    theme: "light",
    primaryColor: "blue",
    sidebarCollapsed: false,

    // Schedule Settings
    weekStart: "Monday",
    classMinDuration: "30",
    classMaxDuration: "120",
    breakDuration: "15",
    lunchDuration: "60",

    // Backup Settings
    autoBackup: true,
    backupFrequency: "daily",
    retentionPeriod: "30",
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // Save settings logic here
    console.log("Settings saved:", settings)
  }

  const handleReset = () => {
    // Reset to defaults logic here
    console.log("Settings reset to defaults")
  }

  const handleExport = () => {
    // Export settings logic here
    console.log("Exporting settings...")
  }

  const handleImport = () => {
    // Import settings logic here
    console.log("Importing settings...")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        {/* Main Sidebar */}
        <Sidebar className="border-r">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">SmartSchedule</h2>
                <p className="text-xs text-gray-500">School Planner</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={item.active}>
                    <a href={item.href} className="flex items-center gap-3">
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <header className="bg-white border-b px-3 md:px-6 py-3 md:py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
                <SidebarTrigger />
                <div className="min-w-0">
                  <h1 className="text-lg md:text-2xl font-bold text-gray-900">Settings</h1>
                  <p className="text-xs md:text-sm text-gray-600 hidden sm:block">
                    Configure system preferences and options
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                <Button variant="outline" onClick={handleExport} size="sm" className="text-xs md:text-sm">
                  <Download className="w-4 h-4 mr-0 md:mr-1" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
                <Button variant="outline" onClick={handleImport} size="sm" className="text-xs md:text-sm">
                  <Upload className="w-4 h-4 mr-0 md:mr-1" />
                  <span className="hidden sm:inline">Import</span>
                </Button>
                <Button variant="outline" onClick={handleReset} size="sm" className="hidden md:flex">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
                <Button onClick={handleSave} size="sm" className="text-xs md:text-sm">
                  <Save className="w-4 h-4 mr-0 md:mr-1" />
                  <span className="hidden sm:inline">Save</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 text-xs sm:text-sm">
                <TabsTrigger value="general" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">General</span>
                  <span className="sm:hidden">General</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="system" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  System
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="backup" className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Backup
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>School Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <Label htmlFor="schoolName" className="text-sm">
                          School Name
                        </Label>
                        <Input
                          id="schoolName"
                          value={settings.schoolName}
                          onChange={(e) => handleSettingChange("schoolName", e.target.value)}
                          className="h-9 md:h-10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="academicYear">Academic Year</Label>
                        <Input
                          id="academicYear"
                          value={settings.academicYear}
                          onChange={(e) => handleSettingChange("academicYear", e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="schoolAddress">School Address</Label>
                      <Input
                        id="schoolAddress"
                        value={settings.schoolAddress}
                        onChange={(e) => handleSettingChange("schoolAddress", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="schoolPhone">Phone Number</Label>
                        <Input
                          id="schoolPhone"
                          value={settings.schoolPhone}
                          onChange={(e) => handleSettingChange("schoolPhone", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="schoolEmail">Email Address</Label>
                        <Input
                          id="schoolEmail"
                          type="email"
                          value={settings.schoolEmail}
                          onChange={(e) => handleSettingChange("schoolEmail", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Schedule Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="weekStart">Week Starts On</Label>
                        <Select
                          value={settings.weekStart}
                          onValueChange={(value) => handleSettingChange("weekStart", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Monday">Monday</SelectItem>
                            <SelectItem value="Sunday">Sunday</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="classMinDuration">Min Class Duration (minutes)</Label>
                        <Input
                          id="classMinDuration"
                          type="number"
                          value={settings.classMinDuration}
                          onChange={(e) => handleSettingChange("classMinDuration", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="classMaxDuration">Max Class Duration (minutes)</Label>
                        <Input
                          id="classMaxDuration"
                          type="number"
                          value={settings.classMaxDuration}
                          onChange={(e) => handleSettingChange("classMaxDuration", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
                        <Input
                          id="breakDuration"
                          type="number"
                          value={settings.breakDuration}
                          onChange={(e) => handleSettingChange("breakDuration", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lunchDuration">Lunch Duration (minutes)</Label>
                        <Input
                          id="lunchDuration"
                          type="number"
                          value={settings.lunchDuration}
                          onChange={(e) => handleSettingChange("lunchDuration", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="emailNotifications">Email Notifications</Label>
                          <p className="text-sm text-gray-600">Receive notifications via email</p>
                        </div>
                        <Switch
                          id="emailNotifications"
                          checked={settings.emailNotifications}
                          onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="smsNotifications">SMS Notifications</Label>
                          <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                        </div>
                        <Switch
                          id="smsNotifications"
                          checked={settings.smsNotifications}
                          onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="pushNotifications">Push Notifications</Label>
                          <p className="text-sm text-gray-600">Receive browser push notifications</p>
                        </div>
                        <Switch
                          id="pushNotifications"
                          checked={settings.pushNotifications}
                          onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="conflictAlerts">Conflict Alerts</Label>
                          <p className="text-sm text-gray-600">Get notified about scheduling conflicts</p>
                        </div>
                        <Switch
                          id="conflictAlerts"
                          checked={settings.conflictAlerts}
                          onCheckedChange={(checked) => handleSettingChange("conflictAlerts", checked)}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="scheduleChanges">Schedule Changes</Label>
                          <p className="text-sm text-gray-600">Get notified about schedule modifications</p>
                        </div>
                        <Switch
                          id="scheduleChanges"
                          checked={settings.scheduleChanges}
                          onCheckedChange={(checked) => handleSettingChange("scheduleChanges", checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <Switch
                        id="twoFactorAuth"
                        checked={settings.twoFactorAuth}
                        onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
                      />
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                        <Select
                          value={settings.sessionTimeout}
                          onValueChange={(value) => handleSettingChange("sessionTimeout", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                        <Select
                          value={settings.passwordExpiry}
                          onValueChange={(value) => handleSettingChange("passwordExpiry", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="60">60 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="system" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select
                          value={settings.timezone}
                          onValueChange={(value) => handleSettingChange("timezone", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/New_York">Eastern Time</SelectItem>
                            <SelectItem value="America/Chicago">Central Time</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="language">Language</Label>
                        <Select
                          value={settings.language}
                          onValueChange={(value) => handleSettingChange("language", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Spanish">Spanish</SelectItem>
                            <SelectItem value="French">French</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dateFormat">Date Format</Label>
                        <Select
                          value={settings.dateFormat}
                          onValueChange={(value) => handleSettingChange("dateFormat", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="timeFormat">Time Format</Label>
                        <Select
                          value={settings.timeFormat}
                          onValueChange={(value) => handleSettingChange("timeFormat", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12">12-hour</SelectItem>
                            <SelectItem value="24">24-hour</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="theme">Theme</Label>
                        <Select value={settings.theme} onValueChange={(value) => handleSettingChange("theme", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="auto">Auto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <Select
                          value={settings.primaryColor}
                          onValueChange={(value) => handleSettingChange("primaryColor", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blue">Blue</SelectItem>
                            <SelectItem value="green">Green</SelectItem>
                            <SelectItem value="purple">Purple</SelectItem>
                            <SelectItem value="red">Red</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sidebarCollapsed">Collapsed Sidebar by Default</Label>
                        <p className="text-sm text-gray-600">Start with sidebar collapsed</p>
                      </div>
                      <Switch
                        id="sidebarCollapsed"
                        checked={settings.sidebarCollapsed}
                        onCheckedChange={(checked) => handleSettingChange("sidebarCollapsed", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="backup" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Backup & Recovery</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="autoBackup">Automatic Backup</Label>
                        <p className="text-sm text-gray-600">Automatically backup system data</p>
                      </div>
                      <Switch
                        id="autoBackup"
                        checked={settings.autoBackup}
                        onCheckedChange={(checked) => handleSettingChange("autoBackup", checked)}
                      />
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="backupFrequency">Backup Frequency</Label>
                        <Select
                          value={settings.backupFrequency}
                          onValueChange={(value) => handleSettingChange("backupFrequency", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="retentionPeriod">Retention Period (days)</Label>
                        <Select
                          value={settings.retentionPeriod}
                          onValueChange={(value) => handleSettingChange("retentionPeriod", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="365">1 year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Create Backup
                      </Button>
                      <Button variant="outline">
                        <Upload className="w-4 h-4 mr-1" />
                        Restore Backup
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Last Backup</span>
                        <Badge variant="outline">2 hours ago</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Database Size</span>
                        <Badge variant="outline">245 MB</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">System Health</span>
                        <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
