import { FaWhatsapp, FaInstagram } from 'react-icons/fa6';

const WHATSAPP_NUMERO = '50684460066';

export function Footer() {
  return (
    <footer className="border-t border-surface-alt px-4 py-6 sm:px-6 mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-text-muted">
        <p>Lotes en venta en todo Costa Rica.</p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <a
            href={`https://wa.me/${WHATSAPP_NUMERO}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-text"
          >
            <FaWhatsapp className="text-base" />
            Escribinos por WhatsApp
          </a>
          <a
            href="https://instagram.com/tu-usuario"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-text"
          >
            <FaInstagram className="text-base" />
            Seguinos en Instagram
          </a>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-text-muted mt-4">
        <p>La disponibilidad e información de cada lote puede cambiar sin previo aviso.</p>
        <p>© {new Date().getFullYear()} Lotes CR</p>
      </div>
    </footer>
  );
}