import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lahore Motors | A Better Toyota Experience",
  description:
    "Explore Toyota Yaris, Corolla and Fortuner at Lahore Motors. Compare estimated prices, calculate running costs and start your booking enquiry.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
