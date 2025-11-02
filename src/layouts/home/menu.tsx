import { MenuItemBase } from "../types/menu-item"

export const homeMenu: { main: MenuItemBase[] } = {
    main: [
        {
            name: "Home",
            description: "Home",
            pathname: "/",
        },
        {
            name: "Docs",
            description: "Comprehensive guides and API references.",
            pathname: "/docs",
        },
        {
            name: "Blog",
            description: "Latest community updates, stories, and insights.",
            pathname: "/blog",
        },
        {
            name: "Legal",
            description: "Terms of service, privacy policy, and compliance guidelines.",
            pathname: "/tos",
        },
        {
            name: "Bible Academy",
            description: "Online courses and resources for spiritual and leadership growth.",
            pathname: "https://cba.cfi.church",
        },
    ],
}

