const Hero = () => {
  return (
    <div className="relative h-[400px] overflow-hidden">
      <img 
        src="https://cdn.poehali.dev/projects/217c2f70-09cd-495d-a8ae-cf13ac048e82/files/e9cd3de7-f32e-43ae-9bf7-18c6acb40946.jpg"
        alt="Cinema"
        className="w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-bold text-secondary">Кинорецензии</h2>
          <p className="text-xl text-muted-foreground">Делитесь своим мнением о фильмах</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
