import { FaFacebook, FaInstagram, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-black/40 backdrop-blur-md border-t border-orange-500/20 mt-20">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Descripción */}
          <div>
            <h3 className="text-xl font-bold text-orange-400 mb-4">Buenos Frizados</h3>
            <p className="text-gray-300 leading-relaxed">
              Especialistas en frizados artesanales congelados.
              Ofrecemos productos precocidos o crudos de calidad, listos para freír en casa
              para brindarte la mejor experiencia culinaria.
            </p>
            <p className="text-sm text-orange-300 mt-3 font-medium">
              ❄️ Todos nuestros productos son congelados crudos o precocidos.
            </p>
          </div>

          {/* Información de Contacto */}
          <div>
            <h4 className="text-lg font-semibold text-orange-400 mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <FaPhone className="text-orange-400" />
                <span>+54 9 11 2321 5349</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <FaEnvelope className="text-orange-400" />
                <span>info@buenosfrizados.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <FaMapMarkerAlt className="text-orange-400" />
                <div>
                  <p>Cerrito 1138, Bernal Oeste</p>
                  <p className="text-sm text-gray-400">Buenos Aires, Argentina</p>
                </div>
              </div>
            </div>
          </div>

          {/* Redes Sociales */}
          <div>
            <h4 className="text-lg font-semibold text-orange-400 mb-4">Seguinos</h4>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/buenosfrizados"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 hover:bg-orange-500/30 hover:text-orange-300 transition-colors"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://instagram.com/buenosfrizados"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 hover:bg-orange-500/30 hover:text-orange-300 transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://wa.me/5491123215349"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 hover:bg-orange-500/30 hover:text-orange-300 transition-colors"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-400">
                Horarios de atención: Lunes y Viernes
              </p>
              <p className="text-sm text-gray-400">
                9:00 - 18:00 hs
              </p>
              <div className="mt-3 p-2 bg-orange-500/10 rounded border border-orange-500/20">
                <p className="text-xs text-orange-300 font-medium">
                  🚚 Entregas disponibles
                </p>
                <p className="text-xs text-gray-300">
                  Wilde, Quilmes, Bernal
                </p>
                <p className="text-xs text-gray-400">
                  Pedido mínimo: $40.000
                </p>
                <div className="mt-2 pt-2 border-t border-orange-500/10">
                  <p className="text-xs text-orange-300 font-medium">
                    🏠 Retiro en domicilio
                  </p>
                  <p className="text-xs text-gray-300">
                    Cerrito 1138, Bernal Oeste
                  </p>
                  <p className="text-xs text-gray-400">
                    Sin mínimo de compra
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-orange-500/20 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Buenos Frizados. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}