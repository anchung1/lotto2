export function EntryObj(entryArr) {

    var obj = {b1: '', b2: '', b3: '', b4: '', b5: '', pb: ''};
    if (!entryArr) return obj;

    let i = 0;
    for (let key in obj) {
        obj[key] = entryArr[i++];
    }

    return obj;
}

