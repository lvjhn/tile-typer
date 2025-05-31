export function average(items) {
    let total = 0; 
    for(let item of items) {
        total +=  item
    }
    return total / (items.length == 0 ? 1 : items.length)
}