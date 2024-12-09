import Particles from "@/components/ui/particles";


export function Header() {
  return (
    <header className="w-full">
      <Particles quantity={100} ease={80} size={1} className="absolute inset-0 h-[20%]" refresh color="#be5eed"/>
      <div className='relative h-[10px] bg-[linear-gradient(141deg,_cyan_0%,_rebeccapurple_40%,_deeppink_90%)]'></div>
        <div className=" text-center py-8">
          <h2 className="text-6xl font-bold mb-2 text-primary">TeachMagic</h2>
          <p className="text-xl text-muted-foreground mb-4">
            Ready to create more amazing learning content?
          </p>
        </div>
    </header>
  );
}
