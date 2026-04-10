import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

const SCHEDULING_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ29TLpHW4DhPbktpbtzGL06t5ykBkxclqToQSqOhl90xHWpdGZQZacIfMJQKuaSDemJ3DA6Ak8b";

export default function BookingModal({ open, onClose }: BookingModalProps) {
  return (
    <Transition show={open} as={Fragment}>
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
                h-[92vh] sm:h-auto sm:max-h-[90vh]
                sm:max-w-4xl
                bg-gradient-to-br from-neutral-900 via-neutral-900 to-purple-950/40
                rounded-t-3xl sm:rounded-3xl
                border-t sm:border border-white/10
                shadow-2xl shadow-purple-900/30
                overflow-hidden
                pb-[env(safe-area-inset-bottom)]
              "
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 px-5 sm:px-8 py-4 border-b border-white/10 bg-black/30 backdrop-blur-sm sticky top-0 z-10">
                <div className="min-w-0">
                  <Dialog.Title className="text-base sm:text-xl font-bold text-white truncate">
                    Book a Photography Session
                  </Dialog.Title>
                  <p className="text-xs sm:text-sm text-gray-400 mt-0.5 hidden sm:block">
                    Pick a time that works for you.
                  </p>
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

              {/* Iframe */}
              <div className="flex-1 min-h-0 bg-white sm:min-h-[650px]">
                <iframe
                  src={`${SCHEDULING_URL}?gv=true`}
                  title="Book a Photography Session"
                  className="w-full h-full border-0"
                  style={{ minHeight: "100%" }}
                  allow="fullscreen"
                />
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
