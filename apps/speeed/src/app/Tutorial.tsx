import Image from "next/image";

export default function Tutorial() {
  return (
    <section id="tutorial" className="w-full bg-gray-900 bg-opacity-90 backdrop-blur-lg">
      <h2 className="font-header w-full text-center pt-12 text-4xl bg-gradient-to-b from-white from-70% to-transparent text-transparent bg-clip-text">
        STEER YOUR SHIP
      </h2>
      <p className="text-gray-300 text-center md:w-[24rem] mx-auto mt-4">
        Use your device&apos;s gyroscope to dodge obstacles, shoot down enemies, and navigate through the endless, unforgiving space facility!
      </p>
      <div className="flex flex-col xl:flex-row xl:justify-center xl:gap-16 2xl:gap-[12rem] items-center">
        <Image
          src={"/images/Tutorial1.webp"}
          width={400}
          height={400}
          alt="SPEEED Tutorial"
          className="my-[-4rem]"
          unoptimized
        />
        <Image
          src={"/images/Tutorial2.webp"}
          width={400}
          height={400}
          alt="SPEEED Tutorial"
          className="my-[-1rem]"
          unoptimized
        />
      </div>
    </section>
  );
}
