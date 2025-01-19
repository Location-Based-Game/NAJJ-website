export default function Noise() {
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute h-full w-full mix-blend-multiply pointer-events-none"
      >
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.6"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>

        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    )
}