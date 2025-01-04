"use client";

import React, { Fragment, useState } from "react";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import Form from "next/form";
import TemplateCard from "@/components/common/templateCard/templateCard";
import { TemplateCardSkeleton } from "@/components/common/templateCard/templateCardSkeleton";
import TemplateCardWrapper from "@/components/common/templateCard/templateCardWrapper";
import { GetAllTemplateService } from "@/services/template.service";
import { motion, AnimatePresence } from "framer-motion";

const SearchComp = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslations("TemplatePage.Header");

  const { data, isLoading } = useQuery({
    queryKey: ["templates", searchQuery],
    queryFn: () => GetAllTemplateService(`slug=${searchQuery}`),
    enabled: !!searchQuery,
  });

  const handleSearch = async (formData: FormData) => {
    const search = formData.get("search") as string;
    if (!search?.trim()) return;

    setSearchQuery(search);
    setIsModalOpen(true);
  };

  return (
    <Fragment>
      <Form
        action={handleSearch}
        className="flex items-center gap-2 w-full max-w-4xl mx-auto px-4"
      >
        <div className="relative flex-1">
          <label
            htmlFor="search"
            className="flex items-center w-full relative group border bg-white focus-within:border-purple-500 rounded-lg
            px-3 py-1.5 sm:px-4 md:py-2 lg:px-5 lg:text-base 2xl:px-6 2xl:text-lg"
          >
            <Search className="w-5 h-5 text-gray-400 hidden sm:block" />
            <input
              type="text"
              id="search"
              name="search"
              autoComplete="off"
              placeholder={t("search.placeholder")}
              className="w-full pl-1 placeholder:text-purple-500 text-purple-500  outline-none bg-transparent"
              aria-label="Search"
            />
          </label>
        </div>

        <button
          type="submit"
          className="border border-purple-500 rounded-lg hover:bg-purple-500 hover:text-white transition
          px-3 py-1.5 sm:px-4 md:py-2 lg:px-5 lg:text-base 2xl:px-6 2xl:text-lg"
        >
          <span className="hidden sm:inline">{t("search.button")}</span>
          <Search className="w-6 h-6 text-gray-400 sm:hidden block" />
        </button>
      </Form>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative m-0 md:m-4"
            >
              <div className="sticky  top-0 z-10 bg-white border-b px-4 py-3 sm:px-6 flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-medium text-gray-900">
                  Search Results for{" "}
                  <span className="font-semibold">"{searchQuery}"</span>
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 sm:p-6">
                {isLoading ? (
                  <TemplateCardWrapper>
                    {Array.from({ length: 8 }).map((_, index) => (
                      <TemplateCardSkeleton key={index} />
                    ))}
                  </TemplateCardWrapper>
                ) : data?.length ? (
                  <TemplateCardWrapper>
                    {data.map((product) => (
                      <TemplateCard key={product.id} product={product} />
                    ))}
                  </TemplateCardWrapper>
                ) : (
                  <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                      <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                        No results found
                      </h3>
                      <p className="text-sm text-gray-500">
                        Try adjusting your search to find what you're looking
                        for
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Fragment>
  );
};

export default SearchComp;
