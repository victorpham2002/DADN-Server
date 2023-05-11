const triggerArrayToRegex = (arr : string[]): RegExp => {
    return new RegExp(`^(${arr.join('|')})$`);
}

export {triggerArrayToRegex}