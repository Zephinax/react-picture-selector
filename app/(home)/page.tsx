import Link from "next/link";
import {
  ArrowRight,
  Check,
  Code2,
  Layers3,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Zap,
} from "lucide-react";

const features = [
  {
    title: "Frictionless uploads",
    description:
      "Drag & drop, smooth progress rings, fallback percentages, and abortable requests bundled together.",
    icon: UploadCloud,
    accent: "text-cyan-600 dark:text-cyan-300",
  },
  {
    title: "Unlimited customization",
    description:
      "Tune radiuses, colors, sizing, and CSS slots so the selector matches any brand system in minutes.",
    icon: Sparkles,
    accent: "text-pink-600 dark:text-pink-300",
  },
  {
    title: "API-first mindset",
    description:
      "Pass headers, methods, and endpoints for upload/delete flows or switch into test mode instantly.",
    icon: Layers3,
    accent: "text-amber-600 dark:text-amber-300",
  },
  {
    title: "Production ready UX",
    description:
      "Accessible previews, error states, and callbacks for every critical moment in the upload lifecycle.",
    icon: ShieldCheck,
    accent: "text-emerald-600 dark:text-emerald-300",
  },
];

const checklist = [
  "Preview modal with keyboard support",
  "AbortController baked in",
  "Full API response passed back to you",
  "RTL and responsive layouts covered",
];

const codeSample = `import PictureSelector from "react-picture-selector";

export function ProfilePhoto() {
  return (
    <PictureSelector
      imageUrl="https://cdn.example.com/avatar.png"
      title="Profile Photo"
      type="profile"
      size={180}
      apiConfig={{
        baseUrl: "https://api.example.com",
        uploadUrl: "/upload",
        deleteUrl: "/avatar",
      }}
      onChangeImage={(url, response) => {
        console.log("New image:", url, response);
      }}
    />
  );
}`;

export default function HomePage() {
  return (
    <div className="relative flex-1 overflow-hidden bg-linear-to-b from-slate-50 via-white to-white text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 dark:text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 h-80 w-80 rounded-full bg-linear-to-br from-cyan-500/30 via-indigo-500/20 to-transparent blur-3xl dark:from-cyan-500/40 dark:via-indigo-500/30"
      />
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 py-16 lg:px-12 lg:py-24">
        <section className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1 text-sm text-slate-700 shadow-sm backdrop-blur dark:border-white/15 dark:bg-white/5 dark:text-white/80">
            <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-300">
              <Zap className="h-4 w-4" />
              New
            </span>
            Picture Selector v2 · Uploads, previews, test mode
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-balance leading-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            The polished way to upload pictures
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 dark:text-white/80 sm:max-w-3xl sm:text-lg">
            React Picture Selector bundles drag & drop uploads, accessible
            previews, live progress, API wiring, and graceful error states into
            one composable component. Ship delightful avatar or gallery
            experiences without reinventing the flow.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 text-base sm:flex-row sm:text-lg">
            <Link
              href="/docs"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-slate-900 shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5"
            >
              Read the docs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="https://github.com/zephinax/react-picture-selector"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-900 transition hover:border-slate-400 dark:border-white/30 dark:text-white dark:hover:border-white/60"
            >
              View on GitHub
            </Link>
          </div>
          {/*<div className="mt-12 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Setup time", value: "< 5 minutes" },
              { label: "Upload strategies", value: "Profile & rectangular" },
              { label: "Testing", value: "Interactive test mode" },
              { label: "Callbacks", value: "onUpload/onDelete/onError" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/80"
              >
                <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-white/60">
                  {stat.label}
                </p>
                <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>*/}
        </section>

        <section className="grid gap-6 text-pretty md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-3xl border border-slate-200 bg-white dark:bg-slate-900/80 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-linear-to-br dark:from-white/10 dark:via-white/5 dark:to-transparent"
              >
                <Icon className={`h-6 w-6 ${feature.accent}`} />
                <h3 className="mt-4 text-xl font-semibold leading-tight text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-slate-600 dark:text-white/75">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </section>

        <section className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-2xl shadow-cyan-500/10 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] dark:border-white/10 dark:bg-slate-900/80 dark:text-white">
          <div className="text-left sm:text-left w-full max-w-[28rem] mx-auto sm:mx-0 sm:max-w-none">
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs uppercase tracking-wide text-slate-600 dark:border-white/20 dark:text-white/70">
              <Code2 className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
              One-drop integration
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-balance leading-tight text-slate-900 dark:text-white sm:text-3xl lg:text-[40px]">
              Wire up uploads with a handful of props
            </h2>
            <p className="mt-3 text-pretty wrap-break-word text-sm leading-relaxed text-slate-600 dark:text-white/75 sm:text-base md:text-lg">
              Feed the component your endpoints once and keep the rest of your
              stack focused on core logic. Every callback receives both the
              generated URL and the original API response so nothing is lost.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700 dark:text-white/80 sm:text-base">
              {checklist.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 rounded-full bg-emerald-100 p-1 dark:bg-emerald-400/20">
                    <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-950/90 p-4 shadow-2xl shadow-black/10 dark:border-white/10 dark:bg-slate-950/80 sm:p-5 w-full max-w-[22rem] mx-auto sm:mx-0 sm:max-w-none">
            <pre className="w-full min-w-88 overflow-x-auto text-[0.65rem] leading-relaxed text-cyan-100 sm:text-xs md:text-sm">
              <code>{codeSample}</code>
            </pre>
          </div>
        </section>
      </main>
    </div>
  );
}
