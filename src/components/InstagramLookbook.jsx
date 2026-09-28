import React from 'react';
import { Heart, ArrowUpRight } from 'lucide-react';
import InstagramIcon from './InstagramIcon';

export default function InstagramLookbook({ settings, onExplore }) {
  const handle = settings?.instagramHandle || '@dressgallery_fashion';

  const lookbookItems = [
    {
      img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
      tag: '#FloralMaxiMagic',
      likes: '842'
    },
    {
      img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80',
      tag: '#DailyComfortKurti',
      likes: '1.2k'
    },
    {
      img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
      tag: '#EveningGownGlow',
      likes: '2.1k'
    },
    {
      img: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=600&q=80',
      tag: '#SatinElegance',
      likes: '965'
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-brand-deep text-xs font-bold uppercase tracking-wider mb-1">
              <InstagramIcon className="w-4 h-4" />
              <span>Instagram Lookbook</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark">
              Fashion Lookbook
            </h2>
            <p className="text-xs text-brand-muted mt-1">
              Curated everyday styles and outfit inspiration.
            </p>
          </div>

          <a
            href={`https://instagram.com`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-dark hover:text-brand-deep bg-brand-soft/60 px-4 py-2 rounded-full border border-brand-pink/30 transition self-start sm:self-auto"
          >
            <span>Follow {handle}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {lookbookItems.map((item, idx) => (
            <div 
              key={idx}
              onClick={onExplore}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-brand-cream border border-brand-pink/20 cursor-pointer shadow-xs hover:shadow-soft transition"
            >
              <img
                src={item.img}
                alt={item.tag}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3.5 text-white">
                <div className="flex justify-end">
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold">
                    <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                    <span>{item.likes}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold">{item.tag}</p>
                  <p className="text-[10px] text-white/80 font-medium">Click to shop outfits</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
