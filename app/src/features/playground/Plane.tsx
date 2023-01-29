import React from "react";


const Plane = () => {
    return (
        <mesh
            castShadow={false}
            receiveShadow={true}
            rotation-x={-Math.PI/2}
        >
            <planeGeometry args={[1000, 1000, 10, 10]}/>
            <meshStandardMaterial color="white"/>
        </mesh>
    );
}

export default Plane;
