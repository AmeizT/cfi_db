import { APP_ROUTES } from "@/config/app-routes"
import { createLegacyRedirectPage } from "@/features/navigation/create-legacy-redirect-page"

export default createLegacyRedirectPage(APP_ROUTES.members.transfers)
