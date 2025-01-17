import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <main className="relative isolate min-h-full h-screen">
        <img
          alt="404 Not Found Image"
          src="https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=8&con=-15&sat=-75"
          className="absolute inset-0 -z-10 size-full object-cover object-top"
        />
        <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
          <p className="text-base/8 font-semibold text-white">404</p>
          <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            Page not found
          </h1>
          <p className="mt-6 text-pretty text-lg font-medium text-white/70 sm:text-xl/8">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-10 flex justify-center">
            <Link to="/" className="text-sm/7 font-semibold text-white">
              <span aria-hidden="true">&larr;</span> Back to home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
