import Image from "next/image"

export const Loading = () => {

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="w-[200px] h-[100px]">
                <Image
                    src="/assets/logo-fabr-color.png"
                    alt="Logo FABR"
                    width={200}
                    height={100}
                    quality={100}
                    className="w-auto h-auto animate-ping"
                />
            </div>
        </div>
    )
}