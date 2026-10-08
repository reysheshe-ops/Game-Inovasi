import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC<{ variant?: 'badge' | 'button' }> = ({ variant = 'button' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as installed PWA standalone, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={
          variant === 'badge'
            ? 'flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow transition transform hover:scale-105 active:scale-95'
            : 'flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition transform hover:scale-105 active:scale-95 text-sm'
        }
        title="Pasang aplikasi ke Layar Utama (Bisa main offline)"
      >
        <Download className="w-4 h-4 animate-bounce" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow transition"
          title="Pasang di iOS / iPad"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Install PWA</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border-4 border-amber-300">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-amber-600" />
                  Pasang di iPad / iPhone
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                Mainkan tanpa internet langsung dari Layar Utama:
                <br /><br />
                1. Sentuh tombol <strong>Bagikan (Share)</strong> di bilah browser Safari.
                <br />
                2. Gulir ke bawah lalu pilih <strong>&quot;Tambah ke Layar Utama&quot;</strong> (Add to Home Screen).
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-3 right-3 z-50 flex items-center gap-2 rounded-2xl bg-amber-600/95 text-white px-3.5 py-2 text-xs font-bold shadow-xl border-2 border-amber-200 animate-pulse">
      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
      Mode Offline Aktif (Bisa Dimainkan Tanpa Kuota)
    </div>
  );
};
