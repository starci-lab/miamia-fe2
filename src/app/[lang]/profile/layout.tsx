import type { ReactNode } from "react"
import { RouteShell } from "@/components/route/RouteShell"
import { MiaMiaAppLayout } from "@/components/layouts/MiaMiaAppLayout"

type ProfileLayoutProps = { readonly children: ReactNode }
/** Mount every profile route inside the shared MiaMia responsive navigation frame. */
const ProfileLayout = ({ children }: ProfileLayoutProps) => <RouteShell frame={MiaMiaAppLayout} props={{}}>{children}</RouteShell>
export default ProfileLayout
