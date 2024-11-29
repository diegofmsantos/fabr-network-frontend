import { getTimes } from "@/api/api";
import { Time } from "@/types/time";
import { ListaTimes } from "./ListaTimes";

export const Lista = async () => {

    const times: Time[] = await getTimes();

    return (
        <div className="h-screen pt-52 md:pt-[159px]">
            <div className="h-screen bg-[#ECECEC]">
                <ListaTimes times={times} />
            </div>
        </div>
    );
};
