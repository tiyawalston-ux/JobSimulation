import type { MetadataRoute } from "next";

// Lets people "install" the app to their phone's home screen.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Day One — Try a Career",
    short_name: "Day One",
    description: "Live a simulated day on the job before you choose a career.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f6f3",
    theme_color: "#4f46e5",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
