import type { HTMLAttributes } from "react"

export interface linkCardProps extends HTMLAttributes<HTMLElement> {
    icon: string,
    text: string,
    id: any,
    click: (arg0: any) => void

}

export default function LinkCard(
    { icon,
        text,
        id,
        click
    }: linkCardProps) {
    return <article className="no-padding border responsive s12 m6 l3" onClick={() => { click(id) }}>
        <div className="padding linkcard">
            <div className="linkcardIcon center">
                <i className="extra fill">
                    {icon}
                </i>
            </div>

            <h3>{text}</h3>
        </div>
    </article>
}