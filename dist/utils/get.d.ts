type PathStep = string | number | {
    flatten: boolean;
    map?: (string | number)[];
};
export default function get(obj: unknown, pathArray: PathStep[]): unknown;
export {};
//# sourceMappingURL=get.d.ts.map