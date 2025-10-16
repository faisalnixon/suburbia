import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from "@prismicio/react";

import { Bounded } from "@/components/Bounded";
import { Heading } from "@/components/Heading";
import { PrismicNextLink } from "@prismicio/next";
import { SkateboardProduct } from "./SkateboardProduct";
import { SlideIn } from "@/components/SlideIn";

/**
 * Props for `ProductGrid`.
 */
export type ProductGridProps = SliceComponentProps<Content.ProductGridSlice>;

/**
 * Component for "ProductGrid" Slices.
 */
const ProductGrid: FC<ProductGridProps> = ({ slice }) => {
  console.log(slice.primary.product[0]);

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <SlideIn>
        <Heading className="text-center mb-4 md:mb-6" as="h2">
          <PrismicText field={slice.primary.heading} />
        </Heading>
      </SlideIn>

      <div className="text-center mb-6 md:mb-10">
        <PrismicRichText field={slice.primary.body} />
      </div>

      {/* {(slice.primary.product??[]).map(( item,index ) =>
          // <PrismicNextLink key={index} field={item.skateboard}>Link</PrismicNextLink>
      )} */}

      <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(slice.primary.product ?? []).map(
          ({ skateboard }) =>
            isFilled.contentRelationship(skateboard) && (
              <SkateboardProduct key={skateboard.id} id={skateboard.id} />
            )
        )}
      </div>
    </Bounded>
  );
};

export default ProductGrid;

// import { FC } from "react";
// import { Content } from "@prismicio/client";
// import { SliceComponentProps } from "@prismicio/react";

// /**
//  * Props for `ProductGrid`.
//  */
// export type ProductGridProps = SliceComponentProps<Content.ProductGridSlice>;

// /**
//  * Component for "ProductGrid" Slices.
//  */
// const ProductGrid: FC<ProductGridProps> = ({ slice }) => {
//   return (
//     <section
//       data-slice-type={slice.slice_type}
//       data-slice-variation={slice.variation}
//     >
//       Placeholder component for product_grid (variation: {slice.variation})
//       slices.
//       <br />
//       <strong>You can edit this slice directly in your code editor.</strong>
//       {/**
//        * 💡 Use Prismic MCP with your code editor
//        *
//        * Get AI-powered help to build your slice components — based on your actual model.
//        *
//        * ▶️ Setup:
//        * 1. Add a new MCP Server in your code editor:
//        *
//        * {
//        *   "mcpServers": {
//        *     "Prismic MCP": {
//        *       "command": "npx",
//        *       "args": ["-y", "@prismicio/mcp-server@latest"]
//        *     }
//        *   }
//        * }
//        *
//        * 2. Select a model optimized for coding (e.g. Claude 3.7 Sonnet or similar)
//        *
//        * ✅ Then open your slice file and ask your code editor:
//        *    "Code this slice"
//        *
//        * Your code editor reads your slice model and helps you code faster ⚡
//        * 🎙️ Give your feedback: https://community.prismic.io/t/help-us-shape-the-future-of-slice-creation/19505
//        * 📚 Documentation: https://prismic.io/docs/ai#code-with-prismics-mcp-server
//        */}
//     </section>
//   );
// };

// export default ProductGrid;
