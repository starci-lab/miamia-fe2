import type { ReactNode } from "react"
import { RouteShell } from "@/components/shells/RouteShell"
import { MiaMiaAppLayout } from "@/components/layouts/MiaMiaAppLayout"

type MiaMiaSegmentLayoutProps = { readonly children: ReactNode }

/** Mount every MiaMia app route inside its responsive navigation frame. */
const MiaMiaSegmentLayout = ({ children }: MiaMiaSegmentLayoutProps) => <RouteShell frame={MiaMiaAppLayout} props={{}}>{children}</RouteShell>

export default MiaMiaSegmentLayout
