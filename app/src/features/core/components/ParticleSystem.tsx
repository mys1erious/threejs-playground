import React, {useRef} from "react";
import {
    AddEquation,
    BufferGeometry, Color, CustomBlending,
    Float32BufferAttribute, OneFactor, OneMinusSrcAlphaFactor,
    ShaderMaterial,
    TextureLoader,
    Vector3
} from "three";
import {useFrame, useThree} from "@react-three/fiber";


// Finish shaders to combine Additive and Alpha blending
// Vertex Shader
const _VS = `
uniform float pointMultiplier;

attribute float size;
attribute float angle;
attribute float blend;
attribute vec4 colour;

varying vec4 vColour;
varying vec2 vAngle;
varying float vBlend;


void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = size * pointMultiplier / gl_Position.w;
       
    vAngle = vec2(cos(angle), sin(angle));
    vColour = colour;
    vBlend = blend;
}`;

// Fragment Shader
const _FS = `
uniform sampler2D diffuseTexture;

varying vec4 vColour;
varying vec2 vAngle;
varying float vBlend;

void main() {
    vec2 coords = (gl_PointCoord - 0.5) * mat2(vAngle.x, vAngle.y, -vAngle.y, vAngle.x) + 0.5;
    gl_FragColor = texture2D(diffuseTexture, coords) * vColour;
    //gl_FragColor.xyz *= gl_FragColor.w;
    //gl_FragColor.w *= vBlend;
}`;


class LinearSpline {
    private _points: any[];
    private _lerp: any;

    constructor(lerp: any) {
        this._points = [];
        this._lerp = lerp;
    };

    AddPoint(t: any, d: any) {
        this._points.push([t, d]);
    };

    Get(t: any) {
        let p1 = 0;
        for (let i = 0; i < this._points.length; i++){
            if (this._points[i][0] >= t)
                break;
            p1 = i;
        }

        const p2 = Math.min(this._points.length-1, p1+1);
        if (p1 == p2)
            return this._points[p1][1];

        return this._lerp(
            (t - this._points[p1][0]) / (this._points[p2][0] - this._points[p1][0]),
            this._points[p1][1], this._points[p2][1]
        );
    };
}


type Particle = {
    position: Vector3,
    size: number,
    currentSize: number,
    colour: Color,
    alpha: number,
    life: number,
    rotation: number,
    velocity: Vector3,
    blend: number
};


// Make ParticleSystem a logic class
// Make Particle component
// Make Particles component
const ParticleSystem = () => {
    const {camera} = useThree();
    const pointsRef: any = useRef();

    const uniforms = {
        diffuseTexture: {
            value: new TextureLoader().load('particles/fire.png')
        },
        pointMultiplier: {
            value: window.innerHeight / (2 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))
        }
    };

    const material = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: _VS,
        fragmentShader: _FS,
        // blending: AdditiveBlending,
        blending: CustomBlending,
        blendEquation: AddEquation,
        blendSrc: OneFactor,
        blendDst: OneMinusSrcAlphaFactor,
        depthTest: true,
        depthWrite: false,
        transparent: true,
        vertexColors: true
    });

    let particles: Particle[] = [];

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute([], 3));
    geometry.setAttribute('size', new Float32BufferAttribute([], 1));
    geometry.setAttribute('colour', new Float32BufferAttribute([], 4));
    geometry.setAttribute('angle', new Float32BufferAttribute([], 1));
    geometry.setAttribute('blend', new Float32BufferAttribute([], 1));

    const alphaSpline = new LinearSpline((t: any, a: any, b: any) => {
        return a + t * (b - a);
    });
    alphaSpline.AddPoint(0.0, 0.0);
    alphaSpline.AddPoint(0.1, 1.0);
    alphaSpline.AddPoint(0.6, 1.0);
    alphaSpline.AddPoint(1.0, 0.0);

    const colourSpline = new LinearSpline((t: any, a: any, b: any) => {
        const c = a.clone();
        return c.lerp(b, t);
    });
    colourSpline.AddPoint(0.0, new Color(0xFFFF80));
    colourSpline.AddPoint(1.0, new Color(0xFF8080));

    const sizeSpline = new LinearSpline((t: any, a: any, b: any) => {
        return a + t * (b - a);
    });
    sizeSpline.AddPoint(0.0, 1.0);
    sizeSpline.AddPoint(0.5, 5.0);
    sizeSpline.AddPoint(1.0, 1.0);

    let gdfsghk = 0.0;
    const _addParticles = (timeElapsed: number) => {
        gdfsghk += timeElapsed;
        const n = Math.floor(gdfsghk * 75.0);
        gdfsghk -= n / 75.0;

        for (let i = 0; i < n; i++) {
            particles.push({
                position: new Vector3(
                    (Math.random() * 2 - 1) * 2.0,
                    (Math.random() * 2 - 1) * 2.0,
                    (Math.random() * 2 - 1) * 2.0),
                size: Math.random() * 2.0,
                currentSize: 0,
                colour: new Color(),
                alpha: 1.0,
                life: 5.0,
                rotation: Math.random() * 2.0 * Math.PI,
                velocity: new Vector3(0, -15, 0),
                blend: 0.0
            });
        }
        // particles.push({
        //     position: new Vector3(
        //         0.3,
        //         0.1,
        //         0.3)
        // });
        // particles.push({
        //     position: new Vector3(
        //         2,
        //         0.1,
        //         0.3)
        // });
    };

    const _updateGeometry = () => {
        const positions = [];
        const sizes = [];
        const colours = [];
        const angles = [];
        const blends = [];

        for (let p of particles) {
            positions.push(p.position.x, p.position.y, p.position.z);
            sizes.push(p.currentSize);
            colours.push(p.colour.r, p.colour.g, p.colour.b, p.alpha);
            angles.push(p.rotation);
            blends.push(p.blend);
        }

        geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
        geometry.setAttribute('size', new Float32BufferAttribute(sizes, 1));
        geometry.setAttribute('colour', new Float32BufferAttribute(colours, 4));
        geometry.setAttribute('angle', new Float32BufferAttribute(angles, 1));
        geometry.setAttribute('blend', new Float32BufferAttribute(blends, 1));

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.size.needsUpdate = true;
        geometry.attributes.colour.needsUpdate = true;
        geometry.attributes.angle.needsUpdate = true;
        geometry.attributes.blend.needsUpdate = true;
    };

    const _updateParticles = (timeElapsed: number) => {
        for (let p of particles)
            p.life -= timeElapsed;

        particles = particles.filter(p => p.life > 0.0);

        for (let p of particles) {
            const t = 1.0 - p.life / 5.0;

            p.rotation += timeElapsed * 0.5;
            p.alpha = alphaSpline.Get(t);
            p.currentSize = p.size * sizeSpline.Get(t);
            p.colour.copy(colourSpline.Get(t));

            p.position.add(p.velocity.clone().multiplyScalar(timeElapsed));

            const drag = p.velocity.clone();
            drag.multiplyScalar(timeElapsed * 0.25);
            drag.x = Math.sign(p.velocity.x) * Math.min(Math.abs(drag.x), Math.abs(p.velocity.x));
            drag.y = Math.sign(p.velocity.y) * Math.min(Math.abs(drag.y), Math.abs(p.velocity.y));
            drag.z = Math.sign(p.velocity.z) * Math.min(Math.abs(drag.z), Math.abs(p.velocity.z));
            p.velocity.sub(drag);
        }

        particles.sort((a, b) => {
            const d1 = camera.position.distanceTo(a.position);
            const d2 = camera.position.distanceTo(b.position);

            if (d1 > d2) {
                return -1;
            }
            if (d1 < d2) {
                return 1;
            }
            return 0;
        });
    };

    _addParticles(0);
    _updateGeometry();

    // let secsCounter = 0;
    useFrame((state, delta) => {
        _addParticles(delta);
        _updateParticles(delta);
        _updateGeometry();

        // secsCounter += delta;
        // if (secsCounter >= 2) {
        //     console.log(particles)
        //     secsCounter = 0;
        // }
    });

    return (
        <points ref={pointsRef} geometry={geometry} material={material}/>
    )
};


export default ParticleSystem;
