let i = {
    a : {
        b: {
            c: {

            }
        }
    }
}

console.log(checkObject("a", "c"))

function checkObject(...args) {
    let ob = i;
    let ok = true;
    for (arg of args) {
        if (ob.hasOwnProperty(arg)) {
            ob = ob[arg]
        } else {
            ok = false;
            break;
        }
    }
    return ok;
}