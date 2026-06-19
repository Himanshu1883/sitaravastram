interface SectionHeadingProps {
  overline?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}

export default function SectionHeading({ overline, title, subtitle, center = false, light = false }: SectionHeadingProps) {
  return (
    <div className={`mb-10 ${center ? 'text-center' : ''}`}>
      {overline && (
        <p className={`font-inter text-xs tracking-[0.25em] uppercase font-semibold mb-3 ${light ? 'text-rosegold-300' : 'text-rosegold-500'}`}>
          {overline}
        </p>
      )}
      <h2 className={`font-playfair text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight ${light ? 'text-white' : 'text-navy-700'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`font-inter text-base mt-4 max-w-xl leading-relaxed ${light ? 'text-white/70' : 'text-gray-500'} ${center ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
      <div className={`flex items-center gap-3 mt-5 ${center ? 'justify-center' : ''}`}>
        <div className={`h-px w-12 ${light ? 'bg-rosegold-400' : 'bg-rosegold-500'}`} />
        <div className={`w-2 h-2 rotate-45 ${light ? 'bg-rosegold-400' : 'bg-rosegold-500'}`} />
        <div className={`h-px w-12 ${light ? 'bg-rosegold-400' : 'bg-rosegold-500'}`} />
      </div>
    </div>
  );
}
