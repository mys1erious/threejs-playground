import React from "react";
import {CubeTextureLoader} from "three";
import {useThree} from "@react-three/fiber";


const SceneBackground = () => {
    const { gl, scene } = useThree();

    const loader = new CubeTextureLoader();
    const texture = loader.load([
        'images/skybox_texture/posx.jpg',
        'images/skybox_texture/negx.jpg',
        'images/skybox_texture/posy.jpg',
        'images/skybox_texture/negy.jpg',
        'images/skybox_texture/posz.jpg',
        'images/skybox_texture/negz.jpg'
    ]);

    scene.background = texture;
    return null;
}

export default SceneBackground;
