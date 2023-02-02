import React from "react";
import {useLoader} from "@react-three/fiber";
import {TextureLoader} from "three";


type BoxProps = {
    position?: [x:number, y:number, z:number],
    scale?: [x:number, y:number, z:number],
};


const Box = (props: BoxProps) => {
    const texture = useLoader(TextureLoader, 'images/brick_wall_texture.jpg');


    return (
        <mesh {...props}
              castShadow={true}
              receiveShadow={true}
        >
            <boxGeometry args={[2, 2, 2]}/>
            <meshPhysicalMaterial map={texture} color="#808080"/>
        </mesh>
    );
}

export default Box;
