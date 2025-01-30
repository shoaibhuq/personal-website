import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

export default function Photography() {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 500]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -500]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-500, 500]),
    springConfig
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      <div
        ref={ref}
        className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
      >
        {/* Add home icon */}
        <Link to="/" className="absolute top-6 left-6 z-50">
          <HomeIcon className="h-10 w-10 text-gray-300/50 hover:text-blue-200" />
        </Link>
        <Header />
        <motion.div
          style={{
            rotateX,
            rotateZ,
            translateY,
            opacity,
          }}
        >
          <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
            {firstRow.map((photo) => (
              <PhotoCard
                photo={photo}
                translate={translateX}
                key={photo.title}
              />
            ))}
          </motion.div>
          <motion.div className="flex flex-row mb-20 space-x-20 ">
            {secondRow.map((photo) => (
              <PhotoCard
                photo={photo}
                translate={translateXReverse}
                key={photo.title}
              />
            ))}
          </motion.div>
          <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
            {thirdRow.map((photo) => (
              <PhotoCard
                photo={photo}
                translate={translateX}
                key={photo.title}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      <ContactSection />
    </div>
  );
}

const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
        Capturing Moments
        <br />
        That Last Forever
      </h1>
      <p className="max-w-2xl text-lg md:text-xl mt-8 text-gray-300">
        Professional photography services for graduation, portraits, weddings
        and special events. Let's create timeless memories together.
      </p>
    </div>
  );
};

const PhotoCard = ({
  photo,
  translate,
}: {
  photo: {
    title: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={photo.title}
      className="group/photo h-96 w-[30rem] relative flex-shrink-0"
    >
      <div className="block group-hover/photo:shadow-2xl transition-shadow">
        <img
          src={photo.thumbnail}
          className="object-cover object-center absolute h-full w-full inset-0 rounded-xl border-2 border-purple-900/50"
          alt={photo.title}
        />
      </div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/photo:opacity-100 text-white font-medium text-lg backdrop-blur-sm bg-black/30 px-4 py-2 rounded-lg">
        {photo.title}
      </h2>
    </motion.div>
  );
};

const ContactSection = () => {
  return (
    <section className="py-20 px-6 sm:px-8 lg:px-12 bg-black/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-8">
          Schedule a Session
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6 text-gray-300">
            <p className="text-lg">
              Ready to create something amazing? Let's discuss your photography
              needs!
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a href="tel:+14695448878" className="hover:text-white">
                  +1 (469) 544-8878
                </a>
              </div>
              <div className="flex items-center gap-4">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:huq.shoaib@gmail.com"
                  className="hover:text-white"
                >
                  huq.shoaib@gmail.com
                </a>
              </div>
            </div>
          </div>
          {/* <form className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <textarea
                placeholder="Message"
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity">
              Send Message
            </button>
          </form> */}
        </div>
      </div>
    </section>
  );
};

import photo1 from "../../assets/Photography/photo1.jpg";
import photo2 from "../../assets/Photography/photo2.jpg";
import photo3 from "../../assets/Photography/photo3.jpg";
import photo4 from "../../assets/Photography/photo4.jpg";
import photo5 from "../../assets/Photography/photo5.jpg";
import photo6 from "../../assets/Photography/photo6.jpg";
import photo7 from "../../assets/Photography/photo7.jpg";
import photo8 from "../../assets/Photography/photo8.jpg";
import photo9 from "../../assets/Photography/photo9.jpg";
import photo10 from "../../assets/Photography/photo10.jpg";
import photo11 from "../../assets/Photography/photo11.jpg";
import photo12 from "../../assets/Photography/photo12.jpg";
import photo13 from "../../assets/Photography/photo13.jpg";
import photo14 from "../../assets/Photography/photo14.jpg";
import photo15 from "../../assets/Photography/photo15.jpg";

// Sample photo data - replace with your actual images
const photos = [
  { title: "Photo 1", thumbnail: photo1 },
  { title: "Photo 2", thumbnail: photo2 },
  { title: "Photo 3", thumbnail: photo3 },
  { title: "Photo 4", thumbnail: photo4 },
  { title: "Photo 5", thumbnail: photo5 },
  { title: "Photo 6", thumbnail: photo6 },
  { title: "Photo 7", thumbnail: photo7 },
  { title: "Photo 8", thumbnail: photo8 },
  { title: "Photo 9", thumbnail: photo9 },
  { title: "Photo 10", thumbnail: photo10 },
  { title: "Photo 11", thumbnail: photo11 },
  { title: "Photo 12", thumbnail: photo12 },
  { title: "Photo 13", thumbnail: photo13 },
  { title: "Photo 14", thumbnail: photo14 },
  { title: "Photo 15", thumbnail: photo15 },
];

const firstRow = photos.slice(0, 5);
const secondRow = photos.slice(5, 10);
const thirdRow = photos.slice(10, 15);
