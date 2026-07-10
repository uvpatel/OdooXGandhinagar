import AnimatedTestimonialsDemo from "@/components/animated-testimonials-demo";
import MacbookScrollDemo from "@/components/macbook-scroll-demo";
import ParallaxHeroImagesDemo from "@/components/parallax-hero-images-demo";
import TerminalDemo from "@/components/terminal-demo";
import { UserButton } from "@/components/user-button";
import Image from "next/image";

export default function Home() {
  return (
   <div>
  <header className="flex justify-end p-6">
        <UserButton />
      
      </header>
<ParallaxHeroImagesDemo />
<TerminalDemo />
<MacbookScrollDemo />
<AnimatedTestimonialsDemo />
</div>
  );
}
