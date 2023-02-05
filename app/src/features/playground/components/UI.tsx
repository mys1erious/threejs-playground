import Image from 'next/image';


const UI = () => {
    return (
        <>
            {/*<div className="z-50 absolute top-3 left-20 w-16 h-7 bg-amber-400 border-2 border-black rounded-lg text-center">*/}
            {/*    <button>Info</button>*/}
            {/*</div>*/}
            <div className="z-50 absolute top-1/2 left-1/2 crosshair-translate3d select-none">
                <Image src="/images/crosshair.png" alt="crosshair" width={64} height={64}/>
            </div>
        </>
    );
};


export default UI;
