import React from 'react';
import { SectionHeader } from '../components/common/SectionHeader';
import { Award, Flame, Leaf, Clock, Heart, Users, CheckCircle2 } from 'lucide-react';

export const About = () => {
  const chefTeam = [
    { name: 'Chef Alessandro Rossi', role: 'Executive Head Chef', image: '/img/team-1.jpg', bio: 'Trained at the Culinary Institute of Florence, Chef Rossi brings 22 years of Michelin-starred expertise in northern Italian classics and truffle infusions.' },
    { name: 'Chef Vikramaditya Singh', role: 'Master of Heritage Spice', image: '/img/team-2.jpg', bio: 'Born into an Awadhi culinary dynasty in Lucknow, Chef Singh oversees our sealed clay-pot Dum Pukht techniques and slow-stewed Kashmiri saffron broths.' },
    { name: 'Chef Marcus Dubois', role: 'Senior Pastry Alchemist', image: '/img/team-3.jpg', bio: 'A Parisian master patissier whose molten Valrhona domes and sourdough fermentations have captivated critics across the continent.' },
    { name: 'Chef Elena Rostova', role: 'Sous Chef & Head of Saucier', image: '/img/team-4.jpg', bio: 'Specializing in contemporary reductions, compound butters, and wild-harvested botanical glazes.' },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* 1. Header */}
      <SectionHeader
        subtitle="Heritage & Craft"
        title="Fifteen Years of Haute Gastronomy"
        description="A sanctuary where ancient cooking arts unite with modern culinary architecture."
      />

      {/* 2. Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6 text-slate-300 leading-relaxed">
          <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Honoring the Soul of the Hearth
          </h3>
          <p>
            Established in 2011, Zestora was conceived as an homage to the sacred gathering of food and fellowship. What began as an intimate 12-table bistro in Manhattan has blossomed into an internationally renowned dining institution.
          </p>
          <p className="text-slate-400 text-sm">
            We reject mass shortcuts and synthetic preservatives. Our sourdough levains ferment for 72 hours, our stocks simmer slowly for days, and our clay ovens are seasoned with heirloom aromatic woods.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-primary font-bold text-2xl">100%</p>
              <p className="text-xs text-slate-400 mt-1">Organic Farm Certified</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-primary font-bold text-2xl">45 Days</p>
              <p className="text-xs text-slate-400 mt-1">Dry-Aged Beef Cellar</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <img src="/img/about-1.jpg" alt="Chef prep" className="rounded-2xl h-60 w-full object-cover shadow-2xl border border-slate-800" />
          <img src="/img/about-2.jpg" alt="Dining Hall" className="rounded-2xl h-60 w-full object-cover shadow-2xl border border-slate-800 mt-6" />
          <img src="/img/about-3.jpg" alt="Cocktail crafting" className="rounded-2xl h-60 w-full object-cover shadow-2xl border border-slate-800 -mt-6" />
          <img src="/img/about-4.jpg" alt="Table service" className="rounded-2xl h-60 w-full object-cover shadow-2xl border border-slate-800" />
        </div>
      </div>

      {/* 3. Core Pillars */}
      <div className="space-y-8">
        <SectionHeader
          subtitle="Our Core Standards"
          title="The Four Culinary Pillars"
          className="mb-8"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="luxury-card p-6 rounded-2xl space-y-3">
            <Leaf className="w-8 h-8 text-emerald-400" />
            <h4 className="text-lg font-bold font-heading text-white">Organic Integrity</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every green, edible flower, and herb is grown with non-GMO heirloom seeds from certified sustainable agricultural partners.
            </p>
          </div>

          <div className="luxury-card p-6 rounded-2xl space-y-3">
            <Flame className="w-8 h-8 text-rose-400" />
            <h4 className="text-lg font-bold font-heading text-white">Live Fire Mastery</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We employ traditional white binchotan charcoal and fruitwood embers to impart a subtle, smoky perfume that electric ranges cannot replicate.
            </p>
          </div>

          <div className="luxury-card p-6 rounded-2xl space-y-3">
            <Award className="w-8 h-8 text-primary" />
            <h4 className="text-lg font-bold font-heading text-white">Artisanal Precision</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every recipe is tested through hundreds of iterations to achieve harmonious acidity, texture contrast, and presentation elegance.
            </p>
          </div>

          <div className="luxury-card p-6 rounded-2xl space-y-3">
            <Heart className="w-8 h-8 text-amber-400" />
            <h4 className="text-lg font-bold font-heading text-white">Unconditional Care</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              True luxury is feeling genuinely cared for. From allergy protocols to private table arrangements, your comfort is paramount.
            </p>
          </div>
        </div>
      </div>

      {/* 4. The Master Chefs Profiles */}
      <div className="space-y-12">
        <SectionHeader
          subtitle="Leadership"
          title="The Masters Behind The Fire"
          description="A multicultural guild of passionate culinary visionaries."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {chefTeam.map((chef, i) => (
            <div key={i} className="luxury-card rounded-2xl overflow-hidden flex flex-col justify-between">
              <div className="h-72 w-full overflow-hidden bg-slate-900">
                <img src={chef.image} alt={chef.name} className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 space-y-2">
                <h4 className="text-lg font-bold font-heading text-white">{chef.name}</h4>
                <p className="text-xs font-semibold text-primary">{chef.role}</p>
                <p className="text-xs text-slate-400 leading-relaxed pt-2">{chef.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
