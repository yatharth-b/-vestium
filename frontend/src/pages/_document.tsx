import { Html, Head, Main, NextScript } from "next/document";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="dark">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Main />
          <NextScript />
        </ThemeProvider>
      </body>
    </Html>
  );
}
