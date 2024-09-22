import { useControls } from "leva"
import { useEffect, useMemo } from "react"

import { CameraName, useAppControls } from "~/gl/hooks/use-app-controls"
import { useToggleControl } from "~/gl/hooks/use-toggle-control"
import { HtmlIn } from "~/gl/tunnel"
import { useDevice } from "~/hooks/use-device"
import { useMousetrap } from "~/hooks/use-mousetrap"

import { Grid } from "./grid"
import { ShadowLightHelper } from "./light-helper"
import { OrbitHelper } from "./orbit"
import { Stats } from "./stats"

const cameraOptions = [
  "main",
  "orbit",
  "shadow"
] as const satisfies CameraName[]

/** Adds all the scene helpers */
export const Helpers = () => {
  const [lightHelper] = useToggleControl({
    folder: "Helpers",
    key: "lightHelper",
    label: "Light",
    shortcut: "l",
    defaultValue: false
  })

  const [gridHelper] = useToggleControl({
    folder: "Helpers",
    key: "gridHelper",
    label: "Grid",
    shortcut: "g",
    defaultValue: false
  })

  const [showStats] = useToggleControl({
    folder: "Helpers",
    key: "showStats",
    label: "Stats",
    shortcut: "t",
    defaultValue: false
  })

  const [showDeviceData] = useToggleControl({
    folder: "Helpers",
    key: "showDeviceData",
    label: "Device data",
    shortcut: "d",
    defaultValue: false
  })

  const activeCamera = useAppControls((s) => s.activeCamera)
  const [, setCamera] = useControls(() => ({
    camera: {
      label: "Camera (C)",
      value: "main", // controlled
      options: {
        "Main (M)": "main",
        "Orbit (O)": "orbit",
        "Shadow (S)": "shadow"
      },
      onChange: (value: CameraName) => {
        useAppControls.setState({
          activeCamera: value,
          multiplyCanvas: value === "main"
        })
      },
      transient: false
    }
  }))

  useEffect(() => {
    setCamera({
      camera: activeCamera
    })
  }, [activeCamera, setCamera])

  useMousetrap([
    {
      keys: "c",
      callback: () => {
        const nextCamera =
          cameraOptions[
            (cameraOptions.indexOf(useAppControls.getState().activeCamera) +
              1) %
              cameraOptions.length
          ]
        useAppControls.setState({ activeCamera: nextCamera })
      }
    },
    {
      keys: "m",
      callback: () => {
        useAppControls.setState({ activeCamera: "main" })
      }
    },
    {
      keys: "o",
      callback: () => {
        useAppControls.setState({ activeCamera: "orbit" })
      }
    },
    {
      keys: "s",
      callback: () => {
        useAppControls.setState({ activeCamera: "shadow" })
      }
    }
  ])

  const deviceData = useDevice()

  const stringVersion = useMemo(
    () => JSON.stringify(deviceData, null, 3).split("\n"),
    [deviceData]
  )

  return (
    <>
      <OrbitHelper />
      {lightHelper && <ShadowLightHelper />}
      {gridHelper && <Grid size={20} divisions={20} />}
      {showStats && <Stats />}
      {showDeviceData && (
        <HtmlIn>
          <div
            data-lenis-prevent
            className="fixed p-4 overflow-y-auto font-mono text-white bg-black/80 left-4 max-w-96 inset-y-4 z-debug"
          >
            {stringVersion.map((line, i) => (
              <div className="whitespace-pre" key={i}>
                {line}
              </div>
            ))}
          </div>
        </HtmlIn>
      )}
    </>
  )
}
