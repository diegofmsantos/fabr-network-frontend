import Image from "next/image";
import Link from "next/link";

export const SemJogador = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white p-3 rounded-lg shadow-sm">
      <div className="flex flex-col gap-2 items-center">
        <Image
          src="/assets/image.png"
          alt="Aviso"
          width={100}
          height={100}
          className="mb-4"
        />
        <h2 className="text-md font-bold text-center bg-yellow-300 p-2 rounded-xl">JOGADORES INDISPONÍVEIS</h2>
        <p className="text-center text-gray-600 font-bold">
          Se você é atleta deste time,<span className="font-normal"> não seja ejetado da nossa plataforma.</span>
        </p>
        <p className="text-center text-gray-600">
          <span className="font-bold">Fale conosco</span> para realizarmos a sua <span className="font-bold">coleta de dados</span> e tenha a sua falta declinada.
        </p>
        <Link
          href="https://wa.me/+5581998725448"
          target="_blank"
          className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-full mt-4 hover:bg-green-600 transition-colors"
        >
          WhatsApp
          <Image src={`/assets/whatsapp.png`} alt="logo whatsapp" width={20} height={20} quality={100} priority />
        </Link>
      </div>
    </div>
  );
};