"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Settings, ChevronRight, PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("templates");

  const sidebarLinks = [
    { id: "templates", icon: Camera, label: "My Templates" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const pageTransition = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <motion.div
        className="w-64 bg-white shadow-lg"
        initial={{ x: -10 }}
        animate={{ x: 0 }}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-6">Dashboard</h2>
          {sidebarLinks.map((link) => (
            <motion.button
              key={link.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(link.id)}
              className={`flex items-center w-full p-3 mb-2 rounded-lg ${
                activeTab === link.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              <link.icon className="w-5 h-5 mr-3" />
              {link.label}
              <ChevronRight className="w-4 h-4 ml-auto" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="flex-1 p-8"
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {activeTab === "templates" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">My Templates</h1>
              <Button className="flex items-center">
                <PlusCircle className="w-4 h-4 mr-2" />
                <Link href="profile/add-template">Add Template</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TemplateCard />
              <TemplateCard />
              <TemplateCard />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Template card component
const TemplateCard = () => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card>
        <CardHeader>
          <CardTitle>Template Title</CardTitle>
          <CardDescription>Downloads: 123 | Likes: 45</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Template description goes here...
          </p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">${99.99}</span>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
