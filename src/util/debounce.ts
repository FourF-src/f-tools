const debounce = (func:Function, delay:number) => { 
    let debounceTimer:any 
    return function(...args:any[]) { 
        const context = this
            clearTimeout(debounceTimer) 
                debounceTimer 
            = setTimeout(() => func.apply(context, args), delay) 
    } 
}  
export default debounce