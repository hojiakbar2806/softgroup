"use client";

import { Search, X } from "lucide-react";
import Form from "next/form";
import React, { FC, Fragment, useState } from "react";

const SearchComp: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async (fromData: FormData) => {
    const search = fromData.get("search") as string;
    if (!search) return;
    setIsModalOpen(true);
  };

  return (
    <Fragment>
      <Form action={handleSearch} className="flex justify-center">
        <label
          htmlFor="search"
          className="w-full h-full md:w-[60%] relative px-2 flex items-center gap-3 border rounded-lg lg:px-5 lg:py-3 bg-white
          focus-within:ring-2 focus-within:ring-purple-500 transition"
        >
          <Search className="size-5 md:size-7 text-gray-400" />
          <input
            type="text"
            id="search"
            name="search"
            autoComplete="off"
            placeholder="Search..."
            className="outline-none bg-transparent w-full text-gray-700 md:text-xl"
            aria-label="Search"
          />
        </label>
        <button
          type="submit"
          className="ml-4 px-4 py-2 lg:text-xl border-2 border-purple-500 text-purple-500 rounded-lg 
          hover:bg-purple-600 hover:text-white transition"
        >
          Search
        </button>
      </Form>

      <div
        data-open={isModalOpen}
        onClick={() => setIsModalOpen(false)}
        className="group h-screen opacity-0 pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm 
        transition-all duration-300 data-[open=true]:opacity-100 data-[open=true]:pointer-events-auto p-4"
      >
        <div
          className="w-full h-full overflow-y-auto bg-white rounded-lg shadow-lg  transition-all duration-300 transform scale-0
           group-data-[open=true]:scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex sticky top-0 bg-white z-50 justify-between items-center border-b p-4">
            <h2 className="text-lg font-bold">Search Results</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="size-6 text-red-500" />
            </button>
          </div>
          <div className="p-4">
            {/* <TemplateCardWrapper>
              {Array.from({ length: 10 }).map((_, index) => (
                <TemplateCard key={index} template={null} />
              ))}
            </TemplateCardWrapper> */}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SearchComp;
