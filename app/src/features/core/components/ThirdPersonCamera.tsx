import {useFrame, useThree} from "@react-three/fiber";
import {Vector3} from "three";


// type propsType = {
//
// };



const ThirdPersonCamera = (props: any) => {
    const {camera} = useThree();

    const currentPosition = new Vector3();
    const currentLookAt = new Vector3();

    useFrame((state, delta) => {
        update(delta);
    });

    const update = (timeElapsed: number) => {
        const idealOffset = _calculateIdealOffset();
        const idealLookAt = _calculateIdealLookAt();

        // const t = 0.4;
        // const t = 4.0 * timeElapsed;
        // For same camera movement on different fps
        const t = 1.0 - Math.pow(0.001, timeElapsed);

        currentPosition.lerp(idealOffset, t);
        currentLookAt.lerp(idealLookAt, t);

        camera.position.copy(currentPosition);
        camera.lookAt(currentLookAt);
    };

    const _calculateIdealOffset = () => {
        const idealOffset = new Vector3(-15, 20, -30);
        idealOffset.applyQuaternion(props.target.quaternion);
        idealOffset.add(props.target.position);
        return idealOffset;
    };

    const _calculateIdealLookAt = () => {
        const idealLookAt = new Vector3(0, 10, 50);
        idealLookAt.applyQuaternion(props.target.quaternion);
        idealLookAt.add(props.target.position);
        return idealLookAt;
    };

    return null;
};


export default ThirdPersonCamera;
