import Link from "next/link";
import React from "react";
import { ButtonLink } from "./ButtonLink";
import { Logo } from "./Logo";
import { createClient } from "@/prismicio";
import { PrismicNextLink } from "@prismicio/next";


export async function Header() {
  const client = createClient()
  const settings = await client.getSingle("settings")


  return (
    <header
      className="header absolute left-0 right-0 top-0 z-50 h-[clamp(128px,10vw,192px)] px-[clamp(16px,5vw,24px)] py-[clamp(16px,5vw,24px)] md:h-32"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[auto_auto] items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="justify-self-start">
          <Logo className="text-lime-700 h-12 md:h-20 "/>
        </Link>
        <nav
          aria-label="Main"
          className="col-span-full row-start-2 md:col-span-1 md:col-start-2 md:row-start-1"
        >
          <ul className="flex flex-wrap items-center justify-center gap-8">
            {settings.data.navigation.map((item)=>(
              <li key={item.link.text}>
                <PrismicNextLink field={item.link} className="text-lg md:text-xl"/>
              </li>
            ))}
           
          </ul>
        </nav>
        <div className="justify-self-end">
          <ButtonLink
            href={""}
            icon="cart"
            color="purple"
            size="sm"
            aria-label="Cart (1)"
            className=" gap-2.5 py-2 text-base"
          >
            <span className="md:hidden">1</span>
            <span className="hidden md:inline">Cart (1)</span>
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
