
import BackgroundLinesDemo from "@/components/background-lines-demo";
import NoiseBackgroundDemo from "@/components/noise-background-demo";

import { UserButton } from "@/components/user-button";


export default function Home() {
  return (
   <div>
  <header className="flex justify-end p-6">
        <UserButton />
      
      </header>
<BackgroundLinesDemo />

</div>
  );
}
