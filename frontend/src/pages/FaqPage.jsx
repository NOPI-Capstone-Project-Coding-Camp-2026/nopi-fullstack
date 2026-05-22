import DashboardLayout from '../components/layout/DashboardLayout';
import FAQAccordion from '../components/faq/FAQAccordion';
import { faqItems } from '../data/faqItems';

const FaqPage = () => {
  return (
    <DashboardLayout>
      <section className="mx-auto w-full max-w-4xl">
        <div>
          <p className="inline-flex rounded-full bg-[#fff1e4] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#d96f0a]">
            Pusat Bantuan NOPI
          </p>
          <h1 className="mt-4 text-[1.9rem] font-semibold leading-tight text-[#ea8327] sm:text-[2.3rem] lg:text-[2.8rem]">
            Pertanyaan Umum Seputar Fitur NOPI
          </h1>
          <p className="mt-3 max-w-3xl text-[0.95rem] leading-7 text-[#2d2d2d] sm:text-[1.02rem]">
            Pelajari bagaimana NOPI membantu UMKM mencatat nota, memvalidasi hasil AI, dan menghitung
            estimasi keuntungan.
          </p>
        </div>

        <div className="mt-7 overflow-hidden rounded-[8px] border border-[#f2e4d7] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
          <FAQAccordion items={faqItems} />
        </div>
      </section>
    </DashboardLayout>
  );
};

export default FaqPage;
