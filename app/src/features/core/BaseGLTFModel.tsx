import React, {Suspense} from "react";
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


type baseGLTFModelProps = {
    path: string
};


const BaseGLTFModel = ({path}: baseGLTFModelProps) =>  {
  const gltf = useLoader(GLTFLoader, path);
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  );
};


export default BaseGLTFModel;
