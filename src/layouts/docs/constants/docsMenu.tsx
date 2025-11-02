import { nanoid } from "nanoid"

interface MenuItem {
    id: string
    name: string
    description: string
    path?: string
    subItems?: MenuItem[]
    meta?: {
        icons?: {
            active: React.JSX.Element
            inactive?: React.JSX.Element
        }
        action?: {
            path: string
        }
    }
}

function generatePath(name: string, parentPath: string = "/docs"): string {
    return `${parentPath}/${name.toLowerCase().replace(/\s+/g, "-")}`;
}

export const docsMenu: { main: MenuItem[] } = {
    main: [
        {
            id: nanoid(),
            name: "Introduction",
            description: "Get started with the basics.",
            get path(){
                return generatePath("")
            },
        },
        {
            id: nanoid(),
            name: "Account",
            description: "Manage your account settings and profile.",
            get path() {
                return generatePath(this.name)
            },
            get subItems() {
                return [
                    {
                        id: nanoid(),
                        name: "Profile",
                        description: "Update your profile information and settings.",
                        get path() {
                            // return generatePath(this.name, this.parentPath);
                            return generatePath("");
                        },
                        parentPath: this.path
                    },
                    {
                        id: nanoid(),
                        name: "Security and Access",
                        description: "Update your password and manage your security settings.",
                        get path() {
                            return generatePath("");
                        },
                        parentPath: this.path
                    },
                    {
                        id: nanoid(),
                        name: "Integrations",
                        description: "Connect your account with third-party services.",
                        get path() {
                            return generatePath("");
                        },
                        parentPath: this.path
                    }
                ];
            }
        },
        {
            id: nanoid(),
            name: "Editor",
            description: "Learn how to use the editor.",
            get path() {
                return generatePath("")
            },
        },
        {
            id: nanoid(),
            name: "Congregation",
            description: "Get started with the basics.",
            get path() {
                return generatePath("")
            },
            get subItems() {
                return [
                    {
                        id: nanoid(),
                        name: "Members",
                        description: "Manage your congregation's members.",
                        get path() {
                            return generatePath("");
                        },
                        parentPath: this.path
                    },
                    {
                        id: nanoid(),
                        name: "Baptism",
                        description: "Manage your congregation's baptism certificates.",
                        get path() {
                            return generatePath("");
                        },
                        parentPath: this.path
                    }
                ]
            }
        },
        {
            id: nanoid(),
            name: "Finance",
            description: "Get started with the basics.",
            get path() {
                return generatePath("")
            },
        },
        {
            id: nanoid(),
            name: "Analytics",
            description: "Get started with the basics.",
            get path() {
                return generatePath("")
            },
            get subItems() {
                return [
                    {
                        id: nanoid(),
                        name: "Insights",
                        description: "View and analyze your congregation's data.",
                        get path() {
                            return generatePath("");
                        },
                        parentPath: this.path
                    },
                    {
                        id: nanoid(),
                        name: "Observability",
                        description: "Monitor your congregation's performance.",
                        get path() {
                            return generatePath("");
                        },
                        parentPath: this.path
                    }
                ]
            }
        },
    ],
}