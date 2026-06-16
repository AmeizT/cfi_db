// types/i18n.ts
export type AuthMessages = {
    heading: string;
    tagline: string;
    sso: {
        explanation: string;
    }
    fields: {
        identifier: string;
        password: string;
    }
    actions: {
        submit: string;
        loading: string;
    }
    links: {
        forgotPassword: string
    }
    legal: {
        notice: string;
    }
};

export type Messages = {
    Auth: AuthMessages;
};