import React from "react";
import {extend, useThree} from "@react-three/fiber";
// @ts-ignore
import {OrbitControls as BaseOrbitControls} from "three/examples/jsm/controls/OrbitControls";


extend({BaseOrbitControls});


const OrbitControls = () => {
    const {camera, gl} = useThree();
    return (
        // @ts-ignore
        <baseOrbitControls
            attach="orbitControls"
            args={[camera, gl.domElement]}
            target={[0, 20, 0]}
        />);
}


export default OrbitControls;
