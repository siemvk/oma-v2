import type { Route } from "./+types/home";
import { Button, Card, Select, Space, useToast, } from "@siemsiem/beerreact"
import Input from "../Input"
import LinkCard from "./linkCard"
import "../app.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { upgrade, type oldFormat } from "~/dataUpgrader";
import { lsKeys, type LinkCardType } from "~/types";
import { materialIconsList } from "~/ai/icons";


export default function Home() {
  const { addToast } = useToast();

  const [cardData, setCardData] = useState<LinkCardType[] | null>(null)
  const zoekbalk = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view")
  const [imgURL, setImgURL] = useState<null | string>(null)
  const [showEditMenu, setShowEditMenu] = useState(false)
  const [editMenuOpenNow, setEditMenuOpenNow] = useState<LinkCardType>({
    icon: "",
    link: "",
    text: "",
    id: "",
  })
  const [editText, setEditText] = useState("")
  const [editLink, setEditLink] = useState("")
  const [editIcon, setEditIcon] = useState("")

  function cycleMode() {
    if (mode == "view") {
      setMode("edit")
    } else if (mode == "edit") {
      setMode("delete")
    } else if (mode == "delete") {
      setMode("view")
    }
  }

  function cardUpdate(card: LinkCardType) {
    let hasUpdatedExisting = false;
    const newData = cardData?.map((v) => {
      if (v.id == card.id) {
        hasUpdatedExisting = true;
        return card
      } else {
        return v
      }
    })

    if (!hasUpdatedExisting) {
      newData!.push(card)
    }
    setCardData(newData!)
    localStorage.setItem(lsKeys.main, JSON.stringify(newData))

  }

  useEffect(() => {
    setEditText(editMenuOpenNow.text)
    setEditLink(editMenuOpenNow.link)
    setEditIcon(editMenuOpenNow.icon)
  }, [editMenuOpenNow])

  useEffect(() => {
    const applyTheme = () => {
      const hour = new Date().getHours()
      const shouldUseDark = hour >= 20 || hour < 6
      document.body.classList.toggle("dark", shouldUseDark)
      ui("mode", shouldUseDark ? "dark" : "light");
    }

    applyTheme()
    const interval = window.setInterval(applyTheme, 60_000)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "9" && !event.repeat) {
        cycleMode()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [mode])

  useMemo(() => {
    if (mode !== "view") {
      addToast({ text: mode })
    }
  }, [mode])
  useMemo(() => {
    fetch("https://todayimg.siemvk.nl/image-url")
      .then((res) => res.text())
      .then((data: string) => {
        setImgURL(data)
        ui("theme", data)
      })

  }, [])
  useMemo(() => {
    const data = localStorage.getItem(lsKeys.main);
    if (data) {
      setCardData(JSON.parse(data))
    }
    const old = localStorage.getItem("main")
    if (old) {
      const oldJSON = JSON.parse(old) as oldFormat
      const upgradedData = upgrade(oldJSON)
      localStorage.setItem(lsKeys.main, JSON.stringify(upgradedData))
      setCardData(upgradedData)
      // maak backup en verwijder og
      localStorage.setItem("BACKUP", old)
      localStorage.removeItem("main")
      return
    }
  }, [])
  function clickHandel(url: LinkCardType) {

    if (mode == "view") {
      location.href = url.link;

    } else if (mode == "delete") {
      setCardData(cardData?.filter((v) => { return v.id !== url.id })!)
      localStorage.setItem(lsKeys.main, JSON.stringify(cardData?.filter((v) => { return v.id !== url.id })!))

    } else if (mode == "edit") {

      setEditMenuOpenNow(url)
      setShowEditMenu(true)
    }
  }
  return <div style={{

    margin: "0",
  }
  }>

    <div style={{
      height: "40vh",
      width: "100%",
      margin: "0",
      backgroundImage: `url(${imgURL})`,
      backgroundRepeat: "no-repeat",

      // gpt 5 mini 22 juli 2026
      /* center the image and scale to cover the area so it crops from center
         instead of leaving empty space at top or sides */
      backgroundPosition: "center",
      backgroundSize: "cover",
      /* fallback background color while image loads */
      backgroundColor: "#111"
    }}>
      <article className="absolute middle center blur center-align" style={{
        padding: "1.5rem"
      }} >
        <h2 className="text-center">Welkom terug!</h2>
        {/* // Source - https://stackoverflow.com/a/76484179
          // Posted by user21915868, modified by community. See post 'Timeline' for change history
          // Retrieved 2026-07-22, License - CC BY-SA 4.0 */}
        <form action="http://www.google.com/search" method="get" >
          <nav ref={zoekbalk} className="center-align no-space">
            <Input label="Zoeken met google" round={true} {...({ name: "q" } as any)}></Input>
            <Button FAB={true} className="right-round large" icon="search" type="submit"></Button>
          </nav>
        </form>
      </article>
    </div>

    <div className="grid" style={{ margin: "1rem" }}>
      {/* <div className="grid"> */}
      {cardData?.map((v) => {
        return <LinkCard click={clickHandel} key={v.text} icon={mode == "view" ? v.icon : (mode == "delete" ? "delete" : "edit")} id={v} text={v.text}></LinkCard>
      })}

    </div>
    <Space size='medium-space'></Space>
    <div className="absolute bottom right padding">

      {mode === "edit" ? <Button FAB={true} icon="add" shape="square" onClick={() => {
        setShowEditMenu(true)
        // TODO: dit echt de data geven
        setEditMenuOpenNow({
          icon: "",
          link: "",
          text: "",
          id: crypto.randomUUID()
        })
      }} ></Button> : ""}
    </div>

    {/* <Button size="small" variant="chip" FAB={true} onClick={cycleMode}></Button> */}

    <dialog className={`left ${showEditMenu ? "active" : ""}`} key={`${editMenuOpenNow.link}-${editMenuOpenNow.text}-${editMenuOpenNow.icon}-${editMenuOpenNow.id}`}>
      <h5>Edit</h5>
      <Input label="Text" {...({ value: editText, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEditText(e.target.value) } as any)}></Input>
      <Input label="URL" {...({ value: editLink, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEditLink(e.target.value) } as any)}></Input>
      <Select label="Icoon" {...({ value: editIcon, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setEditIcon(e.target.value) } as any)}>
        <option value="">--Kies een icoon--</option>
        {materialIconsList.map((v) => {
          return <option key={v.icon} value={v.icon}>{v.label}</option>
        })}
      </Select>

      <nav className="right-align">
        <button className="border" onClick={() => {
          setShowEditMenu(false)
          setEditText("")
          setEditLink("")
          setEditIcon("")
          setEditMenuOpenNow({
            icon: "",
            link: "",
            text: "",
            id: "",
          })
        }}>Cancel</button>
        <button onClick={() => {
          cardUpdate({
            ...editMenuOpenNow,
            text: editText,
            link: editLink,
            icon: editIcon,
          })
          setShowEditMenu(false)
          setEditText("")
          setEditLink("")
          setEditIcon("")
        }}>Save</button>
      </nav>
    </dialog >
  </div >;
}