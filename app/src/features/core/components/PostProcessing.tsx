import React from "react";
import {Bloom, EffectComposer, Glitch} from "@react-three/postprocessing";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
import {extend} from "@react-three/fiber";


extend({ UnrealBloomPass });


// Make it work?
const PostProcessing = () => {
    // const {gl, scene, camera} = useThree()
    // const composer = new EffectComposer(gl);
    // composer.addPass(new RenderPass(scene, camera));
    // composer.addPass(new UnrealBloomPass(new Vector2(1024, 1024), 2.0, 0.0, 0.7));
    // composer.addPass(new GlitchPass());
    // useFrame(() => {
    //     composer.render();
    // });

    // Analogy to the code above
    // <EffectComposer>
    //     <Bloom luminanceThreshold={0.7} intensity={2} levels={9} />
    //     <Glitch/>
    // </EffectComposer>

    return (
        <EffectComposer>
            <Bloom luminanceThreshold={0.7} intensity={2} levels={9} />
            <Glitch/>
        </EffectComposer>
    )
};


export default PostProcessing;
