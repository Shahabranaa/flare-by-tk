import type { Metadata } from 'next';
import { MapPin, Phone, Clock, Flame } from 'lucide-react';

export const metadata: Metadata = { title: 'About — Flare by TK' };

export default function About() {
  return (
    <div>
      <section className="relative h-64 flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-orange-950/30 to-zinc-950" />
        <div className="relative z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-2">Our Story</h1>
          <p className="text-zinc-300 text-lg">Born from fire. Built for Bahawalpur.</p>
        </div>
      </section>

      <section className="py-16 px-4 max-w-4xl mx-auto">
        <div className="space-y-8 text-zinc-300 text-base leading-relaxed">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-black text-white">Born from Fire</h2>
            </div>
            <p>
              Flare by TK started with a simple belief: Pakistani fast-casual dining deserves a premium upgrade. We didn&apos;t want to serve just another standard burger. We wanted to serve an experience.
            </p>
          </div>

          <p>
            Located near Dubai Chowk in Bahawalpur, we use only the freshest ingredients, authentic spices, and the transformative power of the open flame. Our meat is marinated for hours, our naans are baked fresh, and our signature sauces are crafted in-house daily.
          </p>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="aspect-video bg-zinc-800 rounded-2xl overflow-hidden relative">
              <div className="w-full h-full flex items-center justify-center text-6xl">🍔</div>
            </div>
            <div className="aspect-video bg-zinc-800 rounded-2xl overflow-hidden relative">
              <div className="w-full h-full flex items-center justify-center text-6xl">🍛</div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-white mb-3">Visit Us in Bahawalpur</h2>
            <p>
              Whether you&apos;re craving a loaded burger, a comforting biryani, or the best broast in town, our doors are open. Order online or come visit us — we&apos;re right near Dubai Chowk.
            </p>
          </div>
        </div>

        <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8">
          <h3 className="font-black text-white text-xl mb-6">Location &amp; Hours</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-zinc-500 text-xs mb-1">Address</p>
                <p className="text-white font-medium text-sm">Near Dubai Chowk, Mehmood CNG<br />Bahawalpur, Punjab, Pakistan</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-zinc-500 text-xs mb-1">Contact</p>
                <p className="text-white font-medium text-sm">0345-1116520</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-zinc-500 text-xs mb-1">Opening Hours</p>
                <p className="text-white font-medium text-sm">Every Day<br />12:00 PM – 1:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
