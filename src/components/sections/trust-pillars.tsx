'use client';

import React from 'react';
import { ShieldCheck, Award, Truck } from 'lucide-react';

const trustItems = [
  {
    icon: ShieldCheck,
    title: "COMPRA SEGURA"
  },
  {
    icon: Award,
    title: "PRODUTO ORIGINAL"
  },
  {
    icon: Truck,
    title: "ENVIO PARA TODO BRASIL"
  },
];

export default function TrustBar() {
  return (
    <div className="w-full bg-[#1A1A1A] py-4 shadow-md">
      <div className="container-custom">
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center justify-center text-center md:text-left"
              >
                <Icon
                  size={24}
                  className="text-[#00BFFF]"
                  strokeWidth={2}
                />
                <span className="text-white font-bold text-xs md:text-sm mt-1 md:mt-0 md:ml-3">
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
