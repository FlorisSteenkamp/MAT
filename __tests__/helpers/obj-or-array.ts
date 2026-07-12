
type ObjOrArray<T> = 
    | T
    | ObjOrArray<T>[]
    | { [key:string]: ObjOrArray<T> };

    
export { ObjOrArray }
