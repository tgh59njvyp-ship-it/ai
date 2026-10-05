import React from 'react';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { BeforeAfterSection } from './BeforeAfterSection';
import { CoreValuesSection } from './CoreValuesSection';
import { ConstitutionShowcase } from './ConstitutionShowcase';
import { OwnYourCodeSection } from './OwnYourCodeSection';
import { FeaturesSection } from './FeaturesSection';
import { TemplatesMarketplace } from './TemplatesMarketplace';
import { SecuritySection } from './SecuritySection';
import { PricingSection } from './PricingSection';
import { FaqSection } from './FaqSection';
import { LandingFooter } from './LandingFooter';
import { useProject } from '../../context/ProjectContext';
import { ArrowRight, Sparkles, Terminal } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setDisplayMode } = useProject();

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      <LandingHeader />

      <main className="flex-1">
        <HeroSection />
        <BeforeAfterSection />
        <CoreValuesSection />
        <ConstitutionShowcase />
        <OwnYourCodeSection />
        <FeaturesSection />
        <TemplatesMarketplace />
        <SecuritySection />
        <PricingSection />
        <FaqSection />

        {/* Final CTA Banner */}
        <section className="py-20 bg-gradient-to-b from-[#080c14] to-[#04060a] border-t border-slate-800/80 text-center select-none">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-lg shadow-cyan-500/10">
              <Sparkles className="w-6 h-6" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              今すぐ、あなたのアイデアを<br />
              本物のソフトウェアへ。
            </h2>

            <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
              ブラウザ上ですぐに起動できます。セットアップ不要、クレジットカード不要。
              コードはいつでもローカルへ持ち出せます。
            </p>

            <div className="pt-2">
              <button
                onClick={() => setDisplayMode('studio')}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-semibold shadow-xl shadow-cyan-600/30 transition-all inline-flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
              >
                <span>開発スタジオを起動する (無料)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};
