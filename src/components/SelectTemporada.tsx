
export const SelectTemporada = () => {

    return (
        <div className="w-full bg-[#ECECEC] flex flex-col justify-center items-center pt-3">
            <div className="bg-white px-3 py-1 rounded-2xl min-w-36 flex flex-col justify-center items-start">
                <div className="text-xs">Temporada</div>
                <select className="text-sm font-bold min-w-32">
                    <option value="2024" className="">2024</option>
                    <option value="2025">2025</option>
                </select>
            </div>
        </div>
    )
}
