"use client";

import { Fragment } from "react";
import Header from "@/components/common/header";

// type Template = {
//   id: number;
//   title: string;
//   slug: string;
//   inStock: boolean;
//   price: {
//     current: number;
//     original: number;
//   };
//   rating: number;
//   ratingCount: number;
//   images: {
//     id: number;
//     url: string;
//   }[];
//   description: string;
//   features: {
//     id: number;
//     text: string;
//     available: boolean;
//   }[];
//   downloads: number;
//   likes: number;
// };

type TemplateDetailProps = {
  params: Promise<{ templateSlug: string }>;
};

export default async function TemplateDetailPage({
  params,
}: TemplateDetailProps) {
  const { templateSlug } = await params;
  console.log(templateSlug);
  // const [template, setTemplate] = useState<Template | null>(null);
  // const [selectedImage, setSelectedImage] = useState<number>(0);

  // const slug = params.templateSlug;

  // useEffect(() => {
  //   const fetchTemplate = async () => {
  //     const response = await fetch(
  //       `https://softgroup.uz/api/templates/${slug}`,
  //       {
  //         cache: "no-cache",
  //       }
  //     );
  //     const data = await response.json();
  //     setTemplate(data);
  //   };

  //   fetchTemplate();
  // }, [slug]);

  // if (!template) {
  //   return <div>Loading...</div>;
  // }

  return (
    <Fragment>
      <Header />
      {/* <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative h-[500px] rounded-2xl overflow-hidden bg-gray-100"
            >
              <Image
                src={template.images[selectedImage].url}
                fill
                style={{ objectFit: "cover" }}
                alt={template.title || ""}
                className="transition-all duration-300"
              />
            </motion.div>

            <div className="flex gap-4">
              {template.images.map((img, index) => (
                <motion.div
                  key={img.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-24 w-24 rounded-lg overflow-hidden cursor-pointer
                  ${
                    selectedImage === index
                      ? "ring-2 ring-purple-600"
                      : "ring-1 ring-gray-200"
                  }
                `}
                >
                  <Image
                    src={img.url}
                    fill
                    style={{ objectFit: "cover" }}
                    alt={template.title || ""}
                    className={`transition-all duration-300
                    ${selectedImage !== index && "hover:brightness-75"}`}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 bg-purple-100 text-white-600 rounded-full text-sm font-medium`}
                >
                  Free
                </span>
                {template.inStock && (
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                    In Stock
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {template.title}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`${
                      i < template.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {template.rating} ({template.ratingCount} reviews)
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-purple-600">
                  {template.price.current === 0
                    ? "Free"
                    : `$${template.price.current}`}
                </span>
                {template.price.original > template.price.current && (
                  <span className="text-xl text-gray-400 line-through">
                    ${template.price.original}.00
                  </span>
                )}
              </div>
              <p className="text-green-600 text-sm">
                ⚡ Limited time offer - Get it now!
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {template.description}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Key Features
              </h2>
              <ul className="grid grid-cols-2 gap-3">
                {template.features.map((feature) => (
                  <li key={feature.id} className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4 pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 
                text-white rounded-xl py-3 font-medium"
              >
                <ShoppingCart size={20} />
                Download Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600"
              >
                <Heart size={20} />
                <span className="sr-only">Like</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600"
              >
                <Share2 size={20} />
                <span className="sr-only">Share</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div> */}
    </Fragment>
  );
}
