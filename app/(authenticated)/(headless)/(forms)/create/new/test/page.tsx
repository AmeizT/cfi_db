import { MembersEmptyState } from "@/components/ui/members-empty-state"

export default function TestPage() {
    return (
        <MembersEmptyState
            avatars={[
                "/images/members/man-01.png",
                "/images/members/woman-01.png",
                "/images/members/teen-girl.png",
                "/images/members/man-02.png",
                "/images/members/teen-boy.png",
                "/images/members/woman-02.png",
                "/images/members/girl.png",
                "/images/members/boy.png",
            ]}
            
        />
    )
}