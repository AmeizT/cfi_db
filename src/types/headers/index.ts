export interface HeadersConfigProps {
    method?: string,
    headers?: {
        Accept?: string,
        "Content-Type"?: string,
        Authorization?: string,
    }
}