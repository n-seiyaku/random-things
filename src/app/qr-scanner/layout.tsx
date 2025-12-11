import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Scanner",
};

export default function QrScannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
