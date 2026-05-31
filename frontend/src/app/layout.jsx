import { ThemeProvider } from "@/components/ThemeProvider"
import Sidebar from "@/components/Sidebar"
import "./globals.css"

export const metadata = {
    title: "PayAssured CRM",
    description: "Internal CRM for client and invoice recovery management",
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <ThemeProvider>
                    <div style={{ display: "flex" }}>
                        <Sidebar />
                        <main style={{
                            marginLeft: "220px",
                            flex: 1,
                            minHeight: "100vh",
                            padding: "2rem",
                        }}>
                            {children}
                        </main>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    )
}