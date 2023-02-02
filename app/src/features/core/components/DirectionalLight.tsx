import React from "react";


const DirectionalLight = () => {
    return (
        <group position={[150, 300,-30]}>
        <directionalLight
            color="white" intensity={1}
            target-position={[0, 0, 0]}
            castShadow={true}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
        >
            <orthographicCamera
                attach="shadow-camera"
                near={1.0} far={500}
                left={200} right={-200}
                top={200} bottom={-200}
            />
        </directionalLight>
        </group>
    )
};

export default DirectionalLight;
