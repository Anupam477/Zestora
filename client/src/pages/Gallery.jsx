import React, { useState } from 'react';
import { SectionHeader } from '../components/common/SectionHeader';
import { Modal } from '../components/common/Modal';
import { ZoomIn, Eye } from 'lucide-react';

export const Gallery = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const galleryItems = [
    { id: 1, title: 'Wild Truffle Calamari', category: 'dishes', image: '/img/menu-1.jpg' },
    { id: 2, title: 'Heirloom Bruschetta Crostini', category: 'dishes', image: '/img/menu-2.jpg' },
    { id: 3, title: 'Flame-Seared Prime Ribeye', category: 'dishes', image: '/img/menu-3.jpg' },
    { id: 4, title: 'Wood-Fired Truffle Pizza', category: 'dishes', image: '/img/menu-5.jpg' },
    { id: 5, title: 'Wagyu Smash Burger', category: 'dishes', image: '/img/menu-7.jpg' },
    { id: 6, title: 'Artisan Kitchen Prep & Sauces', category: 'kitchen', image: '/img/about-1.jpg' },
    { id: 7, title: 'Royal Earthen Biryani Pot', category: 'kitchen', image: '/img/about-2.jpg' },
    { id: 8, title: 'Botanical Smoked Mocktails', category: 'ambiance', image: '/img/about-3.jpg' },
    { id: 9, title: 'Main Grand Dining Hall', category: 'ambiance', image: '/img/about-4.jpg' },
    { id: 10, title: 'Evening Wine & Terrace Setting', category: 'ambiance', image: '/img/bg-hero.jpg' },
    { id: 11, title: 'Executive Chef Rossi at the Pass', category: 'chefs', image: '/img/team-1.jpg' },
    { id: 12, title: 'Master Chef Singh at Clay Hearth', category: 'chefs', image: '/img/team-2.jpg' },
  ];

  const filtered = activeTab === 'all' ? galleryItems : galleryItems.filter((i) => i.category === activeTab);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <SectionHeader
        subtitle="Visual Aesthetic"
        title="Culinary & Interior Gallery"
        description="A glimpse into the passionate artistry, fine ingredients, and evocative dining atmosphere of Zestora."
      />

      {/* Tabs */}
      <div className="flex justify-center gap-2 flex-wrap">
        {[
          { key: 'all', label: 'All Photographs' },
          { key: 'dishes', label: 'Artisanal Dishes' },
          { key: 'ambiance', label: 'Atmosphere & Bar' },
          { key: 'kitchen', label: 'Kitchen Craft' },
          { key: 'chefs', label: 'Chefs at Work' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-primary text-[#0B1120] shadow-lg shadow-primary/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Masonry / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedPhoto(item)}
            className="group relative rounded-2xl overflow-hidden h-64 bg-slate-900 border border-slate-800 cursor-pointer luxury-card"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
                {item.category}
              </span>
              <h4 className="text-sm font-bold font-heading text-white">{item.title}</h4>
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-300">
                <ZoomIn className="w-3.5 h-3.5 text-primary" /> View High-Res
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Modal
        isOpen={Boolean(selectedPhoto)}
        onClose={() => setSelectedPhoto(null)}
        title={selectedPhoto?.title || 'Gallery View'}
        maxWidth="max-w-4xl"
      >
        {selectedPhoto && (
          <div className="space-y-4">
            <img
              src={selectedPhoto.image}
              alt={selectedPhoto.title}
              className="w-full h-[500px] object-cover rounded-2xl"
            />
            <p className="text-sm text-slate-300 text-center font-medium">
              {selectedPhoto.title} — Zestora Haute Cuisine
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};
