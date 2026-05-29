import SmoothScroll from './components/layout/SmoothScroll'
import ScrollProgress from './components/ui/ScrollProgress'
import Cursor from './components/ui/Cursor'
import Cover from './components/sections/Cover'
import ExecutiveSummary from './components/sections/ExecutiveSummary'
import Understanding from './components/sections/Understanding'
import Vision from './components/sections/Vision'
import Capabilities from './components/sections/Capabilities'
import Methodology from './components/sections/Methodology'
import Support247 from './components/sections/Support247'
import Investment from './components/sections/Investment'
import WhyLPS from './components/sections/WhyLPS'
import NextSteps from './components/sections/NextSteps'
import Footer from './components/sections/Footer'

export default function App() {
  return (
    <SmoothScroll>
      <ScrollProgress />
      <Cursor />
      <main className="relative min-h-screen bg-ink-deep text-paper">
        <Cover />
        <ExecutiveSummary />
        <Understanding />
        <Vision />
        <Capabilities />
        <Methodology />
        <Support247 />
        <Investment />
        <WhyLPS />
        <NextSteps />
        <Footer />
      </main>
    </SmoothScroll>
  )
}
