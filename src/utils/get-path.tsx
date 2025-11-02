export function getPath(name: string, basePath: string = ""): string {
    return `${basePath}/${name.toLowerCase().replace(/\s+/g, "-")}`;
}