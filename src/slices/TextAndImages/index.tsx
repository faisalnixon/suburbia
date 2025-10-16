import { Content } from "@prismicio/client";
import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from "@prismicio/react"; 
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { Bounded } from "@/components/Bounded";
import clsx from "clsx";
import { Heading } from "@/components/Heading";
import { ButtonLink } from "@/components/ButtonLink";
import ParallaxImage from "./ParallaxImage";

declare module "react"{
  interface CSSProperties{
    "--index"?:number
  }
}

/**
 * Props for `TextAndImages`.
 */
export type TextAndImagesProps =
  SliceComponentProps<Content.TextAndImagesSlice>;

/**
 * Component for "TextAndImages" Slices.
 */
const TextAndImages = ({ slice,index }:TextAndImagesProps) => {
  const theme = slice.primary.theme;
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={clsx(
        'sticky top-[calc(var(--index)*2rem)]',
        theme === "Blue" && "bg-texture bg-blue-300 text-white",
        theme === "Orange" && "bg-texture bg-orange-300 text-white",
        theme === "Navy" && "bg-texture bg-blue-900 text-white",
        theme === "Lime" && "bg-texture bg-lime-300"
      )}
      style={{"--index":index}}
    >
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-24">
        <div
          className={clsx(
            "flex flex-col items-center gap-8 text-center md:items-start md:text-left",
            slice.variation === "imageOnLeft" && "md:order-2"
          )}
        >
          <Heading size="lg" as="h2">
            <PrismicText field={slice.primary.heading} />
          </Heading>

          <div className="max-w-md text-lg leading-relaxed">
            <PrismicRichText field={slice.primary.body} />
          </div>

          <ButtonLink
            field={slice.primary.button}
            color={theme === "Lime" ? "orange" : "lime"}
          >
            {slice.primary.button.text}
          </ButtonLink>
        </div>

        {/* <PrismicNextImage field={slice.primary.background_image} />
        <PrismicNextImage field={slice.primary.foreground_image} alt=""/> */}

        <ParallaxImage
          backgroundImage={slice.primary.background_image}
          foregroundImage={slice.primary.foreground_image}
        />
      </div>
    </Bounded>
  );
};



export default TextAndImages;
