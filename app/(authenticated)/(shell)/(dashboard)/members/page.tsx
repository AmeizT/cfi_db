import { redirect } from "next/navigation"
import { APP_ROUTES } from "@/config/app-routes"

export default function MembersPage() {
    redirect(APP_ROUTES.members.directory)
}
