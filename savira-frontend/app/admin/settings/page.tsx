"use client";
import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import toast from "react-hot-toast";
import { FiSave, FiShield, FiBell, FiGlobe, FiMail } from "react-icons/fi";

export default function AdminSettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"store" | "notifications" | "security">("store");

  const [storeSettings, setStoreSettings] = useState({
    storeName: "SAVIRA ATTIRES",
    tagline: "Grace Woven Beautifully",
    email: "support@saviraattires.com",
    phone: "+91 99999 99999",
    whatsapp: "919999999999",
    address: "Tamil Nadu, India",
    freeShippingAbove: "999",
    codAvailable: true,
    maintenanceMode: false,
  });

  const [notifSettings, setNotifSettings] = useState({
    newOrderEmail: true,
    lowStockAlert: true,
    lowStockThreshold: "5",
    newUserEmail: false,
    paymentFailEmail: true,
  });

  const handleSaveStore = () => {
    toast.success("Store settings saved");
  };

  const handleSaveNotif = () => {
    toast.success("Notification settings saved");
  };

  const tabs = [
    { key: "store", label: "Store", icon: FiGlobe },
    { key: "notifications", label: "Notifications", icon: FiBell },
    { key: "security", label: "Security", icon: FiShield },
  ] as const;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="font-playfair text-2xl text-charcoal">Settings</h1>
        <p className="font-poppins text-xs text-gray-400 mt-0.5">Manage your store configuration</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm mb-6 w-fit">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-poppins text-sm transition-all ${activeTab === key ? "bg-sage text-white shadow-sm" : "text-gray-500 hover:text-charcoal"}`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Store Settings */}
      {activeTab === "store" && (
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="font-playfair text-base text-charcoal">Store Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Store Name</label>
              <input value={storeSettings.storeName} onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Tagline</label>
              <input value={storeSettings.tagline} onChange={(e) => setStoreSettings({ ...storeSettings, tagline: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Support Email</label>
              <input type="email" value={storeSettings.email} onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Phone</label>
              <input value={storeSettings.phone} onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">WhatsApp Number</label>
              <input value={storeSettings.whatsapp} onChange={(e) => setStoreSettings({ ...storeSettings, whatsapp: e.target.value })} className="input-field" placeholder="91XXXXXXXXXX" />
            </div>
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Free Shipping Above (₹)</label>
              <input type="number" value={storeSettings.freeShippingAbove} onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingAbove: e.target.value })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Store Address</label>
            <input value={storeSettings.address} onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })} className="input-field" />
          </div>
          <div className="flex flex-wrap gap-5 pt-2">
            {[
              { key: "codAvailable", label: "Cash on Delivery Available" },
              { key: "maintenanceMode", label: "Maintenance Mode" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                <div
                  onClick={() => setStoreSettings({ ...storeSettings, [key]: !storeSettings[key as keyof typeof storeSettings] })}
                  className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative ${storeSettings[key as keyof typeof storeSettings] ? "bg-sage" : "bg-gray-200"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${storeSettings[key as keyof typeof storeSettings] ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="font-poppins text-sm text-gray-600">{label}</span>
              </label>
            ))}
          </div>
          <button onClick={handleSaveStore} className="btn-primary flex items-center gap-2">
            <FiSave size={14} /> Save Store Settings
          </button>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="font-playfair text-base text-charcoal">Email Notifications</h2>
          <div className="space-y-4">
            {[
              { key: "newOrderEmail", label: "New order placed", desc: "Get notified when a new order is placed" },
              { key: "lowStockAlert", label: "Low stock alert", desc: "Alert when product stock falls below threshold" },
              { key: "newUserEmail", label: "New user registration", desc: "Notify when a new user registers" },
              { key: "paymentFailEmail", label: "Payment failure", desc: "Alert on failed payment attempts" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-poppins text-sm font-medium text-charcoal">{label}</p>
                  <p className="font-poppins text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
                <div
                  onClick={() => setNotifSettings({ ...notifSettings, [key]: !notifSettings[key as keyof typeof notifSettings] })}
                  className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative ${notifSettings[key as keyof typeof notifSettings] ? "bg-sage" : "bg-gray-200"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifSettings[key as keyof typeof notifSettings] ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
              </div>
            ))}
          </div>
          <div>
            <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Low Stock Threshold (units)</label>
            <input type="number" value={notifSettings.lowStockThreshold} onChange={(e) => setNotifSettings({ ...notifSettings, lowStockThreshold: e.target.value })} className="input-field max-w-[120px]" min="1" />
          </div>
          <button onClick={handleSaveNotif} className="btn-primary flex items-center gap-2">
            <FiSave size={14} /> Save Notification Settings
          </button>
        </div>
      )}

      {/* Security */}
      {activeTab === "security" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-playfair text-base text-charcoal mb-4">Admin Account</h2>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-4">
              <div className="w-12 h-12 rounded-full bg-sage text-white flex items-center justify-center font-playfair text-xl font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-poppins text-sm font-medium text-charcoal">{user?.name}</p>
                <p className="font-poppins text-xs text-gray-400">{user?.email}</p>
                <span className="font-poppins text-[10px] bg-sage/10 text-sage px-2 py-0.5 rounded-full mt-1 inline-block">Administrator</span>
              </div>
            </div>
            <a href="/account/profile" className="btn-outline text-sm inline-flex items-center gap-2">
              <FiShield size={14} /> Change Password
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-playfair text-base text-charcoal mb-4">Security Info</h2>
            <div className="space-y-3 font-poppins text-sm">
              {[
                { label: "JWT Authentication", status: "Active", ok: true },
                { label: "Password Hashing (bcrypt)", status: "Active", ok: true },
                { label: "Rate Limiting", status: "Active", ok: true },
                { label: "MongoDB Sanitization", status: "Active", ok: true },
                { label: "CORS Protection", status: "Active", ok: true },
                { label: "Helmet Security Headers", status: "Active", ok: true },
              ].map(({ label, status, ok }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-600">{label}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${ok ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
