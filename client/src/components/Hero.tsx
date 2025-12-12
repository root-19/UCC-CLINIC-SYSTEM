import type { HeroProps } from '../types';
import bgClinic from '../assets/images/bg-clinic.png';

const Hero = ({
  backgroundImage = bgClinic,
  title,
}: HeroProps) => {
  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden mt-20 min-h-[calc(100vh-80px)]">
      <div 
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/40 via-white/30 to-white/40 backdrop-blur-[2px]" />
      <div className="relative z-10 text-center px-4 md:px-8 py-8 max-w-[1200px] mx-auto">
        <div className="flex flex-col gap-3">
          <span 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-normal text-clinic-orange font-serif italic leading-tight drop-shadow-lg animate-fade-in-up animate-delay-200"
          >
            Project Care
          </span>
          <span 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4rem] font-bold text-clinic-green leading-tight drop-shadow-lg animate-fade-in-up animate-delay-400"
          >
            {title}
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;

