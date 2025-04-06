import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'Auth App',
  description: 'Login and Register Example',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800">

            <Navbar/>

              {children}

            <Footer />

          </div>
        </AuthProvider>
      </body>
    </html>
  );
}