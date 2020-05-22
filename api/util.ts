export function dateFormat(d:Date){
    const year = d.getFullYear();
    const month = d.getMonth()+1;
    const date = d.getDate();
    // const hour = d.getHours();
    // const minute = d.getMinutes();
    // const second = d.getSeconds();
    return `${year}-${month}-${date}`
}