import { UserProvider } from "@/contexts/userContext";
import RouteGuard from "@/lib/RouteGuard";

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <UserProvider>
          <RouteGuard>
            {children}
          </RouteGuard>
        </UserProvider>
      </body>
    </html>
  );
}