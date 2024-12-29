"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";

export default function Profile() {
  const router = useRouter();
  return (
    <section className="flex-1 py-8">
      <motion.div
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Templates</h1>
          <Button
            onClick={() => router.push("/profile/templates/add-template")}
          >
            Add template
          </Button>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TemplateCard />
          <TemplateCard />
          <TemplateCard />
        </div>
      </motion.div>
    </section>
  );
}

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
