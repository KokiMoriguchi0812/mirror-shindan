import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Header from "@/components/Header";

const noto = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mirror-shindan.vercel.app"),
  title: "ミラー診断 | 自分が思う自分と他人が見る自分を知る",
  description:
    "友人に診断してもらい、自己像と他者像のギャップを可視化する日本人向け性格診断。16タイプで対人関係・恋愛・職場に活かせる。",
  openGraph: {
    title: "ミラー診断",
    description: "「自分が思う自分」と「他人が見る自分」のギャップを可視化する",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={noto.variable}>
      <body className="min-h-screen antialiased">
        <AuthProvider>
          <Header />
          <div className="pt-14">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
