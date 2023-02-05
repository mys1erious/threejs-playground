import React from "react";
import {useFrame, useThree} from "@react-three/fiber";
import {Quaternion, Vector3} from "three";
import {clamp} from "@/features/core/utils/utils";
import {KEYS} from "eslint-visitor-keys";


class InputController {
    current_: {
        mouseX: number;
        leftButton: boolean;
        mouseY: number;
        rightButton: boolean;
        mouseXDelta: number;
        mouseYDelta: number;
    };
    previous_: {
        mouseX: number;
        leftButton: boolean;
        mouseY: number;
        rightButton: boolean;
        mouseXDelta: number;
        mouseYDelta: number;
    } | null;
    keys_: {};
    previousKeys_: {};

    constructor() {
        this.current_ = {
            leftButton: false,
            rightButton: false,
            mouseX: 0,
            mouseY: 0,
            mouseXDelta: 0,
            mouseYDelta: 0,
        };
        this.previous_ = null;
        this.keys_ = {};
        this.previousKeys_ = {};

        this.initialize_();
    };

    initialize_() {
        document.addEventListener('mousedown', (e) => this.onMouseDown_(e),false);
        document.addEventListener('mouseup', (e) => this.onMouseUp_(e),false);
        document.addEventListener('mousemove', (e) => this.onMouseMove_(e),false);
        document.addEventListener('keydown', (e) => this.onKeyDown_(e),false);
        document.addEventListener('keyup', (e) => this.onKeyUp_(e),false);
    };

    private onMouseMove_(e: MouseEvent) {
        this.current_.mouseX = e.pageX - window.innerWidth / 2;
        this.current_.mouseY = e.pageY - window.innerHeight / 2;

        if (this.previous_ === null)
            this.previous_ = {...this.current_};

        this.current_.mouseXDelta = this.current_.mouseX - this.previous_.mouseX;
        this.current_.mouseYDelta = this.current_.mouseY - this.previous_.mouseY;
    };

    private onMouseDown_(e: MouseEvent) {
        this.onMouseMove_(e);

        switch(e.button) {
            case 0: {
                this.current_.leftButton = true;
                break;
            }
            case 2: {
                this.current_.rightButton = true;
                break;
            }
        }
    };

    private onMouseUp_(e: MouseEvent) {
        this.onMouseMove_(e);

        switch(e.button) {
            case 0: {
                this.current_.leftButton = false;
                break;
            }
            case 2: {
                this.current_.rightButton = false;
                break;
            }
        }
    };

    private onKeyDown_(e: KeyboardEvent) {
        // @ts-ignore
        this.keys_[e.key] = true;
    };

    private onKeyUp_(e: KeyboardEvent) {
        // @ts-ignore
        this.keys_[e.key] = false;
    };

    update(timeElapsed: number) {
        if (this.previous_ !== null) {
            this.current_.mouseXDelta = this.current_.mouseX - this.previous_.mouseX;
            this.current_.mouseYDelta = this.current_.mouseY - this.previous_.mouseY;

            this.previous_ = {...this.current_};
        }
    };

    key(key: any) {
        // @ts-ignore
        return !!this.keys_[key];
    };
}



const FirstPersonCamera = () => {
    const {camera} = useThree();
    const input = new InputController();

    const rotation = new Quaternion();
    const translation = new Vector3();

    let phi = 0;
    const phiSpeed = 8;
    let theta = 0;
    const thetaSpeed = 5;
    let headBobActive = false;
    let headBobTimer = 0;

    useFrame((state, delta) => {
        update(delta);
    });

    const update = (timeElapsed: number) => {
        updateRotation(timeElapsed);
        updateCamera(timeElapsed);
        updateTranslation(timeElapsed);
        updateHeadBob(timeElapsed);
        input.update(timeElapsed);
    };

    const updateRotation = (timeElapsed: number) => {
        const xh = input.current_.mouseXDelta / window.innerWidth;
        const yh = input.current_.mouseYDelta / window.innerHeight;

        phi += -xh * 5;
        theta = clamp(theta + -yh * 5, -Math.PI / 3, Math.PI / 3);

        const qx = new Quaternion();
        qx.setFromAxisAngle(new Vector3(0, 1, 0), phi);
        const qz = new Quaternion();
        qz.setFromAxisAngle(new Vector3(1, 0, 0), theta);

        const q = new Quaternion();
        q.multiply(qx);
        q.multiply(qz);

        rotation.copy(q);
    };

    const updateCamera = (_: number) => {
        camera.quaternion.copy(rotation);
        camera.position.copy(translation);
        camera.position.y += Math.sin(headBobTimer * 10) * 0.5;
    };

    const updateTranslation = (timeElapsed: number) => {
        const forwardVelocity = (input.key('w') ? 1 : 0) + (input.key('s') ? -1 : 0);
        const strafeVelocity = (input.key('a') ? 1 : 0) + (input.key('d') ? -1 : 0);

        const qx = new Quaternion();
        qx.setFromAxisAngle(new Vector3(0, 1, 0), phi);

        const forward = new Vector3(0, 0, -1);
        forward.applyQuaternion(qx);
        forward.multiplyScalar(forwardVelocity * timeElapsed * 10);

        const left = new Vector3(-1, 0, 0);
        left.applyQuaternion(qx);
        left.multiplyScalar(strafeVelocity * timeElapsed * 10);

        translation.add(forward);
        translation.add(left);

        if (forwardVelocity != 0 || strafeVelocity != 0) {
            headBobActive = true;
        }
    };

    const updateHeadBob = (timeElapsed: number) => {
        if (headBobActive) {
            const waveLength = Math.PI;
            const nextStep = 1 + Math.floor(((headBobTimer + 0.000001) * 10) / waveLength);
            const nextStepTime = nextStep * waveLength / 10;

            headBobTimer = Math.min(headBobTimer + timeElapsed, nextStepTime);
            if (headBobTimer == nextStepTime)
                headBobActive = false;
        }
    };

    return null;
};


export default FirstPersonCamera;
