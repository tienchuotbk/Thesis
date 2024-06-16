import defaultComponentSrc from "../assets/images/default_company.jpg";

export const getLogoSrc = (href: string) => {
  if (href.includes("https://")) {
    return href;
  } else {
    return defaultComponentSrc;
  }
};