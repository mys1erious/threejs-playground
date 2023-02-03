import React from 'react';
import Box from "@/features/playground/components/Box";
import {useThree} from "@react-three/fiber";


const UI3D = () => {
    const {camera} = useThree();

    const cameraBoxOnClick = () => {
        console.log(camera.position);
    };

    return(
        <group scale={[3, 3, 3]} position={[-80, 3, 0]}>
            {/* Camera Box */}
            <Box color="#FFFF00" onClick={cameraBoxOnClick}/>
        </group>
    );
};


export default UI3D;
