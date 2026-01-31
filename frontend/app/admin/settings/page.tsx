"use client";

import { useState } from "react";
import { Save, Bell, Lock, Globe, Palette, Database } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Kush Films",
    siteDescription: "Uganda's Premier Movie & Food Platform",
    maintenanceMode: false,
    enableRegistration: true,
    enableComments: true,
    requireEmailVerification: true,
    maxUploadSize: "100",
    videoQuality: "1080p",
    defaultLanguage: "English",
    timezone: "Africa/Kampala",
  });

  const handleSave = () => {
    console.log("Settings saved:", settings);
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Configure your platform settings</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors btn-glow"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>

      {/* General Settings */}
      <div className="glass-card p-6 rounded-xl border border-border/50">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">General Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Site Description</label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Maintenance Mode</p>
              <p className="text-sm text-muted-foreground">Temporarily disable the site</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
            </label>
          </div>
        </div>
      </div>

      {/* User Settings */}
      <div className="glass-card p-6 rounded-xl border border-border/50">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">User Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Enable Registration</p>
              <p className="text-sm text-muted-foreground">Allow new users to sign up</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableRegistration}
                onChange={(e) => setSettings({ ...settings, enableRegistration: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Require Email Verification</p>
              <p className="text-sm text-muted-foreground">Users must verify their email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Enable Comments</p>
              <p className="text-sm text-muted-foreground">Allow users to comment on content</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableComments}
                onChange={(e) => setSettings({ ...settings, enableComments: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
            </label>
          </div>
        </div>
      </div>

      {/* Video Settings */}
      <div className="glass-card p-6 rounded-xl border border-border/50">
        <div className="flex items-center gap-2 mb-6">
          <Database className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Video Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Max Upload Size (MB)</label>
            <input
              type="number"
              value={settings.maxUploadSize}
              onChange={(e) => setSettings({ ...settings, maxUploadSize: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Default Video Quality</label>
            <select
              value={settings.videoQuality}
              onChange={(e) => setSettings({ ...settings, videoQuality: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="360p">360p</option>
              <option value="480p">480p</option>
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
            </select>
          </div>
        </div>
      </div>

      {/* Localization */}
      <div className="glass-card p-6 rounded-xl border border-border/50">
        <div className="flex items-center gap-2 mb-6">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Localization</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Default Language</label>
            <select
              value={settings.defaultLanguage}
              onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="English">English</option>
              <option value="Luganda">Luganda</option>
              <option value="Swahili">Swahili</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Africa/Kampala">Africa/Kampala (Uganda)</option>
              <option value="Africa/Nairobi">Africa/Nairobi (Kenya)</option>
              <option value="Africa/Dar_es_Salaam">Africa/Dar es Salaam (Tanzania)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card p-6 rounded-xl border border-border/50">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Notification Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">New User Notifications</p>
              <p className="text-sm text-muted-foreground">Get notified when new users register</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Payment Notifications</p>
              <p className="text-sm text-muted-foreground">Get notified about new subscriptions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
