import React from 'react'

// `ratio` = ancho/alto del PNG recortado; `scale` = altura relativa a SECIHTI
// para que los tres logos tengan un peso visual parecido.
const LOGOS = [
  { src: '/logos/web/secihti.png', alt: 'SECIHTI · Ciencia y Tecnología · CIDESI', ratio: 11.81, scale: 1 },
  { src: '/logos/web/oblea-multiproyecto.png', alt: 'Oblea Multiproyecto', ratio: 2.375, scale: 1.2 },
  { src: '/logos/web/mexico-bajio-trust.png', alt: 'México Bajío Trust Hub', ratio: 2.3, scale: 1.3 },
]

// El ancho de cada logo se reparte con flex-grow proporcional a ratio * scale,
// así los tres encogen juntos y conservan la proporción entre ellos.
export function BrandLogos({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 ${className}`}>
      {LOGOS.map((logo, i) => (
        <React.Fragment key={logo.src}>
          {i > 0 && <span className="self-stretch w-px my-1 bg-slate-700/70 shrink-0" aria-hidden="true" />}
          <div className="min-w-0" style={{ flex: `${logo.ratio * logo.scale} 1 0%` }}>
            <img src={logo.src} alt={logo.alt} className="block w-full h-auto select-none" draggable="false" />
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}
