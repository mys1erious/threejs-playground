import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {AnimationMixer, Group, LoadingManager} from "three";


// Move logic here?
// class BasicCharacterController {
//     private _input: BasicCharacterControllerInput;
//     private _stateMachine: FiniteStateMachine;
//
//     constructor() {
//         this._input = new BasicCharacterControllerInput();
//         this._stateMachine = new FiniteStateMachine(new BasicCharacterControllerProxy());
//     };
// }


class BasicCharacterControllerInput {
    _keys: {
        forward: boolean,
        backward: boolean,
        left: boolean,
        right: boolean,
        space: boolean,
        shift: boolean,
    };

    constructor() {
        this._keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            space: false,
            shift: false,
        };
        document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
    };

    _onKeyDown(event: any) {
        switch(event.keyCode) {
            case 87: // w
                this._keys.forward = true;
                console.log('forward')
                break;
            case 65: // a
                this._keys.left = true;
                break;
            case 83: // s
                this._keys.backward = true;
                break;
            case 68: // d
                this._keys.right = true;
                break;
            case 32: // space
                this._keys.space = true;
                break;
            case 16: // shift
                this._keys.shift = true;
                break;
        }
    };

    _onKeyUp(event: any) {
        switch(event.keyCode) {
            case 87: // w
                this._keys.forward = false;
                break;
            case 65: // a
                this._keys.left = false;
                break;
            case 83: // s
                this._keys.backward = false;
                break;
            case 68: // d
                this._keys.right = false;
                break;
            case 32: // space
                this._keys.space = false;
                break;
            case 16: // shift
                this._keys.shift = false;
                break;
        }
    };
}


// Do I even need this? Move to useState() ?
class FiniteStateMachine {
    _states: {};
    _currentState: any;

    constructor() {
        this._states = {};
        this._currentState = null;
    };

    _addState(name: string, type: any) {
        // @ts-ignore
        this._states[name] = type;
    }

    setState(name: string) {
        const prevState = this._currentState;
        if (prevState) {
            // @ts-ignore
            if (prevState.name == name) return;
            // @ts-ignore
            prevState.exit();
        }

        // @ts-ignore
        const state = new this._states[name](this);

        this._currentState = state;
        state.enter(prevState);
    }

    update(timeElapsed: number, input: BasicCharacterControllerInput) {
        if (this._currentState)
            this._currentState.update(timeElapsed, input);
    };
}


class CharacterFSM extends FiniteStateMachine {
    _animations: any;

    constructor(animations: any) {
        super();
        this._animations = animations;
        this._addState('idle', IdleState);
        this._addState('walk', WalkState);
        this._addState('run', RunState);
        // this._addState('dance', DanceState);
    }
}


class State {
    _parent: any;

    constructor(parent: any) {
        this._parent = parent;
    }

    Enter() {}
    Exit() {}
    Update() {}
}


class IdleState extends State {
    constructor(parent: any) {
        super(parent);
    };

    get name() {return 'idle';}

    enter(prevState: any) {
        const idleAction = this._parent._animations['idle'].action;

        if (prevState) {
            const prevAction = this._parent._animations[prevState.name].action;
            idleAction.time = 0.0;
            idleAction.enabled = true;
            idleAction.setEffectiveTimeScale(1.0);
            idleAction.setEffectiveWeight(1.0);
            idleAction.crossFadeFrom(prevAction, 0.5, true);
            idleAction.play();
        } else {
            idleAction.play();
        }
    };

    exit() {};

    update(_: any, input: any) {
        if (input._keys.forward || input._keys.backward) {
            this._parent.setState('walk');
        }
        else if (input._keys.space) {
            this._parent.setState('dance');
        }
    };
}


class WalkState extends State {
    constructor(parent: any) {
        super(parent);
    }

    get name() {
        return 'walk';
    }

    enter(prevState: any) {
        const curAction = this._parent._animations['walk'].action;
        if (prevState) {
            const prevAction = this._parent._animations[prevState.name].action;

            curAction.enabled = true;

            if (prevState.name == 'run') {
                const ratio = curAction.getClip().duration / prevAction.getClip().duration;
                curAction.time = prevAction.time * ratio;
            } else {
                curAction.time = 0.0;
                curAction.setEffectiveTimeScale(1.0);
                curAction.setEffectiveWeight(1.0);
            }

            curAction.crossFadeFrom(prevAction, 0.5, true);
            curAction.play();
        } else {
            curAction.play();
        }
    }

    exit() {
    }

    update(timeElapsed: number, input: any) {
        if (input._keys.forward || input._keys.backward) {
            if (input._keys.shift) {
                this._parent.setState('run');
            }
            return;
        }

        this._parent.setState('idle');
    }
}


class RunState extends State {
    constructor(parent: any) {
        super(parent);
    }

    get name() {
        return 'run';
    }

    enter(prevState: any) {
        const curAction = this._parent._animations['run'].action;
        if (prevState) {
            const prevAction = this._parent._animations[prevState.name].action;

            curAction.enabled = true;

            if (prevState.name == 'walk') {
                const ratio = curAction.getClip().duration / prevAction.getClip().duration;
                curAction.time = prevAction.time * ratio;
            } else {
                curAction.time = 0.0;
                curAction.setEffectiveTimeScale(1.0);
                curAction.setEffectiveWeight(1.0);
            }

            curAction.crossFadeFrom(prevAction, 0.5, true);
            curAction.play();
        } else {
            curAction.play();
        }
    }

    exit() {
    }

    update(timeElapsed: number, input: any) {
        if (input._keys.forward || input._keys.backward) {
            if (!input._keys.shift) {
                this._parent.setState('walk');
            }
            return;
        }

        this._parent.setState('idle');
    }
}


export {
    BasicCharacterControllerInput,
    CharacterFSM
};
