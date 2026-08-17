export function cx(...args) {
    return args.flat().filter((x)=>typeof x === "string").join(" ").trim();
}

//# sourceMappingURL=cx.js.map