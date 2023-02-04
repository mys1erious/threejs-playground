import React from "react";
import {usePlane} from "@react-three/cannon";


const Plane = (props: any) => {
    const [planeRef]: any = usePlane(() => ({
        rotation: [-Math.PI / 2, 0, 0],
        ...props
    }));

    return (
        <mesh ref={planeRef}
            castShadow={false}
            receiveShadow={true}
            >
            <planeGeometry args={[1000, 1000, 10, 10]} />
            <meshStandardMaterial color="#5A5A5A"/>
        </mesh>
    );
}

export default Plane;
