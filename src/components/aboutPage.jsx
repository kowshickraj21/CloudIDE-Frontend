import { BackgroundGradient } from "./aboutGradient"
import AboutImage from "../assets/homeAbout.png"

const AboutPage = () => {
  return (
    <div className="bg-[#0b191d] text-white py-10 overflow-x-hidden">
      <h2 className="m-auto text-center font-semibold text-5xl rotate-1 p-10">Your Cloud Development Platform</h2>
      <p className="w-1/3 text-center rotate-1 m-auto">We believe everyone should have the means to build ideas that can change the world. Hear the inspiring stories of software creators around the globe making a positive impact at work, side projects, and their own companies.</p>
      <BackgroundGradient containerClassName="w-3/4 m-auto rotate-1 mt-20" className="overflow-hidden p-2 rounded-lg"><img src={AboutImage} alt="img" /></BackgroundGradient>
    </div>
  )
}

export default AboutPage
