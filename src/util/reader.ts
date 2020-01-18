export function b64toBlob(b64:string) {

    var byteString = atob(b64);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'text' });
}

export function readBlob(b:Blob){
    const reader = new FileReader()
    return new Promise<string>((res, rej)=>{
        reader.onloadend = ()=>{
            res(reader.result as string)
        }
        reader.onerror = err=>{
            rej(err)
        }
        reader.readAsText(b,'utf8');
    })
}