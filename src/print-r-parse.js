function parseArray(fragment, offset = 0) {
    if(typeof fragment !== "string") {
        throw new TypeError('fragment expected to be a string, got: ' + typeof fragment + ' ' + String(fragment))
    }
    const lines = fragment.split('\n');
    const data = {};
    let i = offset
    let xOffset;
    for (; i < lines.length; i++) {
        const currentLine = lines[i];
        const entryMatch = currentLine.match(/^(\s*)\(/);
        if(entryMatch && lines[i - 1].match(/Array/)) {
            if(xOffset !== undefined) {
                throw new Error()
            }
            xOffset = entryMatch[1].length;
            continue;
        }
        const finalMatch = currentLine.match(/^(\s*)\)/);
        if(finalMatch && finalMatch[1].length === xOffset) {
            return {
                data,
                lines: i,
            }
        }
        if(xOffset === undefined) {
            continue;
        }
        const match = currentLine.match(/\[(\S+)\]\s*=>\s*(\S+)/);
        if(match) {
            const key = match[1];
            const value = match[2];
            if(value.match(/Array/)) {
                const parsed = parseArray(fragment, i);
                if(!parsed) {
                    console.log(fragment.splice(i, 100))
                }
                i = parsed.lines;
                data[key] = parsed.data
            } else {
                data[key] = value;
            }
        }
    }
}

exports.parse = text => parseArray(text).data
