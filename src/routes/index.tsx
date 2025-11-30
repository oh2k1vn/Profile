import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: App });

function App() {
  return (
    <section>
      <div className="relative pt-24 md:pt-36">
        <div className="mask-b-from-35% mask-b-to-90% absolute inset-0 top-56 -z-20 lg:top-32">
          <img
            src="https://tailark.com/_next/image?url=https%3A%2F%2Fik.imagekit.io%2Flrigu76hy%2Ftailark%2Fnight-background.jpg%3FupdatedAt%3D1745733451120&w=3840&q=75 1x"
            alt="background"
            loading="lazy"
            width="3276"
            height="4095"
            decoding="async"
            data-nimg="1"
            className="hidden size-full text-transparent dark:block"
          />
        </div>
        <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]" />

        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
            <div>
              <a
                className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
                href="#link"
              >
                <span className="text-foreground text-sm">Introducing Support for AI Models</span>
                <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>
                <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                  <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                    <span className="flex size-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-arrow-right m-auto size-3"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </span>
                    <span className="flex size-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-arrow-right m-auto size-3"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </a>
            </div>
            <h1 className="mx-auto mt-8 max-w-4xl text-balance text-5xl max-md:font-semibold md:text-7xl lg:mt-16 xl:text-[5.25rem]">
              <span className="sr-only">Modern Solutions for Customer Engagement</span>
              <span aria-hidden="true" className="inline-block whitespace-pre">
                Modern
              </span>
              <span aria-hidden="true" className="inline-block whitespace-pre">
                {' '}
              </span>
              <span aria-hidden="true" className="inline-block whitespace-pre">
                Solutions
              </span>
              <span aria-hidden="true" className="inline-block whitespace-pre">
                {' '}
              </span>
              <span aria-hidden="true" className="inline-block whitespace-pre">
                for
              </span>
              <span aria-hidden="true" className="inline-block whitespace-pre">
                {' '}
              </span>
              <span aria-hidden="true" className="inline-block whitespace-pre">
                Customer
              </span>
              <span aria-hidden="true" className="inline-block whitespace-pre">
                {' '}
              </span>
              <span aria-hidden="true" className="inline-block whitespace-pre">
                Engagement
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-balance text-lg">
              Highly customizable components for building modern websites and applications that look
              and feel the way you mean it.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
              <div className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                <a
                  className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 shadow-sm shadow-black/20 bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-xl px-5 text-base"
                  href="#link"
                >
                  <span className="text-nowrap">Start Building</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
