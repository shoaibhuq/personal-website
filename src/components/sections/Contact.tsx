import { Link } from "react-router-dom";
import {
  BuildingOffice2Icon,
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

// import LinkedinIcon from "../../assets/social-icons/SVG/Color/LinkedIN.svg";
import InstagramIcon from "../../assets/social-icons/SVG/Color/Instagram.svg";
import GithubIcon from "../../assets/social-icons/SVG/Color/Github.svg";
import shoaib_resume from "../../assets/Contact/shoaib_resume.pdf";

export default function Contact() {
  return (
    <div className="relative isolate bg-black min-h-screen">
      <Link to="/" className="absolute top-6 left-6 z-50">
        <HomeIcon className="h-7 w-7 text-white hover:text-blue-200" />
      </Link>
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
        {/* Left Column */}
        <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
          <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
            <div className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden ring-1 ring-white/5 lg:w-1/2">
              <svg
                aria-hidden="true"
                className="absolute inset-0 size-full stroke-gray-700 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
              >
                <defs>
                  <pattern
                    x="100%"
                    y={-1}
                    id="54f88622-e7f8-4f1d-aaf9-c2f5e46dd1f2"
                    width={200}
                    height={200}
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M130 200V.5M.5 .5H200" fill="none" />
                  </pattern>
                </defs>
                <svg
                  x="100%"
                  y={-1}
                  className="overflow-visible fill-gray-800/20"
                >
                  <path d="M-470.5 0h201v201h-201Z" strokeWidth={0} />
                </svg>
                <rect
                  fill="url(#54f88622-e7f8-4f1d-aaf9-c2f5e46dd1f2)"
                  width="100%"
                  height="100%"
                  strokeWidth={0}
                />
              </svg>
              <div
                aria-hidden="true"
                className="absolute -left-56 top-[calc(100%-13rem)] transform-gpu blur-3xl lg:left-[max(-14rem,calc(100%-59rem))] lg:top-[calc(50%-7rem)]"
              >
                <div
                  style={{
                    clipPath:
                      "polygon(74.1% 56.1%, 100% 38.6%, 97.5% 73.3%, 85.5% 100%, 80.7% 98.2%, 72.5% 67.7%, 60.2% 37.8%, 52.4% 32.2%, 47.5% 41.9%, 45.2% 65.8%, 27.5% 23.5%, 0.1% 35.4%, 17.9% 0.1%, 27.6% 23.5%, 76.1% 2.6%, 74.1% 56.1%)",
                  }}
                  className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-br from-[#80caff] to-[#4f46e5] opacity-20"
                />
              </div>
            </div>
            <h2 className="text-pretty text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Get in touch
            </h2>
            <dl className="mt-10 space-y-4 text-base/7 text-gray-300">
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Address</span>
                  <BuildingOffice2Icon
                    aria-hidden="true"
                    className="h-7 w-6 text-gray-400"
                  />
                </dt>
                <dd>Dallas, TX</dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Telephone</span>
                  <PhoneIcon
                    aria-hidden="true"
                    className="h-7 w-6 text-gray-400"
                  />
                </dt>
                <dd>
                  <a href="tel:+1 (469) 544-8878" className="hover:text-white">
                    +1 (469) 544-8878
                  </a>
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Email</span>
                  <EnvelopeIcon
                    aria-hidden="true"
                    className="h-7 w-6 text-gray-400"
                  />
                </dt>
                <dd>
                  <a
                    href="mailto:huq.shoaib@gmail.com"
                    className="hover:text-white"
                  >
                    huq.shoaib@gmail.com
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Right Column */}
        <div className="px-6 pt-24 sm:pt-32 lg:px-8 lg:py-48">
          <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
            <div className="space-y-6">
              <a
                href="mailto:huq.shoaib@gmail.com"
                className="flex items-center gap-x-4 rounded-lg bg-gray-800/50 px-6 py-4 text-white hover:bg-gray-700/50 transition-colors duration-200"
              >
                <EnvelopeIcon className="h-6 w-6" />
                <span>Send an email</span>
              </a>

              <a
                href="https://www.instagram.com/shoaibhuq"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-x-4 rounded-lg bg-gray-800/50 px-6 py-4 text-white hover:bg-gray-700/50 transition-colors duration-200"
              >
                <img className="h-6 w-6" src={InstagramIcon} />
                <span>Instagram</span>
              </a>

              {/* <a
                href="https://www.linkedin.com/in/shoaibhuq"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-x-4 rounded-lg bg-gray-800/50 px-6 py-4 text-white hover:bg-gray-700/50 transition-colors duration-200"
              >
                <img className="h-6 w-6" src={LinkedinIcon} />
                <span>LinkedIn</span>
              </a> */}

              <a
                href="https://github.com/shoaibhuq"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-x-4 rounded-lg bg-gray-800/50 px-6 py-4 text-white hover:bg-gray-700/50 transition-colors duration-200"
              >
                <img className="h-6 w-6" src={GithubIcon} />
                <span>GitHub</span>
              </a>

              <a
                href={shoaib_resume}
                download
                className="flex items-center gap-x-4 rounded-lg bg-blue-600/50 px-6 py-4 text-white hover:bg-blue-500/50 transition-colors duration-200"
              >
                <ArrowDownTrayIcon className="h-6 w-6" />
                <span>Download Resume</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
