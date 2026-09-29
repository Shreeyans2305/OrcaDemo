/**
 * Indian Coastal Ports, Harbors & Landing Centers Gazetteer
 */

export interface PortLocation {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  type: 'major_port' | 'fishing_harbor' | 'landing_center';
  description: string;
}

export const INDIAN_PORTS: PortLocation[] = [
  {
    id: 'rameswaram',
    name: 'Rameswaram Fishing Harbor',
    state: 'Tamil Nadu',
    lat: 9.2876,
    lng: 79.3129,
    type: 'fishing_harbor',
    description: 'Major artisanal and trawler fishing harbor in Palk Strait / Gulf of Mannar.'
  },
  {
    id: 'dhanushkodi',
    name: 'Dhanushkodi Landing Point',
    state: 'Tamil Nadu',
    lat: 9.1764,
    lng: 79.4184,
    type: 'landing_center',
    description: 'Southern tip landing point near the International Maritime Boundary Line (IMBL).'
  },
  {
    id: 'kochi',
    name: 'Cochin (Kochi) Fisheries Harbor',
    state: 'Kerala',
    lat: 9.9312,
    lng: 76.2673,
    type: 'major_port',
    description: 'Major hub for pelagic and demersal marine catch along the Malabar coast.'
  },
  {
    id: 'kollam',
    name: 'Neendakara Fishing Harbor (Kollam)',
    state: 'Kerala',
    lat: 8.9392,
    lng: 76.5398,
    type: 'fishing_harbor',
    description: 'Premier deep-sea trawling and squid jigging center.'
  },
  {
    id: 'veraval',
    name: 'Veraval Fisheries Harbor',
    state: 'Gujarat',
    lat: 20.9077,
    lng: 70.3678,
    type: 'fishing_harbor',
    description: 'Largest marine fish landing port in India, Saurashtra coast.'
  },
  {
    id: 'porbandar',
    name: 'Porbandar Port',
    state: 'Gujarat',
    lat: 21.6417,
    lng: 69.6093,
    type: 'major_port',
    description: 'All-weather port and major commercial trawler base on Arabian Sea.'
  },
  {
    id: 'okha',
    name: 'Okha Harbor',
    state: 'Gujarat',
    lat: 22.4664,
    lng: 69.0716,
    type: 'fishing_harbor',
    description: 'Entrance to Gulf of Kutch, critical proximity to Indo-Pak maritime boundary.'
  },
  {
    id: 'visakhapatnam',
    name: 'Visakhapatnam Fishing Harbor',
    state: 'Andhra Pradesh',
    lat: 17.6868,
    lng: 83.2185,
    type: 'major_port',
    description: 'East coast deep-sea shrimp trawler and tuna longliner terminal.'
  },
  {
    id: 'chennai',
    name: 'Kasimedu Fishing Harbor (Chennai)',
    state: 'Tamil Nadu',
    lat: 13.1256,
    lng: 80.2974,
    type: 'major_port',
    description: 'Primary mechanized boat and gillnet center in Bay of Bengal.'
  },
  {
    id: 'mangalore',
    name: 'Mangalore (Old Port / Bunder)',
    state: 'Karnataka',
    lat: 12.8615,
    lng: 74.8361,
    type: 'fishing_harbor',
    description: 'Purse-seine and multi-day mechanized boat harbor.'
  },
  {
    id: 'sasoon_dock',
    name: 'Sassoon Docks (Mumbai)',
    state: 'Maharashtra',
    lat: 18.9130,
    lng: 72.8228,
    type: 'fishing_harbor',
    description: 'Historic wet dock handling vast landings for greater Mumbai.'
  },
  {
    id: 'ratnagiri',
    name: 'Mirkarwada Fishing Harbor (Ratnagiri)',
    state: 'Maharashtra',
    lat: 16.9902,
    lng: 73.2801,
    type: 'fishing_harbor',
    description: 'Konkan coast marine fishing base.'
  },
  {
    id: 'paradip',
    name: 'Paradip Fishing Harbor',
    state: 'Odisha',
    lat: 20.3168,
    lng: 86.6114,
    type: 'major_port',
    description: 'Mahanadi river mouth harbor serving Odisha and West Bengal fleets.'
  },
  {
    id: 'digha',
    name: 'Digha Mohana Fishery Harbor',
    state: 'West Bengal',
    lat: 21.6266,
    lng: 87.5255,
    type: 'landing_center',
    description: 'Hilsa and pomfret landing terminal on northern Bay of Bengal.'
  },
  {
    id: 'kanyakumari',
    name: 'Chinnamuttom Fishing Harbor',
    state: 'Tamil Nadu',
    lat: 8.0950,
    lng: 77.5612,
    type: 'fishing_harbor',
    description: 'Tri-junction harbor where Arabian Sea, Indian Ocean, and Bay of Bengal converge.'
  }
];

export function findNearestPort(pos: { lat: number; lng: number }): { port: PortLocation; distanceKm: number } {
  let nearest = INDIAN_PORTS[0];
  let minD = Infinity;

  for (const p of INDIAN_PORTS) {
    const d = Math.hypot(p.lat - pos.lat, p.lng - pos.lng) * 111;
    if (d < minD) {
      minD = d;
      nearest = p;
    }
  }

  return { port: nearest, distanceKm: minD };
}

export function searchPorts(query: string): PortLocation[] {
  const q = query.toLowerCase().trim();
  if (!q) return INDIAN_PORTS;
  return INDIAN_PORTS.filter(
    p =>
      p.name.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}
