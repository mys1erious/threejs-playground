import React from "react";
import {useLoader} from "@react-three/fiber";
import {TextureLoader} from "three";


type BoxProps = {
    position?: [x:number, y:number, z:number],
    scale?: [x:number, y:number, z:number],
    color?: string,
    onClick?: () => void
};


const Box = ({position, scale, onClick, color='#808080'}: BoxProps) => {
    const texture = useLoader(TextureLoader, 'images/brick_wall_texture.jpg');


    return (
        <mesh position={position}
              scale={scale}
              castShadow={true}
              receiveShadow={true}
              onClick={onClick}
        >
            <boxGeometry args={[2, 2, 2]}/>
            <meshPhysicalMaterial map={texture} color={color}/>
        </mesh>
    );
}

export default Box;
