import { useEffect, useState } from "react";

const MAX_MOBILE_WIDTH = "90vw";
const MOBILE_BREAKPOINT = 600;

const addMaxWidth = (el: any) => {
  el.style.maxWidth = MAX_MOBILE_WIDTH;

  (el.childNodes || []).forEach((x: any) => {
    if (x.nodeType == 1) addMaxWidth(x);
  });
};

const removeMaxWidth = (el: any) => {
  if (el.style.maxWidth !== MAX_MOBILE_WIDTH) return;

  el.style.maxWidth = "unset";

  (el.childNodes || []).forEach((x: any) => {
    if (x.nodeType == 1) removeMaxWidth(x);
  });
};

interface Props {
  description: string;
}

export const Article = ({ description }: Props) => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const itemContainer = document.querySelector(".item-container");

  const handleWindowResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    window.setTimeout(() => {
      if (windowWidth < MOBILE_BREAKPOINT && itemContainer)
        addMaxWidth(itemContainer);
    }, 1000);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (!itemContainer) return;

    if (windowWidth < MOBILE_BREAKPOINT) {
      addMaxWidth(itemContainer);
    }

    if (windowWidth > MOBILE_BREAKPOINT) {
      removeMaxWidth(itemContainer);
    }
  }, [windowWidth]);

  return <div dangerouslySetInnerHTML={{ __html: description }} />;
};
