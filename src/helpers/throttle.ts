function throttle<T extends (...args: any[]) => any>(func: T, delay: number = 2000){
    let throttling = false;
    return (...args: Parameters<T>) => {
        if(!throttling){
            throttling = true;
            Promise.resolve(func(...args)).then(() => {setTimeout(() => {throttling = false}, delay)}).catch(() => {setTimeout(() => {throttling = false}, delay)});
        }
    }
}


export default throttle;