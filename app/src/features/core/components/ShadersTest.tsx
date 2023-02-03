import React, {useRef} from 'react';
import {SphereGeometry, Vector3} from "three";
import {useFrame} from "@react-three/fiber";


const _VS = `
varying vec3 v_Normal;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    v_Normal = normal;
}`;

const _FS = `
uniform vec3 sphereColour;

varying vec3 v_Normal;

void main() {
    // gl_FragColor = vec4(v_Normal, 1.0);
    gl_FragColor = vec4(sphereColour, 1.0);
}`;


const ShadersTest = () => {
    const sphere2ShaderRef: any = useRef();

    let totalTime = 0.0;
    useFrame((state, delta) => {
        totalTime += delta;
        const v = Math.sin(totalTime * 2.0) * 0.5 + 0.5;
        const c1 = new Vector3(1, 0, 0);
        const c2 = new Vector3(0, 1, 0);
        const sphereColour = c1.lerp(c2, v);

        sphere2ShaderRef.current.uniforms.sphereColour.value = sphereColour;
    });

    return (
        <group>
            <mesh position={[-10, 5, 0]} castShadow={true} receiveShadow={true}>
                <sphereGeometry args={[2, 32, 32]}/>
                <meshStandardMaterial color="#FFFFFF"/>
            </mesh>
            <mesh position={[10, 5, 0]} castShadow={true} receiveShadow={true}>
                <sphereGeometry args={[2, 32, 32]}/>
                {/*<meshStandardMaterial color="#FFFFFF"/>*/}
                <shaderMaterial ref={sphere2ShaderRef}
                    uniforms={{
                        sphereColour: {value: new Vector3(0, 0, 1)}
                    }}
                    vertexShader={_VS}
                    fragmentShader={_FS}
                />
            </mesh>
        </group>

    );
};


export default ShadersTest;
