import { getMetaData } from "@/config/metadata";
import { OnboardingView } from "@/features/people/onboarding/views/OnboardingView"

const meta = getMetaData({ title: "Onboarding" })
export const metadata = { ...meta }

export default function OnboardingPage() {
    return <OnboardingView />
}