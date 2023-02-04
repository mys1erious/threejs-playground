export function generateBoxCoordinates(){
    const coords: [x:number, y:number, z:number][] = [];
    const rows = 40;
    const cols = 40;
    const xSpace = 2;
    const ySpace = 2;
    for (let x = -rows; x < rows; x+=xSpace) {
        for (let y = -cols; y < cols; y+=ySpace) {
            coords.push([Math.random() + x * 5, Math.random() * 4.0 + 2.0, Math.random() + y * 5]);
        }
    }
    return coords;
}
