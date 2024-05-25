import en from "./en"

export default (lang, key) => {
    if (lang === "en") {
        return en[key]
    } else if (lang === "vi") {
        return vi[key]
    }
}