import { Poppins } from "next/font/google";

const geistPoppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistPoppins.variable} } antialiased`}
        suppressHydrationWarning
      >
        {children}

      </body>
    </html>
  );
}