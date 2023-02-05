import React, {useEffect, useRef, useState} from "react";
import {useLoader, useThree} from "@react-three/fiber";
import {AudioListener, AudioLoader, PositionalAudio, TextureLoader} from "three";


const Audio = () => {
    const soundRef = useRef<PositionalAudio>(null);
    const {camera} = useThree();
    const [listener] = useState(() => new AudioListener());
    const buffer = useLoader(AudioLoader, 'music/Ectoplasm.mp3');
    const texture = useLoader(TextureLoader, 'images/speaker.jpg');

    // @ts-ignore
    useEffect(() => {
        soundRef.current?.setBuffer(buffer);
        soundRef.current?.setVolume(0.5);
        soundRef.current?.setRefDistance(1);

        camera.add(listener);
        return () => camera.remove(listener);
    }, []);

    const onClick = () => {
        if (!soundRef.current?.isPlaying)
            soundRef.current?.play();
        else soundRef.current.stop();
    };

    return (
        <mesh onClick={onClick}>
            <boxGeometry />
            <meshPhysicalMaterial color="#FFFFFF" map={texture}/>
            <positionalAudio ref={soundRef} args={[listener]}/>
        </mesh>
    );
};


export default Audio;
