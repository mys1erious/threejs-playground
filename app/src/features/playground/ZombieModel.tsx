import React, {useEffect, useRef} from "react";
import {useFBX, useAnimations} from "@react-three/drei";


const DIR_PATH = 'models/zombie/';
const MODEL_PATH = DIR_PATH + 'mremireh_o_desbiens.fbx';
const DANCE_ANIM_PATH = DIR_PATH + 'dance.fbx';


export default function ZombieModel() {
    const groupRef = useRef();
    const fbx = useFBX(MODEL_PATH);
    const danceAnimation = useFBX(DANCE_ANIM_PATH);

    const {actions} = useAnimations(danceAnimation.animations, groupRef);
    useEffect(() => {
        actions['mixamo.com']?.play();
    });

    return <primitive scale={[0.1, 0.1, 0.1]} ref={groupRef} object={fbx}/>;
};


useFBX.preload(MODEL_PATH);
