import { convertFaToGoogleFont } from "./ai/fa-convert"
import type { linkCardProps } from "./routes/linkCard"
import type { LinkCardType } from "./types"

export type oldFormat = {
    naam: string[],
    link: string[],
    icon: {
        icondata: string[]
        icontype: any
    }
}

export function upgrade(data: oldFormat): LinkCardType[] {
    let output: LinkCardType[] = []
    for (let i = 0; i < data.naam.length; i++) {
        let resultThisLoop = {
            text: "update error",
            icon: "",
            link: "mailto:siem@siemvk.nl",
            id: crypto.randomUUID()
        } as LinkCardType
        resultThisLoop.icon = convertFaToGoogleFont(data.icon.icondata[i])
        resultThisLoop.text = data.naam[i]
        resultThisLoop.link = urlHTTPSFix(data.link[i])
        output.push(resultThisLoop)
    }
    return output
}

function urlHTTPSFix(url: string) {
    if (!url.startsWith("https://") && !url.startsWith("http://")) {
        return "https://" + url
    }
    return url
}