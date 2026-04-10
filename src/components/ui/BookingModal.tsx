import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  CameraIcon,
  ClockIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

const SCHEDULING_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ29TLpHW4DhPbktpbtzGL06t5ykBkxclqToQSqOhl90xHWpdGZQZacIfMJQKuaSDemJ3DA6Ak8b";

const sessionHighlights = [
  {
    icon: CameraIcon,
    title: "Full session",
    description: "Graduation, portrait, or lifestyle shoot.",
  },
  {
    icon: ClockIcon,
    title: "60 minutes",
    description: "Plenty of time for multiple looks and locations.",
  },
  {
    icon: CheckBadgeIcon,
    title: "Edited gallery",
    description: "Hand-picked, color-graded final images.",
  },
];

export default function BookingModal({ open, onClose }: BookingModalProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <Transition
      show={open}
      as={Fragment}
      afterLeave={() => setIframeLoaded(false)}
    >
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" />
        </Transition.Child>

        {/* Panel wrapper */}
        <div className="fixed inset-0 flex items-end sm:items-center justify-center sm:p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-8 sm:translate-y-4 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-8 sm:translate-y-4 sm:scale-95"
          >
            <Dialog.Panel
              className="
                relative flex flex-col w-full
                h-[94vh] sm:h-auto sm:max-h-[92vh]
                sm:max-w-6xl
                bg-gradient-to-br from-neutral-950 via-neutral-950 to-purple-950/40
                rounded-t-3xl sm:rounded-3xl
                border-t sm:border border-white/10
                shadow-2xl shadow-purple-900/40
                overflow-hidden
                pb-[env(safe-area-inset-bottom)]
              "
            >
              {/* Ambient gradient blobs */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-pink-500/15 blur-3xl"
              />

              {/* Header */}
              <div className="relative flex items-center justify-between gap-3 px-5 sm:px-8 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-20">
                <div className="min-w-0 flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-900/40">
                    <CameraIcon className="h-5 w-5 text-white" />
                  </span>
                  <div className="min-w-0">
                    <Dialog.Title className="text-base sm:text-xl font-bold text-white truncate">
                      Book a Photography Session
                    </Dialog.Title>
                    <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                      Pick a time that works for you
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <a
                    href={SCHEDULING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                    title="Open in new tab"
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Open</span>
                  </a>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center h-11 w-11 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Close booking dialog"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="relative flex-1 min-h-0 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
                {/* Decorative info sidebar (desktop only) */}
                <aside className="hidden lg:flex lg:w-72 xl:w-80 shrink-0 flex-col gap-5 p-6 xl:p-8 border-r border-white/10 bg-gradient-to-b from-purple-950/30 via-transparent to-pink-950/20 relative z-10">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-300 animate-pulse" />
                      Photography session
                    </span>
                    <h3 className="mt-4 text-2xl xl:text-3xl font-bold bg-gradient-to-br from-white via-purple-200 to-pink-300 bg-clip-text text-transparent leading-tight">
                      Let's capture something unforgettable.
                    </h3>
                    <p className="mt-3 text-sm text-gray-300/90 leading-relaxed">
                      Pick a slot and I'll take it from there. Sessions are
                      fully personalized — just show up and I'll handle the
                      rest.
                    </p>
                  </div>

                  <ul className="space-y-3">
                    {sessionHighlights.map((h) => (
                      <li
                        key={h.title}
                        className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10">
                          <h.icon className="h-4 w-4 text-purple-200" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {h.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                            {h.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-4 border-t border-white/10">
                    <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-2">
                      Scheduling powered by
                    </p>
                    <p className="text-sm font-medium text-gray-300">
                      Google Calendar
                    </p>
                  </div>
                </aside>

                {/* Iframe container */}
                <div className="relative flex-1 min-h-[600px] lg:min-h-0 bg-white overflow-hidden">
                  {/* Loading skeleton */}
                  {!iframeLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                      <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.3s]" />
                        <span className="h-3 w-3 rounded-full bg-pink-500 animate-bounce [animation-delay:-0.15s]" />
                        <span className="h-3 w-3 rounded-full bg-rose-500 animate-bounce" />
                      </div>
                      <p className="mt-4 text-sm text-gray-500">
                        Loading available times…
                      </p>
                    </div>
                  )}
                  <iframe
                    src={`${SCHEDULING_URL}?gv=true`}
                    title="Book a Photography Session"
                    className="w-full h-full border-0 block"
                    style={{ minHeight: "100%" }}
                    onLoad={() => setIframeLoaded(true)}
                    allow="fullscreen"
                  />
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
