import { FC } from "react";
import { asImageSrc, Content } from "@prismicio/client";
import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import { Bounded } from "@/components/Bounded";
import { Heading } from "@/components/Heading";
import { ButtonLink } from "@/components/ButtonLink";
import { WideLogo } from "./WideLogo";
import { TallLogo } from "./TallLogo";
import {InteractiveSkateboard} from "./InteractiveSkateboard";

const DEFAULT_DECK_TEXTURE = "/skateboard/Deck.webp";
const DEFAULT_WHEEL_TEXTURE = "/skateboard/SkateWheel1.png";
const DEFAULT_TRUCK_COLOR = "#6F6E6A";
const DEFAULT_BOLT_COLOR = "#6F6E6A";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero: FC<HeroProps> = ({ slice }) => {
  const deckTextureURL =
    asImageSrc(slice.primary.skateboard_deck_texture) || DEFAULT_DECK_TEXTURE;
  const wheelTextureURL =
    asImageSrc(slice.primary.skateboard_wheel_texture) || DEFAULT_WHEEL_TEXTURE;
  const truckColor =
    slice.primary.skateboard_truck_color || DEFAULT_TRUCK_COLOR;
  const boltColor = slice.primary.skateboard_bolt_color || DEFAULT_BOLT_COLOR;
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-[#f7d0e9] h-dvh  text-shadow-zinc-800 bg-texture"
    >
      <div className="absolute inset-0 flex items-center pt-20 ">
        <WideLogo className="w-full text-purple-400 hidden opacity-20 mix-blend-multiply lg:block " />
        <TallLogo className="w-full h-full text-purple-400  opacity-20 mix-blend-multiply lg:hidden " />
      </div>

      <div className="absolute inset-0 mx-auto mt-24 grid max-w-7xl grid-rows-[1fr_auto] place-items-end px-6 py-[clamp(15px,2vw,20px)]">
        <Heading className="relative max-w-2xl place-self-start">
          <PrismicText field={slice.primary.heading} />
        </Heading>

        <div className="flex relative w-full flex-col items-center justify-between gap-[clamp(8px,2vw,16px)] lg:flex-row">
          <div className=" max-w-[45ch] font-semibold text-[clamp(0.125rem,2vw,1.25rem)]">
            <PrismicRichText field={slice.primary.body} />
          </div>

          <ButtonLink
            field={slice.primary.button}
            icon="skateboard"
            size="lg"
            className="z-20 mt-2 block"
            color="orange"
          >
            {slice.primary.button.text}
          </ButtonLink>
          {/* <PrismicNextLink field={slice.primary.button} /> */}

          <InteractiveSkateboard
            deckTextureURL={deckTextureURL}
            wheelTextureURL={wheelTextureURL}
            truckColor={truckColor}
            boltColor={boltColor}
          />
        </div>
      </div>
    </Bounded>
  );
};

export default Hero;
