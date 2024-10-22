    "use client";

    import { Button } from "@/components/ui/button"
    import { faAngleLeft } from "@fortawesome/free-solid-svg-icons"
    import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
    import Image from "next/image"

    export default function Page() {

        return (
            <div>
                <header className="w-full h-32 bg-[#17181C] flex flex-col justify-center items-center gap-4">
                    <div className="text-white font-bold text-2xl">FABR - Network</div>
                    <div className="flex justify-center items-center gap-4">
                        <Button label="Times">
                            <FontAwesomeIcon icon={faAngleLeft} className="w-3 h-3" />
                        </Button>
                    </div>
                </header>
                <section>
                    <div>
                        <Image src={`/assets/`} alt="logo" width={50} height={50} />
                    </div>
                </section>
            </div>
        )
    }
