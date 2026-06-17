"use client";

import dynamic from "next/dynamic";

const MappaAgriturismo = dynamic(
  () => import("./MappaAgriturismo"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 rounded-xl border border-gray-100 bg-gray-100 animate-pulse" />
    ),
  }
);

interface Props {
  lat: number;
  lng: number;
  nome: string;
}

export default function MappaWrapper({ lat, lng, nome }: Props) {
  return <MappaAgriturismo lat={lat} lng={lng} nome={nome} />;
}
