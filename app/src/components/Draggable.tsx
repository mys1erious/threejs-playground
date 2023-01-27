import React, {useEffect, useRef, useState} from "react";
import {extend, useThree} from "@react-three/fiber";
import {DragControls} from "three/examples/jsm/controls/DragControls";


extend({DragControls});


const Draggable = (props: any) => {
    const groupRef: any = useRef();
    const controlsRef: any = useRef();
    const [objects, setObjects] = useState();
    const {camera, gl, scene} = useThree();

    useEffect(() => {
        setObjects(groupRef.current.children);
    }, [groupRef]);

    useEffect(() => {
        controlsRef.current.addEventListener('hoveron', () => {
            // @ts-ignore
            scene.orbitControls.enabled = false;
        });
        controlsRef.current.addEventListener('hoveroff', () => {
            // @ts-ignore
            scene.orbitControls.enabled = true;
        });
    }, [objects]);

    return (
        <group ref={groupRef}>
             {/*@ts-ignore*/}
            <dragControls ref={controlsRef} args={[objects, camera, gl.domElement]}/>
            {props.children}
        </group>
    )
};


export default Draggable;
