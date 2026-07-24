export default function BannerSection() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:px-8 lg:py-16">
      <div className="w-full max-w-2xl text-center lg:text-left">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 animate-[fadeInUp_0.6s_ease-out]">
          Family Tree Project
        </p>
        <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl animate-[fadeInUp_0.8s_ease-out]">
          Discover your family story in one place.
        </h1>
        <p className="mt-4 text-base leading-7 text-gray-600 sm:text-lg animate-[fadeInUp_1s_ease-out]">
          Build connections, preserve memories, and explore your family history with a simple and beautiful experience.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row sm:justify-start animate-[fadeInUp_1.1s_ease-out]">
          <a
            href="/members"
            className="rounded-lg bg-blue-600 px-5 py-3 text-center font-medium text-white transition duration-300 hover:-translate-y-1 hover:bg-blue-700"
          >
            View Members
          </a>
          <a
            href="/family-tree"
            className="rounded-lg border border-gray-300 px-5 py-3 text-center font-medium text-gray-700 transition duration-300 hover:-translate-y-1 hover:bg-gray-100"
          >
            Explore Tree
          </a>
        </div>
      </div>

      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-lg transition duration-500 hover:-translate-y-2 hover:shadow-2xl animate-[fadeInUp_0.9s_ease-out]">
        <img
          src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=80"
          alt="Family tree and family together"
          className="h-56 w-full rounded-xl object-cover sm:h-64 lg:h-72"
        />
      </div>
    </section>
  );
}
