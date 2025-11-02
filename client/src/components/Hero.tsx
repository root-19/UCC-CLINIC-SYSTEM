import type { HeroProps } from '../types';
import bgClinic from '../assets/images/bg-clinic.png';

const Hero = ({
  backgroundImage = bgClinic,
  title,
  ctaText = 'View More',
  onCtaClick
}: HeroProps) => {
  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden mt-20 min-h-[calc(100vh-80px)]">
      <div 
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute top-0 left-0 w-full h-full bg-white/30 backdrop-blur-[1px]" />
      <div className="relative z-10 text-center px-4 md:px-8 py-8 max-w-[1200px] mx-auto">
        <div className="flex flex-col gap-2 mb-8">
          <span className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-normal text-clinic-orange font-serif italic leading-tight drop-shadow-md">
            Project Care
          </span>
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4rem] font-bold text-clinic-green font-sans leading-tight drop-shadow-md">
            {title}
          </span>
        </div>
        <button 
          className="px-8 sm:px-12 py-4 text-lg sm:text-[1.1rem] font-semibold text-white bg-clinic-green border-none rounded-lg cursor-pointer font-sans transition-all duration-300 hover:bg-clinic-green-hover hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          onClick={onCtaClick}
        >
          {ctaText}
        </button>
      </div>
    </section>
  );
};

export default Hero;

