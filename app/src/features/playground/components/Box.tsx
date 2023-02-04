import React, {useRef} from "react";
import {useLoader} from "@react-three/fiber";
import {BoxGeometry, TextureLoader} from "three";
import {useBox} from "@react-three/cannon";


type BoxProps = {
    position?: [x:number, y:number, z:number],
    scale?: [x:number, y:number, z:number],
    color?: string,
    onClick?: () => void
};


// const Box = ({position, scale, onClick, color='#808080'}: BoxProps) => {
const Box = (props: any) => {
    const [boxRef]: any = useBox(() => ({
        args: props.args,
        mass: 1,
        position: props.position,
    }));

    const texture = useLoader(TextureLoader, 'images/brick_wall_texture.jpg');
    return (
        <mesh ref={boxRef}>
            <boxGeometry args={props.args}/>
            <meshPhysicalMaterial map={texture} color={props.color}/>
        </mesh>
    );
}

export default Box;
