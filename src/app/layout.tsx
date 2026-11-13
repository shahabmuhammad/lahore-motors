import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lahore Motors | A Better Toyota Experience",
  description:
    "Explore Toyota Yaris, Corolla and Fortuner at Lahore Motors. Compare estimated prices, calculate running costs and start your booking enquiry.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://staging.metamod.ai/assets/metamod-embedded-chat/loader/v1/loader.min.js"
          integrity="sha384-6pyfuX5Bg8Yya06CiZp00gfZq6ZENMKpQJziZi1pJtVJQgEndBxGBT+KMdxVd/KO"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
