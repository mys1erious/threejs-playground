import React, {useEffect, useRef} from "react";
import {useFBX, useAnimations} from "@react-three/drei";
import {useFrame, useThree} from "@react-three/fiber";
import {Quaternion, Vector3} from "three";
import {
    BasicCharacterControllerInput,
    CharacterFSM
} from "@/features/core/components/BasicCharacterController";
import ThirdPersonCamera from "@/features/core/components/ThirdPersonCamera";


const DIR_PATH = 'models/zombie/';
const MODEL_PATH = DIR_PATH + 'mremireh_o_desbiens.fbx';
const IDLE_ANIM_PATH = DIR_PATH + 'idle.fbx';
const WALK_ANIM_PATH = DIR_PATH + 'walk.fbx';
const RUN_ANIM_PATH = DIR_PATH + 'run.fbx';
const DANCE_ANIM_PATH = DIR_PATH + 'dance.fbx';
const HIPHOP_ANIM_PATH = DIR_PATH + 'hiphop.fbx';


// Rework to look normally ;d
export default function ZombieModel() {
    const {camera} = useThree();
    const groupRef = useRef();
    const model = useFBX(MODEL_PATH);

    const idleAnimation = useFBX(IDLE_ANIM_PATH);
    idleAnimation.animations[0].name = 'idle';
    const walkAnimation = useFBX(WALK_ANIM_PATH);
    walkAnimation.animations[0].name = 'walk';
    const runAnimation = useFBX(RUN_ANIM_PATH);
    runAnimation.animations[0].name = 'run';
    // const danceAnimation = useFBX(DANCE_ANIM_PATH);
    // danceAnimation.animations[0].name = 'dance';

    const animations = [
        idleAnimation.animations[0],
        walkAnimation.animations[0],
        runAnimation.animations[0],
        // danceAnimation.animations[0]
    ];
    const {actions} = useAnimations(animations, groupRef);

    const fsm = new CharacterFSM({});
    const input = new BasicCharacterControllerInput();

    const _decceleration = new Vector3(-0.0005, -0.0001, -5.0);
    const _acceleration = new Vector3(1, 0.25, 50.0);
    const _velocity = new Vector3(0, 0, 0);

    useEffect(() => {
        fsm._animations['idle'] = {
            action: actions['idle']
        }
        fsm._animations['walk'] = {
            action: actions['walk']
        }
        fsm._animations['run'] = {
            action: actions['run']
        }

        fsm.setState('idle');
    }, []);

    const update = (timeInSeconds: any) => {
        if (!model) return;

        fsm.update(timeInSeconds, input);

        const velocity = _velocity;
        const frameDecceleration = new Vector3(
            velocity.x * _decceleration.x,
            velocity.y * _decceleration.y,
            velocity.z * _decceleration.z
        );
        frameDecceleration.multiplyScalar(timeInSeconds);
        frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
            Math.abs(frameDecceleration.z), Math.abs(velocity.z)
        );

        velocity.add(frameDecceleration);

        const controlObject = model;
        const _Q = new Quaternion();
        const _A = new Vector3();
        const _R = controlObject.quaternion.clone();

        const acc = _acceleration.clone();
        if (input._keys.shift) {
            acc.multiplyScalar(3.0);
        }

        // if (fsm._currentState.Name == 'dance') {
        //     acc.multiplyScalar(0.0);
        // }

        if (input._keys.forward) {
            velocity.z += acc.z * timeInSeconds;
        }
        if (input._keys.backward) {
            velocity.z -= acc.z * timeInSeconds;
        }
        if (input._keys.left) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * _acceleration.y);
            _R.multiply(_Q);
        }
        if (input._keys.right) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * _acceleration.y);
            _R.multiply(_Q);
        }

        controlObject.quaternion.copy(_R);

        const oldPosition = new Vector3();
        oldPosition.copy(controlObject.position);

        const forward = new Vector3(0, 0, 1);
        forward.applyQuaternion(controlObject.quaternion);
        forward.normalize();

        const sideways = new Vector3(1, 0, 0);
        sideways.applyQuaternion(controlObject.quaternion);
        sideways.normalize();

        sideways.multiplyScalar(velocity.x * timeInSeconds);
        forward.multiplyScalar(velocity.z * timeInSeconds);

        controlObject.position.add(forward);
        controlObject.position.add(sideways);

        oldPosition.copy(controlObject.position);
    }

    useFrame((state, delta) => {
        // fsm.update(delta, input);
        update(delta);
    })

    if (!model) return <mesh></mesh>

    return (
        <group>
            <primitive ref={groupRef} object={model}
                       scale={[0.1, 0.1, 0.1]}
                // onClick={onClick}
            />
            <ThirdPersonCamera camera={camera} target={model}/>
        </group>
    );

};


useFBX.preload(MODEL_PATH);
